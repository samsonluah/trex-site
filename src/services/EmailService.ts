
import { Order } from './OrderService';

// Function to send order confirmation email
export const sendOrderConfirmationEmail = async (
  order: Order,
  itemsJson: string
): Promise<{success: boolean; error?: string}> => {
  try {
    // Parse the items from JSON string
    const items = JSON.parse(itemsJson || '[]');
    
    // Format the items for the email template
    const itemsList = items.map((item: any) => ({
      name: item.name,
      size: item.size || 'N/A',
      quantity: item.quantity,
      price: item.total.toFixed(2)
    }));
    
    // Prepare data for EmailJS template
    const templateParams = {
      to_email: order.email,
      to_name: order.name,
      order_number: order.order_number,
      order_date: new Date().toLocaleDateString(),
      order_total: order.transaction_value.toFixed(2),
      collection_date: order.collection_date,
      collection_location: order.collection_location,
      items: JSON.stringify(itemsList)
    };
    
    // Make API call to send email using EmailJS
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: import.meta.env.VITE_EMAILJS_SERVICE_ID,
        template_id: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        user_id: import.meta.env.VITE_EMAILJS_USER_ID,
        template_params: templateParams
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Email sending failed:', errorData);
      return { success: false, error: 'Failed to send email. Please try again.' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { 
      success: false, 
      error: typeof error === 'string' ? error : 'Failed to send confirmation email' 
    };
  }
};
