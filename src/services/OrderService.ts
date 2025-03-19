
import { supabase } from '@/lib/supabase';
import { RunEvent } from './RunDateData';

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
  payment_status?: 'pending' | 'completed';
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
      items: cartItems,
      payment_status: 'pending'
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

// Create a new order in Supabase after payment confirmation
export const confirmOrder = async (orderDetails: Order): Promise<{success: boolean; error?: string}> => {
  try {
    // Update payment status to completed
    const orderWithCompletedPayment = {
      ...orderDetails,
      payment_status: 'completed'
    };
    
    const { error } = await supabase
      .from('orders')
      .insert(orderWithCompletedPayment);

    if (error) {
      console.error('Error creating order:', error);
      return { 
        success: false, 
        error: error.message
      };
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
