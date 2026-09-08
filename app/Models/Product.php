<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'sku',
        'price',
        'sale_price',
        'stock',
        'weight',
        'variants',
        'category_id',
        'badge',
        'short_description',
        'description',
        'images',
        'benefits',
        'usage_instructions',
        'is_featured',
        'is_active',
        'meta_title',
        'meta_description',
        'og_image',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'stock' => 'integer',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'images' => 'array',
        'benefits' => 'array',
        'variants' => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class)->where('is_approved', true);
    }

    public function getEffectivePriceAttribute()
    {
        return ($this->sale_price && $this->sale_price > 0 && $this->sale_price < $this->price)
            ? $this->sale_price
            : $this->price;
    }

    public function getDiscountPercentAttribute()
    {
        if ($this->sale_price && $this->sale_price > 0 && $this->sale_price < $this->price) {
            return round((($this->price - $this->sale_price) / $this->price) * 100);
        }
        return 0;
    }

    public function getPrimaryImageAttribute()
    {
        if (!empty($this->images) && is_array($this->images) && count($this->images) > 0) {
            return $this->images[0];
        }
        return '/images/placeholder-product.jpg';
    }
}
