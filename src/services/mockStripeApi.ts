
/**
 * This file provides mock implementations of Stripe API endpoints for development.
 * These should be replaced with actual Supabase Edge Functions in production.
 */

// Define types
type CheckoutSessionRequest = {
  line_items: any[];
  metadata: Record<string, any>;
  success_url: string;
  cancel_url: string;
  customer_email?: string;
};

type CheckoutSessionResponse = {
  url: string;
};

/**
 * Mock implementation of Stripe checkout session creation
 */
export const mockCreateCheckoutSession = async (
  request: CheckoutSessionRequest
): Promise<CheckoutSessionResponse> => {
  console.log('Mock Stripe API: Creating checkout session with data:', request);
  
  // In a real implementation, this would call the Stripe API
  // For now, we'll create a mock success URL that includes the session info
  
  // Create a mock session ID
  const mockSessionId = 'cs_test_' + Math.random().toString(36).substring(2, 15);
  
  // Replace the session ID placeholder in the success URL
  const successUrl = request.success_url.replace(
    '{CHECKOUT_SESSION_ID}',
    mockSessionId
  );
  
  // Save data to sessionStorage for the order confirmation page to use
  sessionStorage.setItem('stripe_session_id', mockSessionId);
  sessionStorage.setItem('stripe_session_valid', 'true');
  
  // Return a simulated URL that would redirect to the success page
  // In development, we'll just return the success URL directly
  return { url: successUrl };
};

/**
 * Mock implementation of Stripe session validation
 */
export const mockValidateStripeSession = async (
  sessionId: string
): Promise<{ valid: boolean }> => {
  console.log('Mock Stripe API: Validating session', sessionId);
  
  // Check if this is a session ID we've created in the mock
  const storedSessionId = sessionStorage.getItem('stripe_session_id');
  const isValid = sessionId === storedSessionId && 
                  sessionStorage.getItem('stripe_session_valid') === 'true';
  
  return { valid: isValid };
};
