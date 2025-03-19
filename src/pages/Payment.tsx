import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Upload, CheckCircle, AlertCircle, Wallet, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { confirmOrder, Order } from '@/services/OrderService';

// PayLah QR code image URL
const payLahQRImage = '/lovable-uploads/paylah.png';

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
  
  const handlePaymentProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Only accept image files
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setPaymentProof(file);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
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
      // Clear session storage
      sessionStorage.removeItem('orderDetails');
      clearCart();
      navigate('/');
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
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold">No Items to Pay For</h1>
            <p className="text-gray-400">Your cart is empty. Please add items before proceeding to payment.</p>
            <Button 
              onClick={() => navigate('/#merchandise')}
              className="bg-trex-accent text-trex-black hover:bg-trex-white font-bold"
            >
              SHOP NOW
            </Button>
          </div>
        </div>
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
          
          {orderDetails && (
            <div className="brutalist-bordered p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">ORDER DETAILS</h2>
              <div className="space-y-2">
                <p><span className="font-mono">Order Number:</span> {orderDetails.order_number}</p>
                <p><span className="font-mono">Name:</span> {orderDetails.name}</p>
                <p><span className="font-mono">Collection:</span> {orderDetails.collectDate} at {orderDetails.collectLocation}</p>
                <p><span className="font-mono">Total Amount:</span> S${orderDetails.transaction_value.toFixed(2)}</p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Payment Instructions */}
            <div className="brutalist-bordered p-6">
              <h2 className="text-2xl font-bold mb-6">HOW TO PAY</h2>
              
              <div className="flex items-center justify-center mb-8">
                <div className="p-4 bg-white">
                  <img src={payLahQRImage} alt="PayLah QR Code" className="w-60 h-60" />
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Step 1: Scan QR Code</h3>
                  <p className="text-gray-400">
                    Use your preferred payment app to scan the QR code above. We accept:
                  </p>
                  <ul className="space-y-2 mt-2">
                    <li className="flex items-center gap-2 font-mono">
                      <Wallet size={18} /> PayNow
                    </li>
                    <li className="flex items-center gap-2 font-mono">
                      <Wallet size={18} /> PayLah!
                    </li>
                    <li className="flex items-center gap-2 font-mono">
                      <CreditCard size={18} /> NETS QR
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-2">Step 2: Enter Amount</h3>
                  <p className="text-gray-400">
                    Enter the total amount of <span className="font-bold">S${cartTotal.toFixed(2)}</span>
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-2">Step 3: Complete Payment</h3>
                  <p className="text-gray-400 mb-4">
                    After payment is complete, take a screenshot of your payment confirmation
                    and upload it below.
                  </p>
                  
                  <div className="mt-4">
                    <Label htmlFor="payment-proof" className="text-white mb-2 block">
                      Upload Payment Proof
                    </Label>
                    
                    <div className="mt-2">
                      {!imagePreview ? (
                        <div className="border-2 border-dashed border-gray-600 rounded-md p-8 text-center cursor-pointer hover:border-trex-accent transition-colors"
                             onClick={() => document.getElementById('payment-proof')?.click()}>
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm font-medium text-gray-400">
                            Click to upload or drag and drop
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            PNG, JPG, GIF up to 5MB
                          </p>
                          <Input
                            id="payment-proof"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePaymentProofChange}
                            disabled={isProcessingPayment}
                          />
                        </div>
                      ) : (
                        <div className="relative mt-2">
                          <img 
                            src={imagePreview} 
                            alt="Payment proof" 
                            className="max-h-96 rounded-md mx-auto"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                            onClick={() => {
                              setPaymentProof(null);
                              setImagePreview(null);
                            }}
                            disabled={isProcessingPayment}
                          >
                            Change
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {paymentProof && (
                      <p className="mt-2 text-sm flex items-center gap-1 text-green-500">
                        <CheckCircle size={16} className="inline" />
                        {paymentProof.name} ready to upload
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="space-y-8">
              <div className="brutalist-bordered p-6">
                <h2 className="text-2xl font-bold mb-6">ORDER SUMMARY</h2>
                
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size || ''}`} className="flex justify-between pb-4 border-b border-gray-700">
                      <div>
                        <p className="font-bold">{item.name} × {item.quantity}</p>
                        {item.size && <p className="text-sm text-gray-400">Size: {item.size}</p>}
                      </div>
                      <p>S${item.total.toFixed(2)}</p>
                    </div>
                  ))}
                  
                  <div className="flex justify-between text-xl font-bold pt-2">
                    <span>Total</span>
                    <span>S${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="brutalist-bordered p-6">
                <h2 className="text-2xl font-bold mb-4">PAYMENT STATUS</h2>
                {!paymentProof ? (
                  <div className="flex items-center gap-2 text-yellow-500">
                    <AlertCircle size={20} /> 
                    <span>Awaiting payment proof</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle size={20} /> 
                    <span>Payment proof ready</span>
                  </div>
                )}
              </div>
              
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
