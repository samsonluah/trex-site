
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { getProductBySlug, getProductById } from '@/services/ProductData';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();
  
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
            <p className="text-gray-400">Looks like you haven't added any items to your cart yet.</p>
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
          <h1 className="text-3xl font-bold mb-8">YOUR CART</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => {
                // Get the product to obtain the correct slug for linking
                const product = getProductById(item.id);
                const productSlug = product?.slug || '';
                
                return (
                  <div key={`${item.id}-${item.size || ''}`} className="brutalist-bordered p-4 flex flex-col md:flex-row">
                    {/* Product Image */}
                    <div className="md:w-1/4 aspect-square bg-trex-white">
                      <Link to={`/product/${productSlug}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </Link>
                    </div>
                    
                    {/* Product Details */}
                    <div className="md:w-3/4 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <Link to={`/product/${productSlug}`} className="hover:text-trex-accent">
                              <h3 className="text-xl font-bold">{product?.name || item.name}</h3>
                            </Link>
                            {item.size && <p className="text-gray-400">Size: {item.size}</p>}
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id, item.size)}
                            aria-label="Remove item"
                          >
                            <Trash2 className="text-gray-400 hover:text-red-500" size={20} />
                          </button>
                        </div>
                        
                        <p className="text-xl font-mono mt-2">S${item.price.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                            className="h-8 w-8 bg-transparent border-trex-white text-trex-white hover:bg-trex-accent hover:text-trex-black"
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="w-10 text-center">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                            className="h-8 w-8 bg-transparent border-trex-white text-trex-white hover:bg-trex-accent hover:text-trex-black"
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                        
                        <p className="font-bold">S${item.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Order Summary */}
            <div className="brutalist-bordered p-6 h-fit">
              <h2 className="text-2xl font-bold mb-6">ORDER SUMMARY</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between border-b border-gray-700 pb-4">
                  <span>Subtotal</span>
                  <span>S${cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between border-b border-gray-700 pb-4">
                  <span>Collection</span>
                  <span>Free at Community Runs</span>
                </div>
                
                <div className="flex justify-between text-xl font-bold pt-2">
                  <span>Total</span>
                  <span>S${cartTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <Button
                onClick={() => navigate('/checkout')}
                className="w-full py-6 bg-trex-accent text-trex-black hover:bg-trex-white font-bold text-lg"
              >
                PROCEED TO CHECKOUT
              </Button>
              
              <div className="mt-6">
                <Link to="/#merchandise" className="text-center block text-gray-400 underline hover:text-trex-accent">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
