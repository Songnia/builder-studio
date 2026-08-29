<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Services\SubscriptionEntitlementService;
use App\Services\OnboardingLifecycleService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        return Invoice::where('user_id', $request->user()->id)
            ->with('items')
            ->get();
    }

    public function store(Request $request, SubscriptionEntitlementService $subscriptions, OnboardingLifecycleService $onboarding)
    {
        if ($denied = $subscriptions->authorize($request->user(), 'invoicing')) {
            return $denied;
        }

        $validated = $request->validate([
            'invoice_number' => 'required|string|unique:invoices,invoice_number',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
            'client_name' => 'required|string',
            'client_email' => 'required|email',
            'client_phone' => 'nullable|string',
            'client_address' => 'nullable|string',
            'tax_rate' => 'required|numeric|min:0|max:100',
            'include_tax' => 'nullable|boolean',
            'total_amount' => 'required|numeric|min:0.01',
            'amount_paid' => 'nullable|numeric|min:0|lte:total_amount',
            'studio_info' => 'nullable|json',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.total' => 'required|numeric|min:0',
        ]);

        $invoice = DB::transaction(function () use ($validated, $request) {
            $amount_paid = $validated['amount_paid'] ?? 0;
            $status = 'pending';
            if ($amount_paid > 0 && $amount_paid < $validated['total_amount']) {
                $status = 'partially_paid';
            } elseif ($amount_paid >= $validated['total_amount']) {
                $status = 'paid';
            }

            $invoice = Invoice::create([
                'user_id' => $request->user()->id,
                'invoice_number' => $validated['invoice_number'],
                'issue_date' => $validated['issue_date'],
                'due_date' => $validated['due_date'],
                'client_name' => $validated['client_name'],
                'client_email' => $validated['client_email'],
                'client_phone' => $validated['client_phone'] ?? null,
                'client_address' => $validated['client_address'] ?? null,
                'tax_rate' => $validated['tax_rate'],
                'include_tax' => $validated['include_tax'] ?? false,
                'total_amount' => $validated['total_amount'],
                'amount_paid' => $amount_paid,
                'studio_info' => isset($validated['studio_info']) ? json_decode($validated['studio_info'], true) : null,
                'status' => $status,
                'currency' => 'FCFA',
            ]);

            foreach ($validated['items'] as $item) {
                $invoice->items()->create($item);
            }

            return $invoice->load('items');
        });

        $eventName = $request->user()->invoices()->whereKeyNot($invoice->id)->exists()
            ? 'invoice_created'
            : 'first_invoice_created';
        $onboarding->record($request->user(), $eventName, $invoice);

        return response()->json($invoice, 201);
    }

    public function show($id, Request $request)
    {
        return Invoice::where('user_id', $request->user()->id)
            ->with('items')
            ->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $invoice = Invoice::where('user_id', $request->user()->id)->findOrFail($id);

        $validated = $request->validate([
            'invoice_number' => 'required|string|unique:invoices,invoice_number,'.$id,
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
            'client_name' => 'required|string',
            'client_email' => 'required|email',
            'client_phone' => 'nullable|string',
            'client_address' => 'nullable|string',
            'tax_rate' => 'required|numeric|min:0|max:100',
            'include_tax' => 'nullable|boolean',
            'total_amount' => 'required|numeric|min:0.01',
            'amount_paid' => 'nullable|numeric|min:0|lte:total_amount',
            'studio_info' => 'nullable|json',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.total' => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($validated, $invoice) {
            $amount_paid = $validated['amount_paid'] ?? 0;
            $status = 'pending';
            if ($amount_paid > 0 && $amount_paid < $validated['total_amount']) {
                $status = 'partially_paid';
            } elseif ($amount_paid >= $validated['total_amount']) {
                $status = 'paid';
            }

            $invoice->update([
                'invoice_number' => $validated['invoice_number'],
                'issue_date' => $validated['issue_date'],
                'due_date' => $validated['due_date'],
                'client_name' => $validated['client_name'],
                'client_email' => $validated['client_email'],
                'client_phone' => $validated['client_phone'] ?? null,
                'client_address' => $validated['client_address'] ?? null,
                'tax_rate' => $validated['tax_rate'],
                'include_tax' => $validated['include_tax'] ?? false,
                'total_amount' => $validated['total_amount'],
                'amount_paid' => $amount_paid,
                'studio_info' => isset($validated['studio_info']) ? json_decode($validated['studio_info'], true) : null,
                'status' => $status,
            ]);

            // Plus simple : on supprime les anciens items et on recrée les nouveaux
            $invoice->items()->delete();
            foreach ($validated['items'] as $item) {
                $invoice->items()->create($item);
            }

            return response()->json($invoice->load('items'));
        });
    }

    public function recordPayment(Request $request, $id)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
        ]);

        return DB::transaction(function () use ($request, $id, $validated) {
            $invoice = Invoice::where('user_id', $request->user()->id)
                ->lockForUpdate()
                ->findOrFail($id);

            $currentAmount = (float) ($invoice->amount_paid ?? 0);
            $totalAmount = (float) $invoice->total_amount;
            $remainingAmount = max(0, $totalAmount - $currentAmount);

            if ((float) $validated['amount'] > $remainingAmount) {
                throw ValidationException::withMessages([
                    'amount' => ['Le montant dépasse le solde restant de la facture.'],
                ]);
            }

            $newAmountPaid = $currentAmount + (float) $validated['amount'];
            $status = $newAmountPaid >= $totalAmount ? 'paid' : 'partially_paid';

            $invoice->update([
                'amount_paid' => $newAmountPaid,
                'status' => $status,
            ]);

            return response()->json($invoice->load('items'));
        });
    }

    public function destroy($id, Request $request)
    {
        $invoice = Invoice::where('user_id', $request->user()->id)->findOrFail($id);
        $invoice->delete();

        return response()->json(null, 204);
    }
}
