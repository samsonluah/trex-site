
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Order } from '@/services/OrderService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, Camera } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  total: number;
}

const OrderConfirmation = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get order from session storage
    const storedOrder = sessionStorage.getItem('confirmedOrder');
    if (storedOrder) {
      try {
        const parsedOrder = JSON.parse(storedOrder);
        setOrder(parsedOrder);
        
        // Parse items from the order's items JSON string if it exists
        if (parsedOrder.items) {
          try {
            const parsedItems = JSON.parse(parsedOrder.items);
            setOrderItems(parsedItems);
          } catch (err) {
            console.error('Error parsing order items:', err);
          }
        }
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
          
          <Alert className="mb-6 bg-yellow-50 border-yellow-400 text-yellow-800">
            <Camera className="h-5 w-5 mr-2" />
            <AlertDescription className="font-medium">
              IMPORTANT: Please take a screenshot of this page for your records. You will need this information when collecting your items.
            </AlertDescription>
          </Alert>
          
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
                
                {orderItems.length > 0 && (
                  <div className="pt-4 mb-4">
                    <h3 className="text-lg font-bold mb-3 flex items-center">
                      <Package className="mr-2" size={18} />
                      Items Purchased
                    </h3>
                    <div className="space-y-3">
                      {orderItems.map((item, index) => (
                        <div key={`${item.id}-${item.size || ''}-${index}`} className="flex justify-between pb-2 border-b border-gray-600">
                          <div>
                            <span className="font-medium">{item.name} × {item.quantity}</span>
                            {item.size && <span className="ml-2 text-sm text-gray-400">(Size: {item.size})</span>}
                          </div>
                          <span>S${item.total.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between text-xl font-bold pt-2">
                  <span>Total</span>
                  <span>S${order.transaction_value.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col items-center">
            <p className="text-gray-400 mb-6 text-center">
              Please keep this reference for collection.
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
