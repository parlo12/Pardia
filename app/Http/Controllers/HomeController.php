<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $featuredProducts = Product::where('is_active', true)
            ->where('is_featured', true)
            ->with('category')
            ->take(6)
            ->get();

        $categories = Category::withCount('products')->get();

        return Inertia::render('Home', [
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
        ]);
    }
}
