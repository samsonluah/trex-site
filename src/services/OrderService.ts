
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
};

// Generate a unique order number
const generateOrderNumber = (): string => {
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TX-${timestamp}-${random}`;
};

// Create a new order in Supabase
export const createOrder = async (
  name: string,
  email: string,
  phone: string,
  transactionValue: number,
  collectionRun: RunEvent | undefined,
  cartItems: string
): Promise<{success: boolean; orderNumber?: string; error?: string}> => {
  try {
    if (!collectionRun) {
      return { success: false, error: 'No collection run selected' };
    }

    const orderNumber = generateOrderNumber();
    
    const { data, error } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        name,
        email,
        phone,
        transaction_value: transactionValue,
        collection_date: collectionRun.date,
        collection_location: collectionRun.location,
        items: cartItems
      })
      .select();

    if (error) {
      console.error('Error creating order:', error);
      return { 
        success: false, 
        error: error.message
      };
    }

    return { 
      success: true, 
      orderNumber 
    };
  } catch (error) {
    console.error('Error in createOrder:', error);
    return { 
      success: false, 
      error: typeof error === 'string' ? error : 'Failed to create order' 
    };
  }
};
