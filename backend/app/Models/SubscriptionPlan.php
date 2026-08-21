<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'yearly_price',
        'features',
        'is_active',
        'maketou_product_id',
        'maketou_yearly_product_id',
    ];

    protected $casts = [
        'features' => 'array',
        'is_active' => 'boolean',
        'price' => 'decimal:2',
        'yearly_price' => 'decimal:2',
    ];

    public function userSubscriptions()
    {
        return $this->hasMany(UserSubscription::class);
    }
}
