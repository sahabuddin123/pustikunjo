<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Complaint extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_number',
        'phone',
        'name',
        'order_number',
        'issue_details',
        'photos',
        'status',
        'admin_notes',
        'resolved_at',
    ];

    protected $casts = [
        'photos' => 'array',
        'resolved_at' => 'datetime',
    ];

    protected static function booted()
    {
        static::creating(function ($complaint) {
            if (empty($complaint->ticket_number)) {
                $complaint->ticket_number = 'PK-CMP-' . date('ymd') . '-' . strtoupper(Str::random(4));
            }
            if (empty($complaint->status)) {
                $complaint->status = 'pending';
            }
        });
    }

    /**
     * Relationship to Order if order_number is given
     */
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_number', 'order_number');
    }
}
