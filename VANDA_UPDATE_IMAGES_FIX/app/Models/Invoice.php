<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'invoice_number',
        'issue_date',
        'due_date',
        'client_name',
        'client_email',
        'client_phone',
        'client_address',
        'tax_rate',
        'include_tax',
        'total_amount',
        'studio_info',
        'status',
        'currency'
    ];

    protected $casts = [
        'include_tax' => 'boolean',
        'studio_info' => 'array',
        'issue_date' => 'date',
        'due_date' => 'date',
    ];

    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
