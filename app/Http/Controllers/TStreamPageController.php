<?php

namespace App\Http\Controllers;

use App\Services\TStreamBillingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Stripe;

class TStreamPageController extends Controller
{
    public function landing(): Response
    {
        return Inertia::render('TStream/Landing');
    }

    public function terms(): Response
    {
        return Inertia::render('TStream/Terms');
    }

    public function privacy(): Response
    {
        return Inertia::render('TStream/Privacy');
    }

    /**
     * Starts a Stripe Checkout subscription ($6.99/mo). Keyed by the email the
     * customer used in the T-Stream app so the app can pick up premium status.
     */
    public function checkout(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255',
        ]);

        Stripe::setApiKey(config('services.stripe.secret'));

        $session = StripeSession::create([
            'mode' => 'subscription',
            'customer_email' => $request->input('email'),
            'line_items' => [[
                'price_data' => [
                    'currency' => 'usd',
                    'unit_amount' => TStreamBillingService::MONTHLY_PRICE_CENTS,
                    'recurring' => ['interval' => 'month'],
                    'product_data' => [
                        'name' => 'T-Stream Premium',
                        'description' => 'Ad-free iPhone-to-Tesla screen streaming',
                    ],
                ],
                'quantity' => 1,
            ]],
            'metadata' => [
                'product' => 'tstream_premium',
            ],
            'success_url' => route('tstream.success').'?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('tstream.landing'),
        ]);

        return Inertia::location($session->url);
    }

    /**
     * Post-checkout landing. Grants premium immediately as a fallback so the
     * customer isn't waiting on webhook delivery.
     */
    public function success(Request $request): Response
    {
        $email = null;
        $activated = false;

        if ($sessionId = $request->query('session_id')) {
            try {
                Stripe::setApiKey(config('services.stripe.secret'));
                $session = StripeSession::retrieve($sessionId);
                if ($session->mode === 'subscription' && in_array($session->status, ['complete'], true)) {
                    $email = $session->customer_details->email ?? $session->customer_email;
                    TStreamBillingService::grantPremium(
                        $email,
                        $session->metadata->device_id ?? null,
                        $session->customer,
                        $session->subscription
                    );
                    $activated = true;
                }
            } catch (\Throwable $e) {
                report($e);
            }
        }

        return Inertia::render('TStream/Success', [
            'activated' => $activated,
            'email' => $email,
        ]);
    }
}
