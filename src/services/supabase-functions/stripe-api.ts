
// This file provides the implementation for Stripe API calls through Supabase Edge Functions

/**
 * Call the Stripe checkout session creation function
 */
export const createStripeCheckoutSession = async (requestData: any) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  
  try {
    console.log('Calling Stripe checkout function at:', `${supabaseUrl}/functions/v1/stripe-checkout`);
    
    const response = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Stripe function error response:', response.status, errorText);
      throw new Error(`Error: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in createStripeCheckoutSession:', error);
    throw error;
  }
};

/**
 * Call the Stripe session validation function
 */
export const validateStripeSession = async (sessionId: string): Promise<boolean> => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  
  try {
    console.log('Calling validate session function at:', `${supabaseUrl}/functions/v1/validate-session`);
    
    const response = await fetch(`${supabaseUrl}/functions/v1/validate-session?session_id=${sessionId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Validate session function error response:', response.status, errorText);
      throw new Error(`Error: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    return result.valid === true;
  } catch (error) {
    console.error('Error in validateStripeSession:', error);
    throw error;
  }
};
