
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "stripe";

console.log("Stripe function starting, checking for STRIPE_SECRET_KEY");
const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");

if (!stripeKey) {
  console.error("STRIPE_SECRET_KEY is not set!");
}

// Initialize Stripe with your secret key
const stripe = new Stripe(stripeKey || "", {
  apiVersion: "2023-10-16",
});

Deno.serve(async (req) => {
  // Log the beginning of the request
  console.log("Request received:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
      console.log("Request body parsed successfully");
    } catch (error) {
      console.error("Error parsing request body:", error);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const { line_items, metadata, success_url, cancel_url, customer_email } = requestBody;

    if (!line_items || !success_url || !cancel_url) {
      console.error("Missing required parameters:", { line_items, success_url, cancel_url });
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    console.log("Creating Stripe checkout session with parameters:", {
      lineItemsCount: line_items.length,
      hasMetadata: !!metadata,
      successUrl: success_url,
      cancelUrl: cancel_url,
      customerEmail: customer_email,
    });

    // Create a checkout session
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        success_url,
        cancel_url,
        metadata,
        customer_email,
      });

      console.log("Checkout session created successfully:", session.id);

      // Return the checkout session URL
      return new Response(JSON.stringify({ url: session.url }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (stripeError) {
      console.error("Stripe API error:", stripeError);
      
      return new Response(
        JSON.stringify({ 
          error: "Stripe API error", 
          details: stripeError.message,
          type: stripeError.type,
          code: stripeError.code
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  } catch (error) {
    console.error("Unhandled error in function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to create checkout session", 
        details: error.message 
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});
