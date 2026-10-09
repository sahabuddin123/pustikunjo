<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SiteSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'group',
    ];

    /**
     * Get a setting by key with a default fallback (cached in Redis / default cache store)
     */
    public static function get($key, $default = null)
    {
        try {
            return Cache::remember("site_setting_{$key}", 86400, function () use ($key, $default) {
                return static::fetchRawSetting($key, $default);
            });
        } catch (\Throwable $e) {
            return static::fetchRawSetting($key, $default);
        }
    }

    /**
     * Fetch raw setting directly from database without cache
     */
    protected static function fetchRawSetting($key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        if (!$setting || $setting->value === null) {
            return $default;
        }

        // Try JSON decode if applicable
        $json = json_decode($setting->value, true);
        if (json_last_error() === JSON_ERROR_NONE && (is_array($json) || is_object($json))) {
            return $json;
        }

        return $setting->value;
    }

    /**
     * Set a setting value and invalidate its cache
     */
    public static function set($key, $value, $group = 'general')
    {
        try {
            Cache::forget("site_setting_{$key}");
        } catch (\Throwable $e) {
            // Ignore cache error
        }

        if (is_array($value) || is_object($value)) {
            $value = json_encode($value, JSON_UNESCAPED_UNICODE);
        }

        $result = static::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'group' => $group]
        );

        try {
            Cache::forget("site_setting_{$key}");
        } catch (\Throwable $e) {
            // Ignore cache error
        }

        return $result;
    }
}
