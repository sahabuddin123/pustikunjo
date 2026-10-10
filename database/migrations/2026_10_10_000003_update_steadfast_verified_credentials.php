<?php

use App\Models\SiteSetting;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $existing = SiteSetting::get('courier_steadfast', []);
        
        $updated = array_merge($existing, [
            'enabled' => true,
            'api_key' => '1ohj3ke58ihsydx9lhq463hf3gqwavq1',
            'secret_key' => 'dgr5ce5fun4vsk788qcix0uy',
            'base_url' => 'https://portal.packzy.com/api/v1',
            'auto_sync' => true,
        ]);

        SiteSetting::set('courier_steadfast', $updated, 'courier');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No reverse needed
    }
};
