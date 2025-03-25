
# Stripe Integration Guide

Follow these steps to fully implement Stripe in your application.

## Step 1: Set Up Stripe Account

1. Create a Stripe account at https://stripe.com if you haven't already
2. Get your API keys from the Stripe Dashboard (Dashboard > Developers > API keys)
3. Make sure to have both the Publishable Key and the Secret Key

## Step 2: Set Up Products and Prices in Stripe

1. Go to Products in your Stripe Dashboard
2. Create products that match your application's products
3. For each product, create a price
4. Note the Price IDs (starting with "price_") for each product

## Step 3: Add Price IDs to Your Application

Make sure all products in your ProductData.ts file have their stripePriceId fields properly set with the actual Stripe Price IDs.

## Step 4: Create Supabase Edge Function for Stripe

1. Create a new Supabase Edge Function:

```bash
npx supabase functions new stripe-checkout
```

2. Use the following implementation for the Edge Function:

```typescript
// stripe-checkout/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@12.0.0';

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16', // Use the latest API version
});

// Handle different Stripe-related actions
serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      status: 204,
    });
  }

  try {
    const { action, sessionId, ...body } = await req.json();

    // Handle different actions
    if (action === 'validate') {
      // Validate a checkout session
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      return new Response(
        JSON.stringify({ valid: session.payment_status === 'paid' }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } else {
      // Create a checkout session (default action)
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: body.line_items,
        metadata: body.metadata,
        success_url: body.success_url,
        cancel_url: body.cancel_url,
        customer_email: body.customer_email,
        mode: 'payment',
      });

      return new Response(
        JSON.stringify({ url: session.url }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});
```

3. Set up the Stripe secret key in your Supabase project:

```bash
npx supabase secrets set STRIPE_SECRET_KEY=your_stripe_secret_key
```

4. Deploy the Edge Function:

```bash
npx supabase functions deploy stripe-checkout
```

## Step 5: Update Your Application to Use the Edge Function

1. In `src/services/StripeService.ts`, modify the code to use the Supabase Edge Function instead of direct API calls
2. Remove the mock implementation when in production

## Testing Your Stripe Integration

1. Use Stripe's test cards for testing:
   - Card number: 4242 4242 4242 4242
   - Expiry date: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

2. Check the payment in your Stripe Dashboard under Payments

## Going Live

1. Complete the Stripe account verification process
2. Switch your API keys from test to live
3. Update the environment variables with your live keys

## Webhook Implementation (Optional but Recommended)

For a more robust implementation, set up Stripe webhooks to handle payment events:

1. Create another Supabase Edge Function for webhooks
2. Configure a webhook endpoint in your Stripe Dashboard
3. Handle events like `checkout.session.completed` to update your database

