<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\TStreamBillingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Webhook;

class TStreamStripeWebhookController extends Controller
{
    public function handle(Request $request): JsonResponse
    {
        $secret = config('services.stripe.webhook_secret');
        if (! $secret) {
            Log::warning('T-Stream Stripe webhook received but STRIPE_WEBHOOK_SECRET is not configured');
            return response()->json(['error' => 'webhook not configured'], 400);
        }

        try {
            $event = Webhook::constructEvent(
                $request->getContent(),
                $request->header('Stripe-Signature', ''),
                $secret
            );
        } catch (\Throwable $e) {
            Log::warning('T-Stream Stripe webhook signature verification failed', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'invalid signature'], 400);
        }

        $object = $event->data->object;

        switch ($event->type) {
            case 'checkout.session.completed':
                if (($object->mode ?? null) === 'subscription') {
                    TStreamBillingService::grantPremium(
                        $object->customer_details->email ?? $object->customer_email ?? null,
                        $object->metadata->device_id ?? null,
                        $object->customer ?? null,
                        $object->subscription ?? null
                    );
                }
                break;

            case 'customer.subscription.updated':
                $active = in_array($object->status ?? '', ['active', 'trialing'], true);
                if ($active) {
                    TStreamBillingService::grantPremium(null, null, $object->customer ?? null, $object->id);
                } else {
                    TStreamBillingService::revokePremium($object->id);
                }
                break;

            case 'customer.subscription.deleted':
                TStreamBillingService::revokePremium($object->id);
                break;
        }

        return response()->json(['status' => 'ok']);
    }
}
