<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        return Inertia::render('Cart');
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'integer|min:1|max:99',
        ]);

        $product = Product::findOrFail($request->product_id);
        $cart = session()->get('cart', []);

        $id = $product->id;
        if (isset($cart[$id])) {
            $cart[$id]['quantity'] += $request->quantity ?? 1;
        } else {
            $cart[$id] = [
                'product_id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'thumbnail' => $product->thumbnail,
                'quantity' => $request->quantity ?? 1,
                'type' => $product->type,
            ];
        }

        session()->put('cart', $cart);

        return back()->with('success', 'Product added to cart!');
    }

    public function update(Request $request)
    {
        $request->validate([
            'product_id' => 'required',
            'quantity' => 'required|integer|min:0|max:99',
        ]);

        $cart = session()->get('cart', []);

        if ($request->quantity === 0) {
            unset($cart[$request->product_id]);
        } else {
            if (isset($cart[$request->product_id])) {
                $cart[$request->product_id]['quantity'] = $request->quantity;
            }
        }

        session()->put('cart', $cart);

        return back();
    }

    public function remove(Request $request)
    {
        $cart = session()->get('cart', []);
        unset($cart[$request->product_id]);
        session()->put('cart', $cart);

        return back();
    }
}
