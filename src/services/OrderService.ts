
import { supabase } from '@/lib/supabase';
import { RunEvent } from './RunDateData';
import { sendOrderConfirmationEmail } from './EmailService';

// Define Order type
export type Order = {
  id?: string;
  order_number: string;
  name: string;
  email: string;
  phone: string;
  transaction_value: number;
  collection_date: string;
  collection_location: string;
  created_at?: string;
  items?: string; // JSON string of cart items
};

// Generate a unique order number
const generateOrderNumber = (): string => {
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TX-${timestamp}-${random}`;
};

// Prepare order details without creating in Supabase yet
export const prepareOrder = (
  name: string,
  email: string,
  phone: string,
  transactionValue: number,
  collectionRun: RunEvent | undefined,
  cartItems: string
): {success: boolean; orderDetails?: Order; error?: string} => {
  try {
    if (!collectionRun) {
      return { success: false, error: 'No collection run selected' };
    }
    
    const orderNumber = generateOrderNumber();
    
    const orderDetails: Order = {
      order_number: orderNumber,
      name,
      email,
      phone,
      transaction_value: transactionValue,
      collection_date: collectionRun.date,
      collection_location: collectionRun.location,
      items: cartItems
    };
    
    return { 
      success: true, 
      orderDetails 
    };
  } catch (error) {
    console.error('Error in prepareOrder:', error);
    return { 
      success: false, 
      error: typeof error === 'string' ? error : 'Failed to prepare order' 
    };
  }
};

// Create a new order in Supabase (now only used for server-side operations if needed)
export const confirmOrder = async (
  orderDetails: Order
): Promise<{success: boolean; error?: string}> => {
  try {
    // Create a copy of the order details to avoid mutating the original
    const orderToConfirm = { 
      ...orderDetails,
      created_at: new Date().toISOString() // Add current timestamp for created_at
    };
    
    // Insert the order into the database
    const { error } = await supabase
      .from('orders')
      .insert(orderToConfirm);

    if (error) {
      console.error('Error creating order:', error);
      return { 
        success: false, 
        error: error.message
      };
    }

    // After successfully creating the order, send confirmation email
    if (orderToConfirm.email && orderToConfirm.items) {
      const emailResult = await sendOrderConfirmationEmail(orderToConfirm, orderToConfirm.items);
      if (!emailResult.success) {
        console.warn('Order created but email failed:', emailResult.error);
        // We don't want to fail the order confirmation just because the email failed
        // So we just log the error but still return success for the order
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error in confirmOrder:', error);
    return { 
      success: false, 
      error: typeof error === 'string' ? error : 'Failed to confirm order' 
    };
  }
};
