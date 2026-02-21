<?php

namespace App\Services;

use App\Models\BatterySnapshot;
use App\Models\Device;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Collection;

class RecommendationService
{
    /**
     * Get personalized product recommendations for a user based on their linked devices.
     *
     * Returns a collection of products with a 'reason' explaining why each is recommended.
     */
    public function forUser(User $user, int $limit = 8): Collection
    {
        $devices = $user->devices()->get();

        if ($devices->isEmpty()) {
            return collect();
        }

        $recommendations = collect();

        foreach ($devices as $device) {
            $deviceRecs = $this->forDevice($device);
            $recommendations = $recommendations->merge($deviceRecs);
        }

        // Deduplicate by product ID, keeping the highest priority (lowest number)
        return $recommendations
            ->sortBy('priority')
            ->unique('product_id')
            ->take($limit)
            ->values();
    }

    /**
     * Get recommendations for a single device based on its telemetry data.
     */
    public function forDevice(Device $device): Collection
    {
        $latestSnapshot = BatterySnapshot::where('device_id', $device->device_id)
            ->latest('reported_at')
            ->first();

        if (!$latestSnapshot) {
            return collect();
        }

        $recommendations = collect();

        // 1. Battery critical: health below threshold
        if ($latestSnapshot->health_percent !== null && $latestSnapshot->health_percent < 50) {
            $products = $this->findProducts('battery_critical', $device->model_identifier);
            foreach ($products as $product) {
                $recommendations->push($this->formatRecommendation(
                    $product,
                    $device,
                    'Your battery health is at ' . round($latestSnapshot->health_percent) . '% — replacement recommended for ' . ($device->model_identifier ?? 'your device'),
                    'critical',
                    $product->recommendation_priority,
                ));
            }
        }

        // 2. Battery worn: health below 80% but above 50%
        if ($latestSnapshot->health_percent !== null && $latestSnapshot->health_percent < 80 && $latestSnapshot->health_percent >= 50) {
            $products = $this->findProducts('battery_worn', $device->model_identifier);
            foreach ($products as $product) {
                $recommendations->push($this->formatRecommendation(
                    $product,
                    $device,
                    'Battery showing wear at ' . round($latestSnapshot->health_percent) . '% — care kit can help extend its life',
                    'warning',
                    $product->recommendation_priority,
                ));
            }

            // Also suggest the replacement battery as a "prepare" recommendation
            $batteries = $this->findProducts('battery_critical', $device->model_identifier);
            foreach ($batteries as $product) {
                $recommendations->push($this->formatRecommendation(
                    $product,
                    $device,
                    'Battery at ' . round($latestSnapshot->health_percent) . '% — consider having a replacement ready',
                    'info',
                    $product->recommendation_priority + 20,
                ));
            }
        }

        // 3. Also suggest care kit for critical batteries
        if ($latestSnapshot->health_percent !== null && $latestSnapshot->health_percent < 50) {
            $careProducts = $this->findProducts('battery_worn', $device->model_identifier);
            foreach ($careProducts as $product) {
                $recommendations->push($this->formatRecommendation(
                    $product,
                    $device,
                    'Maintain your new battery after replacement',
                    'info',
                    $product->recommendation_priority + 5,
                ));
            }
        }

        // 4. High cycle count
        if ($latestSnapshot->cycle_count !== null && $latestSnapshot->cycle_count > 800) {
            $products = $this->findProducts('high_cycles', $device->model_identifier);
            foreach ($products as $product) {
                $recommendations->push($this->formatRecommendation(
                    $product,
                    $device,
                    $latestSnapshot->cycle_count . ' charge cycles — reduce wear by keeping plugged in',
                    'warning',
                    $product->recommendation_priority,
                ));
            }
        }

        // 5. Storage low (disk usage > 85%)
        // We don't currently track disk usage %, but we can recommend storage
        // for devices with small disks (< 256GB)
        if ($device->disk_total_bytes && $device->disk_total_bytes < 300 * 1024 * 1024 * 1024) {
            $products = $this->findProducts('storage_low', $device->model_identifier);
            foreach ($products as $product) {
                $recommendations->push($this->formatRecommendation(
                    $product,
                    $device,
                    'Your ' . round($device->disk_total_bytes / (1024 * 1024 * 1024)) . 'GB storage may fill up — expand with external SSD',
                    'info',
                    $product->recommendation_priority,
                ));
            }
        }

        return $recommendations;
    }

    /**
     * Find products matching a trigger, optionally filtered by model compatibility.
     */
    private function findProducts(string $trigger, ?string $modelIdentifier): Collection
    {
        $query = Product::where('recommendation_trigger', $trigger)
            ->where('is_active', true)
            ->where('stock', '>', 0)
            ->orderBy('recommendation_priority');

        $products = $query->get();

        // Filter by model compatibility if applicable
        return $products->filter(function (Product $product) use ($modelIdentifier) {
            // If product has no compatible_models restriction, it's universal
            if (empty($product->compatible_models)) {
                return true;
            }

            // If we don't know the device model, skip model-specific products
            if (!$modelIdentifier) {
                return false;
            }

            return in_array($modelIdentifier, $product->compatible_models);
        })->values();
    }

    private function formatRecommendation(
        Product $product,
        Device $device,
        string $reason,
        string $severity,
        int $priority,
    ): array {
        return [
            'product_id' => $product->id,
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'short_description' => $product->short_description,
                'price' => $product->price,
                'is_free' => $product->is_free,
                'type' => $product->type,
                'thumbnail' => $product->thumbnail,
                'features' => $product->features,
            ],
            'device_id' => $device->device_id,
            'device_nickname' => $device->pivot?->nickname ?? $device->model_identifier,
            'reason' => $reason,
            'severity' => $severity,
            'priority' => $priority,
        ];
    }
}
