
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

    // In development mode, use the mock API
    // In production, this would call the real Stripe API endpoint
    const requestData = {
      line_items: lineItems,
      metadata,
      success_url: `${window.location.origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${window.location.origin}/checkout`,
      customer_email: customerInfo.email,
    };

    // For development/testing - use mock API instead of real endpoint
    const { url } = await mockCreateCheckoutSession(requestData);
    return { url };

    /* Commented out real API call - would be used in production
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to create checkout session:', errorData);
      return { 
        url: null, 
        error: errorData.message || 'Failed to create checkout session' 
      };
    }

    const { url } = await response.json();
    return { url };
    */
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
    // For development/testing - use mock API instead of real endpoint
    const { valid } = await mockValidateStripeSession(sessionId);
    return valid;

    /* Commented out real API call - would be used in production
    const response = await fetch(`/api/stripe/validate-session?session_id=${sessionId}`);
    
    if (!response.ok) {
      return false;
    }
    
    const { valid } = await response.json();
    return valid;
    */
  } catch (error) {
    console.error('Error validating stripe session:', error);
    return false;
  }
};
