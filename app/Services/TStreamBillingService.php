<?php

namespace App\Services;

use App\Models\TstreamAccount;
use Illuminate\Support\Facades\Log;

class TStreamBillingService
{
    public const MONTHLY_PRICE_CENTS = 699;

    /**
     * Marks the subscriber premium. Website subscriptions are keyed by email;
     * if the app has already registered that email (or the checkout carried a
     * device_id), the existing account is upgraded, otherwise a web-only
     * account row is created so the app can find it by email later.
     */
    public static function grantPremium(?string $email, ?string $deviceId, ?string $customerId, ?string $subscriptionId): void
    {
        $account = null;

        if ($subscriptionId) {
            $account = TstreamAccount::where('stripe_subscription_id', $subscriptionId)->first();
        }
        if (! $account && $customerId) {
            $account = TstreamAccount::where('stripe_customer_id', $customerId)->first();
        }
        if (! $account && $deviceId) {
            $account = TstreamAccount::where('device_id', $deviceId)->first();
        }
        if (! $account && $email) {
            $account = TstreamAccount::where('email', $email)->first();
        }
        if (! $account) {
            if (! $email) {
                Log::warning('T-Stream premium grant skipped — no identifiable account', [
                    'customer' => $customerId, 'subscription' => $subscriptionId,
                ]);
                return;
            }
            $account = new TstreamAccount(['platform' => 'web']);
        }

        if ($email && ! $account->email) {
            $account->email = $email;
        }
        $account->plan = 'premium';
        $account->stripe_customer_id = $customerId ?? $account->stripe_customer_id;
        $account->stripe_subscription_id = $subscriptionId ?? $account->stripe_subscription_id;
        $account->save();

        Log::info('T-Stream premium granted', ['email' => $email, 'subscription' => $subscriptionId]);
    }

    public static function revokePremium(string $subscriptionId): void
    {
        TstreamAccount::where('stripe_subscription_id', $subscriptionId)
            ->update(['plan' => 'free']);

        Log::info('T-Stream premium revoked', ['subscription' => $subscriptionId]);
    }
}
