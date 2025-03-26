
import { CartItem } from '@/context/CartContext';
import { getProductById } from './ProductData';
import { RunEvent } from './RunDateData';
import { 
  createStripeCheckoutSession as callStripeCheckoutAPI, 
  validateStripeSession as callStripeValidationAPI 
} from './supabase-functions/stripe-api';

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
      
      // Use the correct format required by Stripe
      return {
        price: product.stripePriceId,
        quantity: item.quantity,
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

    // Save order details to session storage for the confirmation page
    sessionStorage.setItem('orderDetails', JSON.stringify({
      name: customerInfo.name,
      email: customerInfo.email,
      phone: customerInfo.phone,
      collectDate: collectionRun.formattedDate,
      collectLocation: collectionRun.location,
      items: items
    }));

    // Get the current origin for success and cancel URLs
    const origin = window.location.origin;

    // Construct request data for Stripe API
    const requestData = {
      line_items: lineItems,
      metadata,
      success_url: `${origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      customer_email: customerInfo.email,
      // Enable Stripe's automatic email receipts
      send_email_receipt: true
    };

    console.log('Making Stripe API call with data:', JSON.stringify(requestData));
    
    try {
      const response = await callStripeCheckoutAPI(requestData);
      console.log('Stripe API response:', response);
      return { url: response.url };
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error);
      
      return { 
        url: null, 
        error: error instanceof Error ? 
          `API error: ${error.message}` : 
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
    const isValid = await callStripeValidationAPI(sessionId);
    return isValid;
  } catch (error) {
    console.error('Error validating stripe session:', error);
    return false;
  }
};
