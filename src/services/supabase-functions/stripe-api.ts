
// This file provides the implementation for Stripe API calls through Supabase Edge Functions

import { createClient } from "@supabase/supabase-js";

// Create Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Call the Stripe checkout session creation function
 */
export const createStripeCheckoutSession = async (requestData: any) => {
  try {
    const { data, error } = await supabase.functions.invoke('stripe-checkout', {
      body: requestData,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error invoking Stripe checkout function:', error);
    throw error;
  }
};

/**
 * Call the Stripe session validation function
 */
export const validateStripeSession = async (sessionId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('stripe-checkout', {
      body: { action: 'validate', sessionId },
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error invoking Stripe session validation function:', error);
    throw error;
  }
};
