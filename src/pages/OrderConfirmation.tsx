
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { validateStripeSession } from '@/services/StripeService';

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const sessionId = searchParams.get('session_id');
  
  useEffect(() => {
    const verifyStripeSession = async () => {
      if (!sessionId) {
        // No session ID, check if we have order details in session storage
        const storedOrder = sessionStorage.getItem('confirmedOrder');
        if (storedOrder) {
          setOrderDetails(JSON.parse(storedOrder));
          setIsVerifying(false);
          return;
        }
        
        // No session ID and no stored order, redirect to home
        navigate('/');
        return;
      }
      
      // Verify the Stripe session
      const isValid = await validateStripeSession(sessionId);
      
      if (!isValid) {
        // Invalid session, redirect to home
        navigate('/');
        return;
      }
      
      // Valid session, get order details from API
      // In a real implementation, this would fetch order details from your backend
      // For now, we'll just use session storage
      const storedOrder = sessionStorage.getItem('orderDetails');
      if (storedOrder) {
        setOrderDetails(JSON.parse(storedOrder));
        // Move to confirmedOrder for persistence
        sessionStorage.setItem('confirmedOrder', storedOrder);
        sessionStorage.removeItem('orderDetails');
      }
      
      setIsVerifying(false);
    };
    
    verifyStripeSession();
  }, [sessionId, navigate]);
  
  if (isVerifying) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl">Verifying payment...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!orderDetails) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold">Order Not Found</h1>
            <p className="text-gray-400">We couldn't find your order details.</p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-trex-accent text-trex-black hover:bg-trex-white font-bold"
            >
              RETURN HOME
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
        <div className="brutalist-container max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center bg-green-500 rounded-full p-4 mb-6">
              <CheckCircle size={48} className="text-black" />
            </div>
            <h1 className="text-4xl font-bold mb-2">ORDER CONFIRMED</h1>
            <p className="text-xl text-gray-400">Thank you for your purchase!</p>
          </div>
          
          <div className="brutalist-bordered p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">ORDER DETAILS</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">Order Number</p>
                  <p className="font-mono text-lg">{orderDetails.order_number}</p>
                </div>
                <div>
                  <p className="text-gray-400">Date</p>
                  <p className="font-mono text-lg">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <p className="text-gray-400">Customer</p>
                <p className="font-mono text-lg">{orderDetails.name}</p>
                <p className="font-mono">{orderDetails.email}</p>
                <p className="font-mono">{orderDetails.phone}</p>
              </div>
              
              <div>
                <p className="text-gray-400">Collection Details</p>
                <p className="font-mono text-lg">{orderDetails.collectDate || orderDetails.collection_date}</p>
                <p className="font-mono">{orderDetails.collectLocation || orderDetails.collection_location}</p>
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-6">
            <p className="text-gray-400">A confirmation email has been sent to your email address.</p>
            <p className="text-gray-400">Please bring your order number when collecting your merchandise.</p>
            
            <div className="pt-4">
              <Link to="/">
                <Button className="bg-trex-accent text-trex-black hover:bg-trex-white font-bold">
                  RETURN TO HOME
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
