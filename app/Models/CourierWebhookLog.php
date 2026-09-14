<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourierWebhookLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'courier_name',
        'tracking_code',
        'consignment_id',
        'status',
        'payload',
        'ip_address',
    ];

    protected $casts = [
        'payload' => 'array',
    ];
}
