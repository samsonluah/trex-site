
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getUpcomingRuns, RunEvent } from '@/services/RunDateData';
import { prepareOrder } from '@/services/OrderService';
import { createStripeCheckoutSession } from '@/services/StripeService';
import { getProductById, getCommonCollectionDates, collectionDates } from '@/services/ProductData';

// Custom styles for the radio group
import '@/styles/radio-group.css';

const Checkout = () => {
  const { items, cartTotal } = useCart();
  const navigate = useNavigate();
  const [upcomingRuns, setUpcomingRuns] = useState<RunEvent[]>([]);
  const [availableCollectionDates, setAvailableCollectionDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    collectDate: '',
  });
  
  useEffect(() => {
    const fetchRuns = async () => {
      try {
        setLoading(true);
        const runs = await getUpcomingRuns();
        setUpcomingRuns(runs);
        
        // Get the products in the cart
        const productsInCart = items.map(item => getProductById(item.id)).filter(Boolean);
        
        // Get common collection dates
        const commonDates = getCommonCollectionDates(productsInCart);
        setAvailableCollectionDates(commonDates.map(date => date.id));
        
        // Set first valid run as default if available
        if (runs.length > 0 && commonDates.length > 0) {
          // Find the first run that matches an available collection date
          const firstMatchingRun = runs.find(run => {
            const matchingCollectionDate = commonDates.find(cd => {
              const cdDate = new Date(cd.date);
              const runDate = new Date(run.date);
              return cdDate.setHours(0,0,0,0) === runDate.setHours(0,0,0,0);
            });
            return !!matchingCollectionDate;
          });
          
          if (firstMatchingRun) {
            setFormData(prev => ({...prev, collectDate: firstMatchingRun.id}));
          }
        }
      } catch (error) {
        console.error('Failed to fetch upcoming runs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRuns();
  }, [items]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Filter runs based on available collection dates
  const filteredRuns = upcomingRuns.filter(run => {
    // Find if this run date matches any available collection date
    const runDate = new Date(run.date).setHours(0,0,0,0);
    
    return collectionDates.some(cd => {
      const collectionDate = new Date(cd.date).setHours(0,0,0,0);
      return collectionDate === runDate && availableCollectionDates.includes(cd.id);
    });
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSubmitting(true);
    
    try {
      // Find the selected collection run
      const selectedRun = upcomingRuns.find(run => run.id === formData.collectDate);
      
      if (!selectedRun) {
        toast.error('Please select a collection date');
        setSubmitting(false);
        return;
      }

      // Prepare order details but don't create in Supabase yet
      const result = await prepareOrder(
        formData.name,
        formData.email,
        formData.phone,
        cartTotal,
        selectedRun,
        JSON.stringify(items)
      );
      
      if (!result.success || !result.orderDetails) {
        toast.error(result.error || 'Failed to process order');
        setSubmitting(false);
        return;
      }
      
      // Store order details in session storage for potential use later
      sessionStorage.setItem('orderDetails', JSON.stringify({
        ...result.orderDetails,
        collectDate: selectedRun.formattedDate,
        collectLocation: selectedRun.location
      }));

      // Create Stripe checkout session
      console.log('Creating Stripe checkout session...');
      
      try {
        const checkoutResult = await createStripeCheckoutSession(
          items,
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          },
          selectedRun
        );

        if (!checkoutResult.url) {
          console.error('Checkout error:', checkoutResult.error);
          toast.error(checkoutResult.error || 'Failed to create checkout session');
          setSubmitting(false);
          return;
        }

        console.log('Redirecting to Stripe checkout:', checkoutResult.url);
        // Redirect to Stripe checkout
        window.location.href = checkoutResult.url;
      } catch (stripeError) {
        console.error('Stripe checkout error:', stripeError);
        toast.error(`Payment processing error: ${stripeError.message || 'Unknown error'}`);
        setSubmitting(false);
      }
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('An error occurred during checkout. Please try again.');
    } finally {
      setSubmitting(false);
    }
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
                  
                  {loading ? (
                    <div className="text-gray-400">Loading available collection dates...</div>
                  ) : filteredRuns.length > 0 ? (
                    <RadioGroup 
                      value={formData.collectDate} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, collectDate: value }))}
                      required 
                      className="space-y-3 custom-radio-group"
                    >
                      {filteredRuns.map(run => (
                        <div key={run.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={run.id} id={run.id} className="text-trex-white border-trex-white" />
                          <Label htmlFor={run.id}>{run.formattedDate} - {run.location}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <div className="text-amber-500">
                      There are no common collection dates available for all items in your cart. 
                      Please review your cart and consider removing items with conflicting collection dates.
                    </div>
                  )}
                </div>
                
                <Button
                  type="submit"
                  disabled={submitting || filteredRuns.length === 0}
                  className="w-full py-6 bg-trex-accent text-trex-black hover:bg-trex-white font-bold text-lg"
                >
                  {submitting ? 'PROCESSING...' : 'PROCEED TO SECURE PAYMENT'}
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
