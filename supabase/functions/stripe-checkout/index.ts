
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

// Helper function to add CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
  "Access-Control-Max-Age": "86400", // 24 hours
};

Deno.serve(async (req) => {
  // Get the origin of the request
  const origin = req.headers.get("Origin") || "*";
  
  // Update CORS headers with the specific origin
  const headers = {
    ...corsHeaders,
    "Access-Control-Allow-Origin": origin,
  };

  // Log the beginning of the request
  console.log("Request received:", req.method, req.url);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS preflight request");
    return new Response(null, {
      status: 204, // No content for preflight
      headers,
    });
  }

  try {
    // Only allow POST requests
    if (req.method !== "POST") {
      console.error(`Method not allowed: ${req.method}`);
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      });
    }

    // Parse request body
    let requestBody;
    try {
      const rawBody = await req.text();
      console.log("Raw request body:", rawBody);
      
      requestBody = JSON.parse(rawBody);
      console.log("Request body parsed successfully:", requestBody);
    } catch (error) {
      console.error("Error parsing request body:", error);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body", details: error.message }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...headers,
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
            ...headers,
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
          ...headers,
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
            ...headers,
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
          ...headers,
        },
      }
    );
  }
});
