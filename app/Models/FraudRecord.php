<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FraudRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'phone',
        'risk_level',
        'reason',
        'total_orders',
        'cancelled_orders',
        'reported_by',
    ];

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reported_by');
    }

    public static function isFraud(string $phone): bool
    {
        $normalized = preg_replace('/[^0-9]/', '', $phone);
        if (str_starts_with($normalized, '880')) {
            $normalized = substr($normalized, 2);
        }
        return static::where(function ($q) use ($phone, $normalized) {
            $q->where('phone', $phone)
              ->orWhere('phone', $normalized)
              ->orWhere('phone', '0' . $normalized);
        })->where('risk_level', 'fraud')->exists();
    }
}
