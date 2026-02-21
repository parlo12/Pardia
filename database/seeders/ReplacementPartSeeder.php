<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ReplacementPartSeeder extends Seeder
{
    public function run(): void
    {
        // Create replacement parts category
        $batteries = Category::firstOrCreate(
            ['slug' => 'batteries'],
            ['name' => 'Batteries', 'description' => 'OEM-quality replacement batteries for MacBooks and other devices.']
        );

        $accessories = Category::firstOrCreate(
            ['slug' => 'accessories'],
            ['name' => 'Accessories', 'description' => 'Cables, chargers, and accessories for your devices.']
        );

        $storage = Category::firstOrCreate(
            ['slug' => 'storage'],
            ['name' => 'Storage', 'description' => 'External drives and storage solutions.']
        );

        // === BATTERY REPLACEMENTS ===

        Product::updateOrCreate(
            ['slug' => 'macbook-air-m2-battery'],
            [
                'category_id' => $batteries->id,
                'name' => 'MacBook Air M2 Replacement Battery',
                'description' => 'Premium replacement battery for MacBook Air M2 (2022-2023). 52.6Wh capacity matches the original Apple battery. Includes toolkit with pentalobe screwdriver, spudger, and installation guide. 12-month warranty with free return shipping.',
                'short_description' => 'OEM-quality 52.6Wh battery for MacBook Air M2.',
                'price' => 89.99,
                'is_free' => false,
                'type' => 'hardware',
                'version' => 'A2681',
                'features' => ['52.6Wh Capacity', '12-Month Warranty', 'Toolkit Included', 'Easy Install Guide', 'Zero-Cycle New Cell', 'Safety Certified'],
                'system_requirements' => ['Compatible Models' => 'MacBook Air M2 (2022-2023)', 'Part Number' => 'A2681', 'Tools' => 'Included in package'],
                'compatible_models' => ['Mac14,2'],
                'recommendation_trigger' => 'battery_critical',
                'trigger_threshold' => 50.00,
                'recommendation_priority' => 1,
                'stock' => 75,
                'is_active' => true,
                'is_featured' => true,
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'macbook-air-m1-battery'],
            [
                'category_id' => $batteries->id,
                'name' => 'MacBook Air M1 Replacement Battery',
                'description' => 'Premium replacement battery for MacBook Air M1 (2020-2021). 49.9Wh capacity, same as the original. Comes with a complete toolkit and step-by-step video guide. All cells are brand new with zero charge cycles.',
                'short_description' => 'OEM-quality 49.9Wh battery for MacBook Air M1.',
                'price' => 79.99,
                'is_free' => false,
                'type' => 'hardware',
                'version' => 'A2389',
                'features' => ['49.9Wh Capacity', '12-Month Warranty', 'Toolkit Included', 'Video Guide', 'Zero-Cycle Cell', 'Drop-in Fit'],
                'system_requirements' => ['Compatible Models' => 'MacBook Air M1 (2020-2021)', 'Part Number' => 'A2389'],
                'compatible_models' => ['Mac14,7', 'MacBookAir10,1'],
                'recommendation_trigger' => 'battery_critical',
                'trigger_threshold' => 50.00,
                'recommendation_priority' => 1,
                'stock' => 60,
                'is_active' => true,
                'is_featured' => true,
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'macbook-pro-14-m2-battery'],
            [
                'category_id' => $batteries->id,
                'name' => 'MacBook Pro 14" M2/M3 Replacement Battery',
                'description' => 'High-capacity replacement battery for MacBook Pro 14-inch with M2 Pro, M2 Max, M3, M3 Pro, or M3 Max chip. 72.4Wh capacity for all-day power. Professional-grade cells with smart power management IC.',
                'short_description' => '72.4Wh battery for MacBook Pro 14" M2/M3 models.',
                'price' => 119.99,
                'is_free' => false,
                'type' => 'hardware',
                'version' => 'A2519',
                'features' => ['72.4Wh Capacity', '18-Month Warranty', 'Smart Power IC', 'Toolkit Included', 'Pro-Grade Cells', 'Temperature Protection'],
                'system_requirements' => ['Compatible Models' => 'MacBook Pro 14" M2 Pro/Max, M3/Pro/Max', 'Part Number' => 'A2519'],
                'compatible_models' => ['Mac14,5', 'Mac14,9', 'Mac15,3', 'Mac15,6', 'Mac15,8', 'Mac15,10'],
                'recommendation_trigger' => 'battery_critical',
                'trigger_threshold' => 50.00,
                'recommendation_priority' => 1,
                'stock' => 40,
                'is_active' => true,
                'is_featured' => true,
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'macbook-pro-16-m2-battery'],
            [
                'category_id' => $batteries->id,
                'name' => 'MacBook Pro 16" M2/M3 Replacement Battery',
                'description' => 'Maximum capacity replacement battery for MacBook Pro 16-inch. 99.6Wh — the largest battery Apple puts in any laptop. Premium cells matched to original specifications.',
                'short_description' => '99.6Wh battery for MacBook Pro 16" M2/M3 models.',
                'price' => 149.99,
                'is_free' => false,
                'type' => 'hardware',
                'version' => 'A2527',
                'features' => ['99.6Wh Capacity', '18-Month Warranty', 'Maximum Runtime', 'Smart Charging IC', 'Toolkit Included', 'Safety Certified'],
                'system_requirements' => ['Compatible Models' => 'MacBook Pro 16" M2 Pro/Max, M3 Pro/Max', 'Part Number' => 'A2527'],
                'compatible_models' => ['Mac14,6', 'Mac14,10', 'Mac15,7', 'Mac15,9', 'Mac15,11'],
                'recommendation_trigger' => 'battery_critical',
                'trigger_threshold' => 50.00,
                'recommendation_priority' => 1,
                'stock' => 35,
                'is_active' => true,
                'is_featured' => true,
            ]
        );

        // === BATTERY CARE (lower urgency, for worn batteries) ===

        Product::updateOrCreate(
            ['slug' => 'battery-calibration-toolkit'],
            [
                'category_id' => $accessories->id,
                'name' => 'Battery Calibration & Care Kit',
                'description' => 'Professional battery calibration toolkit with thermal paste, cleaning supplies, and our Pardia Battery Optimizer software license. Helps extend battery life by up to 20% through proper calibration and thermal management.',
                'short_description' => 'Extend battery life with calibration tools and software.',
                'price' => 29.99,
                'is_free' => false,
                'type' => 'hardware',
                'features' => ['Thermal Paste', 'Cleaning Kit', 'Software License', 'Calibration Guide', 'Anti-Static Mat', 'Extends Battery Life'],
                'compatible_models' => null,
                'recommendation_trigger' => 'battery_worn',
                'trigger_threshold' => 80.00,
                'recommendation_priority' => 10,
                'stock' => 200,
                'is_active' => true,
                'is_featured' => false,
            ]
        );

        // === HIGH CYCLE COUNT ===

        Product::updateOrCreate(
            ['slug' => 'usb-c-charger-140w'],
            [
                'category_id' => $accessories->id,
                'name' => '140W USB-C Power Adapter',
                'description' => 'High-wattage USB-C charger compatible with all MacBook models. Supports MagSafe 3 and USB-C charging. GaN technology for compact size. Ideal for heavy users with high charge cycle counts — keep your MacBook plugged in more to slow battery wear.',
                'short_description' => '140W GaN charger — reduce battery cycles by staying plugged in.',
                'price' => 59.99,
                'is_free' => false,
                'type' => 'hardware',
                'features' => ['140W Output', 'GaN Technology', 'USB-C + MagSafe', 'Compact Design', 'Universal Compatibility', 'Reduces Cycle Wear'],
                'compatible_models' => null,
                'recommendation_trigger' => 'high_cycles',
                'trigger_threshold' => 800.00,
                'recommendation_priority' => 5,
                'stock' => 150,
                'is_active' => true,
                'is_featured' => false,
            ]
        );

        // === STORAGE ===

        Product::updateOrCreate(
            ['slug' => 'thunderbolt-ssd-2tb'],
            [
                'category_id' => $storage->id,
                'name' => 'Thunderbolt 4 Portable SSD — 2TB',
                'description' => 'Ultra-fast 2TB portable SSD with Thunderbolt 4 connectivity. Up to 3,000 MB/s read speeds. Aluminum enclosure with passive cooling. Perfect for MacBooks running low on internal storage.',
                'short_description' => '2TB Thunderbolt 4 SSD — 3,000 MB/s.',
                'price' => 199.99,
                'is_free' => false,
                'type' => 'hardware',
                'features' => ['2TB Capacity', 'Thunderbolt 4', '3,000 MB/s', 'Aluminum Body', 'Bus Powered', 'Mac Optimized'],
                'compatible_models' => null,
                'recommendation_trigger' => 'storage_low',
                'trigger_threshold' => 85.00,
                'recommendation_priority' => 8,
                'stock' => 80,
                'is_active' => true,
                'is_featured' => false,
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'thunderbolt-ssd-1tb'],
            [
                'category_id' => $storage->id,
                'name' => 'Thunderbolt 4 Portable SSD — 1TB',
                'description' => 'Compact 1TB portable SSD with Thunderbolt 4. Same blazing speeds as the 2TB model in a smaller package. Great for expanding your MacBook storage without breaking the bank.',
                'short_description' => '1TB Thunderbolt 4 SSD — 3,000 MB/s.',
                'price' => 129.99,
                'is_free' => false,
                'type' => 'hardware',
                'features' => ['1TB Capacity', 'Thunderbolt 4', '3,000 MB/s', 'Pocket Size', 'Bus Powered', 'Mac Optimized'],
                'compatible_models' => null,
                'recommendation_trigger' => 'storage_low',
                'trigger_threshold' => 85.00,
                'recommendation_priority' => 9,
                'stock' => 120,
                'is_active' => true,
                'is_featured' => false,
            ]
        );
    }
}
