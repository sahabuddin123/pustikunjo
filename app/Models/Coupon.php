<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'type',
        'value',
        'min_order_amount',
        'usage_limit',
        'used_count',
        'expires_at',
        'is_active',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'min_order_amount' => 'decimal:2',
        'usage_limit' => 'integer',
        'used_count' => 'integer',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function isValidFor($amount)
    {
        if (!$this->is_active) {
            return [false, 'এই কুপনটি বর্তমানে নিষ্ক্রিয়।'];
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return [false, 'কুপনের মেয়াদ শেষ হয়ে গেছে।'];
        }

        if ($this->usage_limit && $this->used_count >= $this->usage_limit) {
            return [false, 'এই কুপনের সর্বোচ্চ ব্যবহারের সীমা শেষ।'];
        }

        if ($amount < $this->min_order_amount) {
            return [false, "এই কুপনটি ব্যবহারের জন্য সর্বনিম্ন অর্ডার পরিমাণ ৳{$this->min_order_amount} হতে হবে।"];
        }

        return [true, 'কুপন সফলভাবে প্রয়োগ করা হয়েছে।'];
    }

    public function calculateDiscount($amount)
    {
        if ($this->type === 'percent') {
            return round(($amount * $this->value) / 100, 2);
        }
        return min($this->value, $amount);
    }
}
