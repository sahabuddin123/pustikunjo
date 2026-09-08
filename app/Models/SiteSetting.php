<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'group',
    ];

    /**
     * Get a setting by key with a default fallback
     */
    public static function get($key, $default = null)
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
     * Set a setting value
     */
    public static function set($key, $value, $group = 'general')
    {
        if (is_array($value) || is_object($value)) {
            $value = json_encode($value, JSON_UNESCAPED_UNICODE);
        }

        return static::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'group' => $group]
        );
    }
}
