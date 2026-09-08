<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'type',
        'content',
        'blocks',
        'meta_title',
        'meta_description',
        'og_image',
        'is_published',
    ];

    protected $casts = [
        'blocks' => 'array',
        'is_published' => 'boolean',
    ];
}
