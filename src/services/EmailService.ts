
import { Order } from './OrderService';

// Function to send order confirmation email
export const sendOrderConfirmationEmail = async (
  order: Order,
  itemsJson: string
): Promise<{success: boolean; error?: string}> => {
  try {
    // Parse the items from JSON string
    const items = JSON.parse(itemsJson || '[]');
    
    // Format the items for the email
    const itemsList = items.map((item: any) => {
      const sizeInfo = item.size ? ` (Size: ${item.size})` : '';
      return `${item.name}${sizeInfo} × ${item.quantity} - S$${item.total.toFixed(2)}`;
    }).join('\n');
    
    // Compose email subject and body
    const subject = `T-Rex Athletics Order Confirmation #${order.order_number}`;
    const body = `
Hello ${order.name},

Thank you for your order with T-Rex Athletics!

ORDER DETAILS:
Order Number: ${order.order_number}
Date: ${new Date().toLocaleDateString()}

Items Purchased:
${itemsList}

Total: S$${order.transaction_value.toFixed(2)}

Collection Details:
Date: ${order.collection_date}
Location: ${order.collection_location}

Please bring a copy of this confirmation when you collect your items.

If you have any questions, please contact us at info@trexathletics.club.

Thank you for supporting T-Rex Athletics!
    `;
    
    // Make API call to send email
    // For this implementation, we'll use EmailJS as a simple email service
    // You'll need to add your EmailJS credentials as environment variables
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: import.meta.env.VITE_EMAILJS_SERVICE_ID,
        template_id: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        user_id: import.meta.env.VITE_EMAILJS_USER_ID,
        template_params: {
          to_email: order.email,
          to_name: order.name,
          subject: subject,
          message: body,
          order_number: order.order_number
        }
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
