<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class CheckoutController extends Controller
{
    public function checkout(Request $request)
    {
        $cart = session()->get('cart', []);

        if (empty($cart)) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        Stripe::setApiKey(config('services.stripe.secret'));

        $lineItems = [];
        foreach ($cart as $item) {
            $lineItems[] = [
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => [
                        'name' => $item['name'],
                    ],
                    'unit_amount' => (int) ($item['price'] * 100),
                ],
                'quantity' => $item['quantity'],
            ];
        }

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => $lineItems,
            'mode' => 'payment',
            'success_url' => route('checkout.success') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('cart.index'),
        ]);

        return Inertia::location($session->url);
    }

    public function success(Request $request)
    {
        Stripe::setApiKey(config('services.stripe.secret'));

        $session = Session::retrieve($request->session_id);

        if ($session->payment_status === 'paid') {
            $cart = session()->get('cart', []);
            $total = collect($cart)->sum(fn($item) => $item['price'] * $item['quantity']);

            $order = Order::create([
                'user_id' => auth()->id(),
                'order_number' => 'ORD-' . strtoupper(uniqid()),
                'total' => $total,
                'status' => 'completed',
                'stripe_session_id' => $session->id,
                'stripe_payment_intent_id' => $session->payment_intent,
            ]);

            foreach ($cart as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }

            session()->forget('cart');

            return Inertia::render('Checkout/Success', [
                'order' => $order->load('items.product'),
            ]);
        }

        return redirect()->route('cart.index')->with('error', 'Payment failed.');
    }
}
