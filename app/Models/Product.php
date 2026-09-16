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
        'is_visible_on_storefront',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'og_image',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'stock' => 'integer',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'is_visible_on_storefront' => 'boolean',
        'images' => 'array',
        'benefits' => 'array',
        'variants' => 'array',
    ];

    public function scopeStorefront($query)
    {
        return $query->where('is_active', true)->where('is_visible_on_storefront', true);
    }

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

    public function getImagesAttribute($value)
    {
        $images = is_string($value) ? json_decode($value, true) : $value;
        $images = is_array($images) ? array_values(array_filter($images)) : [];

        $defaultSlugImage = $this->slug ? "/images/products/{$this->slug}.webp" : '/images/placeholder-product.jpg';
        $defaultSlugJpg = $this->slug ? "/images/products/{$this->slug}.jpg" : '/images/placeholder-product.jpg';

        if (empty($images)) {
            return [$defaultSlugImage, $defaultSlugJpg];
        }

        $cleaned = [];
        foreach ($images as $img) {
            if (is_string($img)) {
                // If it contains a broken ChatGPT or WhatsApp temp filename, substitute with existing static asset
                if (str_contains($img, 'ChatGPTImage') || str_contains($img, 'WhatsAppImage')) {
                    $cleaned[] = $defaultSlugImage;
                    $cleaned[] = $defaultSlugJpg;
                } else {
                    $cleaned[] = $img;
                }
            }
        }

        $cleaned = array_values(array_unique(array_filter($cleaned)));
        return !empty($cleaned) ? $cleaned : [$defaultSlugImage, $defaultSlugJpg];
    }

    public function getPrimaryImageAttribute()
    {
        $imgs = $this->images;
        if (!empty($imgs) && is_array($imgs) && count($imgs) > 0) {
            return $imgs[0];
        }
        return $this->slug ? "/images/products/{$this->slug}.webp" : '/images/placeholder-product.jpg';
    }
}
