
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Order } from '@/services/OrderService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const OrderConfirmation = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get order from session storage
    const storedOrder = sessionStorage.getItem('confirmedOrder');
    if (storedOrder) {
      try {
        setOrder(JSON.parse(storedOrder));
      } catch (error) {
        console.error('Error parsing order:', error);
      }
    } else {
      // If no order in session storage, redirect to home
      navigate('/');
    }
  }, [navigate]);
  
  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading order details...</p>
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
          <div className="flex flex-col items-center text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold">ORDER CONFIRMED</h1>
            <p className="text-gray-400 mt-2">Your order has been successfully placed!</p>
          </div>
          
          <Card className="mb-8 bg-trex-black border-trex-white text-trex-white">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between pb-2 border-b border-gray-700">
                  <span className="font-mono">Order Number</span>
                  <span>{order.order_number}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-700">
                  <span className="font-mono">Name</span>
                  <span>{order.name}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-700">
                  <span className="font-mono">Email</span>
                  <span>{order.email}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-700">
                  <span className="font-mono">Phone</span>
                  <span>{order.phone}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-700">
                  <span className="font-mono">Collection Date</span>
                  <span>{order.collection_date}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-700">
                  <span className="font-mono">Collection Location</span>
                  <span>{order.collection_location}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2">
                  <span>Total</span>
                  <span>S${order.transaction_value.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col items-center">
            <p className="text-gray-400 mb-6 text-center">
              A confirmation has been sent to your email. Please keep this reference for collection.
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-trex-accent text-trex-black hover:bg-trex-white font-bold"
            >
              BACK TO HOME
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
