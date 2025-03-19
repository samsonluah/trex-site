
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { QrCode, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const Payment = () => {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);
  
  const handleCopyNumber = () => {
    navigator.clipboard.writeText('+65 XXXX XXXX');
    setCopied(true);
    toast.success('WhatsApp number copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleCompletePurchase = () => {
    toast.success('Thank you for your purchase!');
    clearCart();
    navigate('/');
  };
  
  if (items.length === 0) {
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Payment Instructions */}
            <div className="brutalist-bordered p-6">
              <h2 className="text-2xl font-bold mb-6">HOW TO PAY</h2>
              
              <div className="flex items-center justify-center mb-8">
                <QrCode className="text-trex-accent" size={200} />
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Step 1: Scan QR Code</h3>
                  <p className="text-gray-400">
                    Use your preferred payment app to scan the QR code above. We accept:
                  </p>
                  <ul className="space-y-2 mt-2">
                    <li className="font-mono">→ PayNow</li>
                    <li className="font-mono">→ PayLah!</li>
                    <li className="font-mono">→ NETS QR</li>
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
                  <p className="text-gray-400">
                    After payment is complete, take a screenshot of your payment confirmation
                    and send it to our WhatsApp number or email for verification.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="brutalist-bordered p-6">
                <h2 className="text-2xl font-bold mb-6">CONTACT INFO</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="font-mono text-lg">WhatsApp:</p>
                    <Button
                      variant="outline"
                      className="border-trex-white text-trex-white hover:bg-trex-accent hover:text-trex-black"
                      onClick={handleCopyNumber}
                    >
                      +65 XXXX XXXX
                      {copied ? <Check className="ml-2" size={16} /> : <Copy className="ml-2" size={16} />}
                    </Button>
                  </div>
                  
                  <div>
                    <p className="font-mono text-lg mb-2">Email:</p>
                    <p className="font-mono">info@trexathletics.club</p>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <h3 className="text-xl font-bold mb-4">Please include:</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li>1. Your full name</li>
                    <li>2. Item(s) purchased</li>
                    <li>3. Date of community run for collection</li>
                    <li>4. Payment screenshot</li>
                  </ul>
                </div>
              </div>
              
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
              
              <Button
                onClick={handleCompletePurchase}
                className="w-full py-6 bg-trex-accent text-trex-black hover:bg-trex-white font-bold text-lg"
              >
                I'VE MADE MY PAYMENT
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
