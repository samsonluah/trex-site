
import { Order } from './OrderService';

// Function to send order confirmation email
export const sendOrderConfirmationEmail = async (
  order: Order,
  itemsJson: string
): Promise<{success: boolean; error?: string}> => {
  try {
    // Validate required email field
    if (!order.email || order.email.trim() === '') {
      console.error('Cannot send email: recipient email is empty');
      return { success: false, error: 'Recipient email address is missing' };
    }

    // Parse the items from JSON string, handle already parsed objects
    let items;
    if (typeof itemsJson === 'string') {
      try {
        items = JSON.parse(itemsJson || '[]');
      } catch (e) {
        console.warn('Items already parsed or invalid JSON, using as is:', itemsJson);
        items = [];
      }
    } else {
      items = itemsJson || [];
    }
    
    // Format the items for the email template
    const itemsList = Array.isArray(items) ? items.map((item: any) => ({
      name: item.name,
      size: item.size || 'N/A',
      quantity: item.quantity,
      price: typeof item.total === 'number' ? item.total.toFixed(2) : '0.00'
    })) : [];
    
    // For Gmail service in EmailJS:
    // The key parameter is usually just 'to' or sometimes no parameter is needed 
    // as it uses the connected Gmail account as sender and the Gmail API handles recipient
    const templateParams = {
      // Gmail specific parameters (when using Gmail service)
      to: order.email.trim(),                  // Standard Gmail format
      to_email: order.email.trim(),            // Alternative format
      
      // Add explicit recipient in message subject/body as backup
      subject: `TREX Order Confirmation #${order.order_number}`,
      message: `Order confirmation for ${order.email}`,
      
      // Template parameters from the HTML
      to_name: order.name || 'Customer',
      order_number: order.order_number,
      order_date: new Date().toLocaleDateString(),
      order_total: typeof order.transaction_value === 'number' ? order.transaction_value.toFixed(2) : '0.00',
      collection_date: order.collection_date,
      collection_location: order.collection_location,
      items: JSON.stringify(itemsList)
    };
    
    console.log('Sending email with parameters:', JSON.stringify(templateParams));
    console.log('Recipient email (to):', order.email.trim());
    
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
      const errorText = await response.text();
      console.error('Email sending failed:', errorText);
      try {
        const errorData = JSON.parse(errorText);
        return { success: false, error: errorData.error || 'Failed to send email. Please try again.' };
      } catch (e) {
        return { success: false, error: `Failed to send email: ${errorText}` };
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { 
      success: false, 
      error: typeof error === 'string' ? error : error instanceof Error ? error.message : 'Failed to send confirmation email' 
    };
  }
};
