
import { supabase, uploadPaymentProof } from '@/lib/supabase';
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
  payment_proof_url?: string; // URL to the payment proof image
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

// Create a new order in Supabase after payment confirmation and proof upload
export const confirmOrder = async (
  orderDetails: Order, 
  paymentProofFile?: File
): Promise<{success: boolean; error?: string}> => {
  try {
    // Create a copy of the order details to avoid mutating the original
    const orderToConfirm = { ...orderDetails, payment_status: 'completed' };
    
    // If payment proof file is provided, upload it to Supabase storage
    if (paymentProofFile) {
      const paymentProofUrl = await uploadPaymentProof(paymentProofFile, orderDetails.order_number);
      
      if (paymentProofUrl) {
        orderToConfirm.payment_proof_url = paymentProofUrl;
      } else {
        return { 
          success: false, 
          error: 'Failed to upload payment proof' 
        };
      }
    }
    
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

    return { success: true };
  } catch (error) {
    console.error('Error in confirmOrder:', error);
    return { 
      success: false, 
      error: typeof error === 'string' ? error : 'Failed to confirm order' 
    };
  }
};
