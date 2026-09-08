<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SmsLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'recipient_phone',
        'message',
        'event_name',
        'provider',
        'status',
        'response_raw',
    ];
}
