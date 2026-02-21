<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Services\RecommendationService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(RecommendationService $recommendationService)
    {
        $featuredProducts = Product::where('is_active', true)
            ->where('is_featured', true)
            ->with('category')
            ->take(6)
            ->get();

        $categories = Category::withCount('products')->get();

        $recommendations = [];
        if (Auth::check()) {
            $user = Auth::user();
            if ($user->devices()->exists()) {
                $recommendations = $recommendationService->forUser($user, 4);
            }
        }

        return Inertia::render('Home', [
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
            'recommendations' => $recommendations,
        ]);
    }
}
