
import { CartItem } from '@/context/CartContext';
import { getProductById } from './ProductData';
import { RunEvent } from './RunDateData';
import { mockCreateCheckoutSession, mockValidateStripeSession } from './mockStripeApi';

// Type for the checkout session creation response
type CreateCheckoutSessionResponse = {
  url: string | null;
  error?: string;
};

/**
 * Creates a checkout session with Stripe
 * 
 * @param items Cart items to checkout
 * @param customerInfo Customer information
 * @param collectionRun Collection run details
 * @returns Checkout session URL or error
 */
export const createStripeCheckoutSession = async (
  items: CartItem[],
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  },
  collectionRun: RunEvent
): Promise<CreateCheckoutSessionResponse> => {
  try {
    // Format items for Stripe with price IDs
    const lineItems = items.map(item => {
      const product = getProductById(item.id);
      if (!product || !product.stripePriceId) {
        throw new Error(`Product ${item.id} not found or missing Stripe price ID`);
      }
      
      return {
        price: product.stripePriceId,
        quantity: item.quantity,
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
          maximum: 10,
        },
        // If the item has a size, add it as a description
        description: item.size ? `Size: ${item.size}` : undefined,
      };
    });

    // Create metadata for the order
    const metadata = {
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      collectionDate: collectionRun.date,
      collectionLocation: collectionRun.location,
      collectFormattedDate: collectionRun.formattedDate,
      items: JSON.stringify(items),
    };

    // Construct request data for Stripe API
    const requestData = {
      line_items: lineItems,
      metadata,
      success_url: `${window.location.origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${window.location.origin}/checkout`,
      customer_email: customerInfo.email,
    };

    // DEVELOPMENT MODE: Use mock Stripe API in development mode
    if (import.meta.env.DEV) {
      console.log('Using mock Stripe API in development mode');
      const { url } = await mockCreateCheckoutSession(requestData);
      return { url };
    }

    // PRODUCTION MODE: Real Stripe API call
    console.log('Making Stripe API call with data:', JSON.stringify(requestData));
    
    try {
      // Use fetch with a timeout to avoid hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      const responseText = await response.text();
      console.log('Raw API response:', responseText);
      
      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          console.error('Failed to create checkout session:', errorData);
          return { 
            url: null, 
            error: errorData.error || errorData.message || 'Failed to create checkout session' 
          };
        } catch (parseError) {
          console.error('Error parsing error response:', parseError, 'Raw response:', responseText);
          return {
            url: null,
            error: `Failed to create checkout session: ${responseText.substring(0, 100)}...`
          };
        }
      }

      try {
        const data = JSON.parse(responseText);
        console.log('Parsed response data:', data);
        return { url: data.url };
      } catch (parseError) {
        console.error('Error parsing success response:', parseError, 'Raw response:', responseText);
        return {
          url: null,
          error: 'Failed to parse Stripe API response'
        };
      }
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        console.error('Fetch request timed out');
        return {
          url: null,
          error: 'Request timed out. Please try again.'
        };
      }
      
      console.error('Fetch error:', fetchError);
      return {
        url: null,
        error: `Network error: ${fetchError.message}`
      };
    }
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    return { 
      url: null, 
      error: error instanceof Error ? error.message : 'Unknown error creating checkout session' 
    };
  }
};

/**
 * Validates a Stripe session ID
 * 
 * @param sessionId Stripe session ID to validate
 * @returns Boolean indicating if the session is valid
 */
export const validateStripeSession = async (sessionId: string): Promise<boolean> => {
  try {
    // DEVELOPMENT MODE: Use mock API in development mode
    if (import.meta.env.DEV) {
      console.log('Using mock Stripe API in development mode');
      const { valid } = await mockValidateStripeSession(sessionId);
      return valid;
    }
    
    // PRODUCTION MODE: Real Stripe API call
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-session?session_id=${sessionId}`);
    
    if (!response.ok) {
      return false;
    }
    
    const { valid } = await response.json();
    return valid;
  } catch (error) {
    console.error('Error validating stripe session:', error);
    return false;
  }
};
