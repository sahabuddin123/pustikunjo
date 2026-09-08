<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'customer_name',
        'customer_phone',
        'customer_alt_phone',
        'customer_email',
        'shipping_address',
        'shipping_area',
        'order_notes',
        'payment_method',
        'payment_status',
        'status',
        'bkash_sender_number',
        'bkash_trx_id',
        'bkash_reject_reason',
        'bkash_payment_id',
        'subtotal',
        'shipping_fee',
        'discount_amount',
        'coupon_code',
        'grand_total',
        'admin_notes',
        'courier_name',
        'courier_consignment_id',
        'courier_tracking_code',
        'courier_status',
        'courier_sent_at',
        'courier_response',
        'fraud_score',
        'fraud_status',
        'user_id',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'shipping_fee' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'grand_total' => 'decimal:2',
        'courier_sent_at' => 'datetime',
        'courier_response' => 'array',
        'fraud_score' => 'integer',
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getFormattedDateAttribute()
    {
        return $this->created_at->format('d M, Y h:i A');
    }

    public function getStatusLabelAttribute()
    {
        return match ($this->status) {
            'pending' => 'অপেক্ষমান (Pending)',
            'payment_pending' => 'পেমেন্ট যাচাইকরণ বাকি (Payment Pending)',
            'payment_verified' => 'পেমেন্ট নিশ্চিত (Payment Verified)',
            'payment_rejected' => 'পেমেন্ট বাতিল (Payment Rejected)',
            'confirmed' => 'অর্ডার নিশ্চিত (Confirmed)',
            'shipped' => 'ডেলিভারিতে আছে (Shipped)',
            'delivered' => 'ডেলিভারি সম্পন্ন (Delivered)',
            'cancelled' => 'বাতিল (Cancelled)',
            default => $this->status,
        };
    }
}
