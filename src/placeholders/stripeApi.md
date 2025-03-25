
# Stripe API Implementation Notes

This file serves as documentation for implementing the Stripe API endpoints in your project.

## Required API Endpoints

1. `/api/stripe/create-checkout-session`
   - Method: POST
   - Purpose: Creates a Stripe checkout session
   - Implementation: This should be implemented as a Supabase Edge Function or similar backend service
   - Request body example:
     ```json
     {
       "line_items": [
         {
           "price": "price_1Oz4SyAJLvQhj0WuzHODHAEp",
           "quantity": 1,
           "adjustable_quantity": {
             "enabled": true,
             "minimum": 1,
             "maximum": 10
           },
           "description": "Size: M"
         }
       ],
       "metadata": {
         "customerName": "John Doe",
         "customerEmail": "john@example.com",
         "customerPhone": "12345678",
         "collectionDate": "2023-06-15",
         "collectionLocation": "East Coast Park",
         "collectFormattedDate": "15 June 2023",
         "items": "[{\"id\":1,\"name\":\"ORIGIN T-SHIRT\",\"price\":29.99,\"image\":\"/placeholder.svg\",\"quantity\":1,\"size\":\"M\",\"total\":29.99}]"
       },
       "success_url": "http://localhost:5173/order-confirmation?session_id={CHECKOUT_SESSION_ID}",
       "cancel_url": "http://localhost:5173/checkout",
       "customer_email": "john@example.com"
     }
     ```
   - Response example:
     ```json
     {
       "url": "https://checkout.stripe.com/c/pay/cs_test_..."
     }
     ```

2. `/api/stripe/validate-session`
   - Method: GET
   - Purpose: Validates a Stripe checkout session
   - Implementation: This should be implemented as a Supabase Edge Function or similar backend service
   - Query parameters:
     - `session_id`: The Stripe session ID to validate
   - Response example:
     ```json
     {
       "valid": true
     }
     ```

## Implementation with Supabase Edge Functions

1. Create a new Edge Function in your Supabase project:
   ```bash
   npx supabase functions new stripe-checkout
   ```

2. Implement the function to handle both endpoints
3. Deploy the function:
   ```bash
   npx supabase functions deploy stripe-checkout
   ```

4. Set environment variables in Supabase:
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret

## Webhook Implementation

For complete order processing, you should also implement a Stripe webhook handler to:
1. Listen for `checkout.session.completed` events
2. Update order status in your database
3. Send confirmation emails

This would be implemented as another Supabase Edge Function or similar backend service.

## Development Mode Mock API

For development and testing purposes, a mock implementation of the Stripe API endpoints is provided in `src/services/mockStripeApi.ts`. This allows the frontend to work without an actual backend implementation.

The mock implementation:
1. Creates a simulated checkout session with a random session ID
2. Redirects directly to the success URL
3. Validates session IDs that it has previously created

To switch from the mock API to the real API:
1. Uncomment the real API calls in `src/services/StripeService.ts`
2. Comment out the mock API calls
3. Implement the actual Stripe API endpoints as Supabase Edge Functions
