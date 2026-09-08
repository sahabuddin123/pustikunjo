<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConsultationRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'category',
        'age',
        'gender',
        'height',
        'weight',
        'problem_details',
        'contact_method',
        'status',
        'admin_notes',
    ];

    protected $casts = [
        'age' => 'integer',
    ];
}
