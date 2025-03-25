
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
    // Format items for Stripe with price IDs - ensuring we use the correct format
    const lineItems = items.map(item => {
      const product = getProductById(item.id);
      if (!product || !product.stripePriceId) {
        throw new Error(`Product ${item.id} not found or missing Stripe price ID`);
      }
      
      // Use the correct format required by Stripe
      return {
        price: product.stripePriceId,
        quantity: item.quantity,
        // Only add adjustable_quantity if needed
        adjustable_quantity: {
          enabled: false, // Setting to false to simplify checkout 
        },
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
      items: JSON.stringify(items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        size: item.size || '',
        price: item.price,
        total: item.total
      }))),
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

    // PRODUCTION MODE: Direct fetch to the Edge Function
    console.log('Making Stripe API call with data:', JSON.stringify(requestData));
    
    const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`;
    
    try {
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API response error:', response.status, errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          return { 
            url: null, 
            error: errorData.error || errorData.message || `Server error: ${response.status}` 
          };
        } catch (parseError) {
          return {
            url: null,
            error: `Server error: ${response.status} - ${errorText.substring(0, 100)}`
          };
        }
      }

      const data = await response.json();
      console.log('Stripe API response:', data);
      return { url: data.url };
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error);
      return { 
        url: null, 
        error: error instanceof Error ? 
          `Network error: ${error.message}` : 
          'Failed to connect to payment service' 
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
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-session?session_id=${sessionId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
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
