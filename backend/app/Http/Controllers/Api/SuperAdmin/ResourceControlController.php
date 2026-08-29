<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Models\Invoice;
use App\Models\SiteConfig;
use App\Services\SuperAdminAuditService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ResourceControlController extends Controller
{
    public function __construct(private readonly SuperAdminAuditService $audit) {}

    public function index(Request $request)
    {
        $validated = $request->validate([
            'type' => ['required', Rule::in(['sites', 'galleries', 'invoices'])],
            'q' => ['nullable', 'string', 'max:120'],
            'status' => ['nullable', 'string', 'max:50'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:10', 'max:100'],
        ]);

        return match ($validated['type']) {
            'sites' => $this->sites($validated),
            'galleries' => $this->galleries($validated),
            'invoices' => $this->invoices($validated),
        };
    }

    public function updateSite(Request $request, $id)
    {
        $site = SiteConfig::with('user:id,name,email')->findOrFail($id);
        $validated = $request->validate(['is_published' => ['required', 'boolean'], 'reason' => ['required', 'string', 'min:5', 'max:500']]);
        $before = ['is_published' => (bool) $site->is_published];
        $site->update(['is_published' => $validated['is_published']]);
        $this->audit->record($request, $site->is_published ? 'site.published' : 'site.unpublished', $site, $before, ['is_published' => (bool) $site->is_published], $validated['reason']);

        return response()->json(['message' => 'Publication mise à jour.', 'site' => $site->fresh('user:id,name,email')]);
    }

    public function updateGallery(Request $request, $id)
    {
        $gallery = Gallery::with('user:id,name,email')->findOrFail($id);
        $validated = $request->validate(['status' => ['required', Rule::in(['draft', 'published', 'archived'])], 'reason' => ['required', 'string', 'min:5', 'max:500']]);
        $before = ['status' => $gallery->status];
        $gallery->update(['status' => $validated['status']]);
        $this->audit->record($request, 'gallery.status_updated', $gallery, $before, ['status' => $gallery->status], $validated['reason']);

        return response()->json(['message' => 'État de la galerie mis à jour.', 'gallery' => $gallery->fresh('user:id,name,email')]);
    }

    private function sites(array $filters)
    {
        $query = SiteConfig::query()->select(['id', 'user_id', 'site_name', 'slug', 'is_published', 'created_at', 'updated_at'])->with('user:id,name,email');
        $this->applyOwnerSearch($query, $filters, ['site_name', 'slug']);
        if (($filters['status'] ?? '') === 'published') $query->where('is_published', true);
        if (($filters['status'] ?? '') === 'unpublished') $query->where('is_published', false);
        $summary = ['total' => SiteConfig::count(), 'published' => SiteConfig::where('is_published', true)->count(), 'unpublished' => SiteConfig::where('is_published', false)->count()];
        return $this->paginated($query->latest('updated_at'), $filters, $summary, ['published', 'unpublished']);
    }

    private function galleries(array $filters)
    {
        $query = Gallery::query()->select(['id', 'user_id', 'uuid', 'title', 'status', 'created_at', 'updated_at'])->with(['user:id,name,email', 'user.siteConfigs:id,user_id,slug'])->withCount(['photos', 'likes']);
        $this->applyOwnerSearch($query, $filters, ['title', 'uuid', 'client_phone']);
        if (! empty($filters['status'])) $query->where('status', $filters['status']);
        $summary = ['total' => Gallery::count(), 'draft' => Gallery::where('status', 'draft')->count(), 'published' => Gallery::where('status', 'published')->count(), 'archived' => Gallery::where('status', 'archived')->count()];
        return $this->paginated($query->latest('updated_at'), $filters, $summary, ['draft', 'published', 'archived']);
    }

    private function invoices(array $filters)
    {
        $query = Invoice::query()->select(['id', 'user_id', 'invoice_number', 'client_name', 'client_email', 'status', 'total_amount', 'amount_paid', 'currency', 'issue_date', 'due_date', 'created_at', 'updated_at'])->with('user:id,name,email')->withCount('items');
        $this->applyOwnerSearch($query, $filters, ['invoice_number', 'client_name', 'client_email']);
        if (! empty($filters['status'])) $query->where('status', $filters['status']);
        if (! empty($filters['from'])) $query->whereDate('issue_date', '>=', $filters['from']);
        if (! empty($filters['to'])) $query->whereDate('issue_date', '<=', $filters['to']);
        $summary = ['total' => Invoice::count(), 'billed' => (float) Invoice::sum('total_amount'), 'paid' => (float) Invoice::sum('amount_paid'), 'outstanding' => (float) Invoice::selectRaw('COALESCE(SUM(total_amount - COALESCE(amount_paid, 0)), 0) as outstanding')->value('outstanding')];
        $statuses = Invoice::query()->distinct()->orderBy('status')->pluck('status')->all();
        return $this->paginated($query->latest('issue_date'), $filters, $summary, $statuses);
    }

    private function applyOwnerSearch($query, array $filters, array $columns): void
    {
        if (! empty($filters['user_id'])) $query->where('user_id', $filters['user_id']);
        if (! empty($filters['q'])) {
            $search = trim($filters['q']);
            $query->where(function ($query) use ($search, $columns) {
                foreach ($columns as $index => $column) {
                    $index === 0 ? $query->where($column, 'like', "%{$search}%") : $query->orWhere($column, 'like', "%{$search}%");
                }
                $query->orWhereHas('user', fn ($user) => $user->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"));
            });
        }
    }

    private function paginated($query, array $filters, array $summary, array $statuses)
    {
        $paginator = $query->paginate($filters['per_page'] ?? 30)->withQueryString();
        return response()->json(['data' => $paginator->items(), 'meta' => ['current_page' => $paginator->currentPage(), 'last_page' => $paginator->lastPage(), 'total' => $paginator->total(), 'from' => $paginator->firstItem(), 'to' => $paginator->lastItem()], 'summary' => $summary, 'statuses' => $statuses]);
    }
}
