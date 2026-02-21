<?php

namespace App\Http\Controllers;

use App\Models\BatterySnapshot;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::where('is_active', true)->with('category');

        if ($request->has('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $products = $query->latest()->paginate(12);
        $categories = Category::withCount('products')->get();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['category', 'type', 'search']),
        ]);
    }

    public function show(string $slug)
    {
        $product = Product::where('slug', $slug)
            ->where('is_active', true)
            ->with('category')
            ->firstOrFail();

        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->take(4)
            ->get();

        // Check if the product is compatible with any of the user's linked devices
        $compatibleDevices = [];
        if (Auth::check()) {
            $user = Auth::user();
            $devices = $user->devices()->get();

            foreach ($devices as $device) {
                $isCompatible = empty($product->compatible_models)
                    || in_array($device->model_identifier, $product->compatible_models ?? []);

                if ($isCompatible && !empty($product->recommendation_trigger)) {
                    $latestSnapshot = BatterySnapshot::where('device_id', $device->device_id)
                        ->latest('reported_at')
                        ->first();

                    $needsProduct = false;
                    if ($latestSnapshot) {
                        $needsProduct = match ($product->recommendation_trigger) {
                            'battery_critical' => ($latestSnapshot->health_percent ?? 100) < 50,
                            'battery_worn' => ($latestSnapshot->health_percent ?? 100) < 80,
                            'high_cycles' => ($latestSnapshot->cycle_count ?? 0) > 800,
                            'storage_low' => ($device->disk_total_bytes ?? PHP_INT_MAX) < 300 * 1024 * 1024 * 1024,
                            default => false,
                        };
                    }

                    if ($isCompatible) {
                        $compatibleDevices[] = [
                            'nickname' => $device->pivot->nickname ?? $device->model_identifier,
                            'model_identifier' => $device->model_identifier,
                            'needs_product' => $needsProduct,
                        ];
                    }
                }
            }
        }

        return Inertia::render('Products/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'compatibleDevices' => $compatibleDevices,
        ]);
    }

    public function download(Product $product)
    {
        if (!$product->is_free || !$product->download_url) {
            abort(403);
        }

        return redirect($product->download_url);
    }
}
