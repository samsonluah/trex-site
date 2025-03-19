
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { confirmOrder, Order } from '@/services/OrderService';

// Components
import PaymentInstructions from '@/components/payment/PaymentInstructions';
import OrderSummary from '@/components/payment/OrderSummary';
import PaymentStatus from '@/components/payment/PaymentStatus';
import PaymentProofUploader from '@/components/payment/PaymentProofUploader';
import OrderDetails from '@/components/payment/OrderDetails';
import EmptyCartMessage from '@/components/payment/EmptyCartMessage';

// PayLah QR code image URL
const payLahQRImage = '/lovable-uploads/45fc51a9-affb-44aa-bdfd-4622110db6c5.png';

type OrderDetailsState = Order & {
  collectDate: string;
  collectLocation: string;
};

const Payment = () => {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<OrderDetailsState | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  useEffect(() => {
    // Get order details from session storage
    const storedDetails = sessionStorage.getItem('orderDetails');
    if (storedDetails) {
      try {
        setOrderDetails(JSON.parse(storedDetails));
      } catch (error) {
        console.error('Error parsing order details:', error);
      }
    }
  }, []);
  
  const handlePaymentProofChange = (file: File) => {
    setPaymentProof(file);
  };
  
  const handleCompletePurchase = async () => {
    if (!orderDetails) {
      toast.error('Order details not found');
      return;
    }
    
    if (!paymentProof) {
      toast.error('Please upload your payment proof before continuing');
      return;
    }
    
    setIsProcessingPayment(true);
    setIsUploading(true);
    
    try {
      // Extract the Order type fields from orderDetails (removing our added collectDate and collectLocation)
      const { collectDate, collectLocation, ...orderToConfirm } = orderDetails;
      
      // Create the order in Supabase with payment proof
      const result = await confirmOrder(orderToConfirm, paymentProof);
      
      if (!result.success) {
        toast.error(result.error || 'Failed to complete payment');
        setIsProcessingPayment(false);
        setIsUploading(false);
        return;
      }
      
      toast.success('Thank you for your purchase! Your order has been confirmed.');
      
      // Store confirmed order details in session storage for the confirmation page
      sessionStorage.setItem('confirmedOrder', JSON.stringify(orderToConfirm));
      
      // Clear order details from session storage
      sessionStorage.removeItem('orderDetails');
      clearCart();
      
      // Redirect to confirmation page
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('An error occurred during payment. Please try again.');
    } finally {
      setIsProcessingPayment(false);
      setIsUploading(false);
    }
  };
  
  if (items.length === 0 && !orderDetails) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <EmptyCartMessage />
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="brutalist-container">
          <h1 className="text-3xl font-bold mb-8">PAYMENT</h1>
          
          {orderDetails && <OrderDetails order={orderDetails} className="mb-8" />}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Payment Instructions */}
            <div className="space-y-8">
              <PaymentInstructions 
                qrImageSrc={payLahQRImage} 
                cartTotal={cartTotal} 
              />
              
              <PaymentProofUploader 
                isProcessingPayment={isProcessingPayment}
                onFileChange={handlePaymentProofChange}
                className="mt-4"
              />
            </div>
            
            {/* Order Summary and Payment Status */}
            <div className="space-y-8">
              <OrderSummary 
                items={items} 
                cartTotal={cartTotal} 
              />
              
              <PaymentStatus hasPaymentProof={!!paymentProof} />
              
              <Button
                onClick={handleCompletePurchase}
                disabled={isProcessingPayment || !paymentProof}
                className="w-full py-6 bg-trex-accent text-trex-black hover:bg-trex-white font-bold text-lg relative"
              >
                {isProcessingPayment ? (
                  <>
                    <span className="opacity-0">PROCESSING</span>
                    <span className="absolute inset-0 flex items-center justify-center">
                      {isUploading ? 'UPLOADING PROOF...' : 'CONFIRMING ORDER...'}
                    </span>
                  </>
                ) : (
                  'CONFIRM ORDER'
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Payment;
