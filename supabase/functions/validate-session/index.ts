
// // Follow this setup guide to integrate the Deno language server with your editor:
// // https://deno.land/manual/getting_started/setup_your_environment
// // This enables autocomplete, go to definition, etc.

// import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// import Stripe from "stripe";

// console.log("Validate session function starting, checking for STRIPE_SECRET_KEY and STRIPE_TEST_SECRET_KEY");
// const stripeProductionKey = Deno.env.get("STRIPE_SECRET_KEY");
// const stripeTestKey = Deno.env.get("STRIPE_TEST_SECRET_KEY");

// if (!stripeProductionKey && !stripeTestKey) {
//   console.error("Neither STRIPE_SECRET_KEY nor STRIPE_TEST_SECRET_KEY is set!");
// }

// // Define CORS headers
// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*", // You can specify specific origins here
//   "Access-Control-Allow-Methods": "GET, OPTIONS",
//   "Access-Control-Allow-Headers": "content-type, authorization, x-client-info, apikey, accept",
//   "Access-Control-Max-Age": "86400", // 24 hours
// };

// Deno.serve(async (req) => {
//   // Handle CORS preflight requests
//   if (req.method === "OPTIONS") {
//     console.log("Handling OPTIONS preflight request");
//     return new Response(null, {
//       status: 204, // No content
//       headers: corsHeaders,
//     });
//   }

//   // Only allow GET requests for validating sessions
//   if (req.method !== "GET") {
//     console.error(`Method not allowed: ${req.method}`);
//     return new Response(
//       JSON.stringify({ error: "Method not allowed" }),
//       {
//         status: 405,
//         headers: {
//           "Content-Type": "application/json",
//           ...corsHeaders,
//         },
//       }
//     );
//   }

//   try {
//     // Get session ID from URL params
//     const url = new URL(req.url);
//     const sessionId = url.searchParams.get("session_id");
//     const testMode = url.searchParams.get("test_mode") === "true";
    
//     if (!sessionId) {
//       console.error("Missing session_id parameter");
//       return new Response(
//         JSON.stringify({ error: "Missing session_id parameter" }),
//         {
//           status: 400,
//           headers: {
//             "Content-Type": "application/json",
//             ...corsHeaders,
//           },
//         }
//       );
//     }

//     console.log(`Validating Stripe session: ${sessionId}, Test mode: ${testMode}`);

//     // Determine which Stripe key to use
//     let stripeKey;
//     if (testMode === true || testMode === "true") {
//       console.log("Using test mode for Stripe");
//       stripeKey = stripeTestKey || "";
//       if (!stripeKey) {
//         return new Response(
//           JSON.stringify({ error: "Stripe test key not configured", valid: false }),
//           {
//             status: 500,
//             headers: {
//               "Content-Type": "application/json",
//               ...corsHeaders,
//             },
//           }
//         );
//       }
//     } else {
//       console.log("Using live mode for Stripe");
//       stripeKey = stripeProductionKey || "";
//     }

//     // Initialize Stripe with the appropriate key
//     const stripe = new Stripe(stripeKey, {
//       apiVersion: "2023-10-16",
//     });

//     try {
//       // Retrieve the session from Stripe
//       const session = await stripe.checkout.sessions.retrieve(sessionId);
      
//       // Check if the session exists and its payment status
//       const isValid = session && session.id === sessionId;
      
//       console.log(`Session validation result: ${isValid ? 'valid' : 'invalid'}`);

//       return new Response(
//         JSON.stringify({ valid: isValid }),
//         {
//           headers: {
//             "Content-Type": "application/json",
//             ...corsHeaders,
//           },
//         }
//       );
//     } catch (stripeError) {
//       console.error("Stripe API error:", stripeError);
      
//       return new Response(
//         JSON.stringify({ 
//           error: "Stripe API error", 
//           details: stripeError.message,
//           valid: false
//         }),
//         {
//           status: 400,
//           headers: {
//             "Content-Type": "application/json",
//             ...corsHeaders,
//           },
//         }
//       );
//     }
//   } catch (error) {
//     console.error("Unhandled error in function:", error);
    
//     return new Response(
//       JSON.stringify({ 
//         error: "Failed to validate session", 
//         details: error.message,
//         valid: false
//       }),
//       {
//         status: 500,
//         headers: {
//           "Content-Type": "application/json",
//           ...corsHeaders,
//         },
//       }
//     );
//   }
// });

// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "stripe";

console.log("Stripe function starting, checking for STRIPE_SECRET_KEY and STRIPE_TEST_SECRET_KEY");
const stripeProductionKey = Deno.env.get("STRIPE_SECRET_KEY");
const stripeTestKey = Deno.env.get("STRIPE_TEST_SECRET_KEY");

if (!stripeProductionKey && !stripeTestKey) {
  console.error("Neither STRIPE_SECRET_KEY nor STRIPE_TEST_SECRET_KEY is set!");
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // You can specify specific origins here
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, authorization, x-client-info, apikey, accept",
    "Access-Control-Max-Age": "86400", // 24 hours
  };
  
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS preflight request");
    return new Response(null, {
      status: 204, // No content
      headers: corsHeaders,
    });
  }

  // Log request method and URL for debugging
  const method = req.method;
  const url = req.url;
  console.log(`Request received: ${method} ${url}`);

  // Only allow POST requests for creating checkout sessions
  if (req.method !== "POST") {
    console.error(`Method not allowed: ${req.method}`);
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }

  try {
    // Parse request body
    let requestBody;
    try {
      const rawBody = await req.text();
      console.log("Raw request body received:", rawBody);
      
      requestBody = JSON.parse(rawBody);
      console.log("Parsed request body:", requestBody);

      // Log the test_mode value for verification
      console.log("Received test_mode:", requestBody.test_mode);
    } catch (error) {
      console.error("Error parsing request body:", error);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body", details: error.message }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    const { line_items, metadata, success_url, cancel_url, customer_email, test_mode } = requestBody;

    if (!line_items || !success_url || !cancel_url) {
      console.error("Missing required parameters");
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Determine which Stripe key to use
    let stripeKey;
    if (test_mode === true || test_mode === "true") {
      console.log("Using test mode for Stripe");
      stripeKey = stripeTestKey || "";
      if (!stripeKey) {
        return new Response(
          JSON.stringify({ error: "Stripe test key not configured" }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }
    } else {
      console.log("Using live mode for Stripe");
      stripeKey = stripeProductionKey || "";
    }

    // Initialize Stripe with the chosen secret key
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    console.log("Creating Stripe checkout session with valid parameters");

    // Create a checkout session - using line_items directly as passed
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card", "paynow", "grabpay"],
        line_items, // They should already be in the correct format
        mode: "payment",
        success_url,
        cancel_url,
        metadata,
        customer_email,
      });

      console.log("Checkout session created successfully:", session.id);

      // Return the checkout session URL
      return new Response(
        JSON.stringify({ url: session.url }),
        {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
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
            ...corsHeaders,
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
          ...corsHeaders,
        },
      }
    );
  }
});
