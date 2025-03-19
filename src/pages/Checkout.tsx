import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getUpcomingRuns } from '@/services/RunDateData';

const Checkout = () => {
  const { items, cartTotal } = useCart();
  const navigate = useNavigate();
  const upcomingRuns = getUpcomingRuns();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    collectDate: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/payment');
  };
  
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
            <p className="text-gray-400">You need to add items to your cart before checkout.</p>
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
          <h1 className="text-3xl font-bold mb-8">CHECKOUT</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              <form onSubmit={handleSubmit}>
                <div className="brutalist-bordered p-6 mb-8">
                  <h2 className="text-2xl font-bold mb-6">CONTACT INFORMATION</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-transparent border-trex-white"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-transparent border-trex-white"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="bg-transparent border-trex-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="brutalist-bordered p-6 mb-8">
                  <h2 className="text-2xl font-bold mb-6">COLLECTION DATE</h2>
                  
                  <p className="mb-4 text-gray-400">
                    All merchandise must be collected in person during our monthly community runs.
                    Please select your preferred collection date:
                  </p>
                  
                  <RadioGroup required className="space-y-3">
                    {upcomingRuns.length > 0 ? (
                      upcomingRuns.map(run => (
                        <div key={run.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={run.id} id={run.id} />
                          <Label htmlFor={run.id}>{run.formattedDate} - {run.location}</Label>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400">No upcoming runs scheduled at the moment.</div>
                    )}
                  </RadioGroup>
                </div>
                
                <Button
                  type="submit"
                  className="w-full py-6 bg-trex-accent text-trex-black hover:bg-trex-white font-bold text-lg"
                >
                  CONTINUE TO PAYMENT
                </Button>
              </form>
            </div>
            
            {/* Order Summary */}
            <div className="brutalist-bordered p-6 h-fit">
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
                
                <div className="flex justify-between border-b border-gray-700 pb-4">
                  <span>Collection</span>
                  <span>Free at Community Runs</span>
                </div>
                
                <div className="flex justify-between text-xl font-bold pt-2">
                  <span>Total</span>
                  <span>S${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
