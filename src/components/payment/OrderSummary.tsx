
import React from 'react';
import { CartItem } from '@/context/CartContext';
import { getProductById } from '@/services/ProductData';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface OrderSummaryProps {
  items: CartItem[];
  cartTotal: number;
  className?: string;
  showCheckoutButton?: boolean;
}

const OrderSummary = ({ items, cartTotal, className, showCheckoutButton = true }: OrderSummaryProps) => {
  const navigate = useNavigate();
  
  return (
    <div className={`brutalist-bordered p-6 ${className}`}>
      <h2 className="text-2xl font-bold mb-6">ORDER SUMMARY</h2>
      
      <div className="space-y-4 mb-6">
        {items.map((item) => {
          const product = getProductById(item.id);
          const productSlug = product?.slug || '';
          
          return (
            <div key={`${item.id}-${item.size || ''}`} className="flex justify-between pb-4 border-b border-gray-700">
              <div>
                <Link to={`/product/${productSlug}`} className="hover:text-trex-accent">
                  <p className="font-bold">{product?.name || item.name} × {item.quantity}</p>
                </Link>
                {item.size && <p className="text-sm text-gray-400">Size: {item.size}</p>}
              </div>
              <p>S${item.total.toFixed(2)}</p>
            </div>
          );
        })}
        
        <div className="flex justify-between text-xl font-bold pt-2">
          <span>Total</span>
          <span>S${cartTotal.toFixed(2)}</span>
        </div>
      </div>

      {showCheckoutButton && (
        <>
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
        </>
      )}
    </div>
  );
};

export default OrderSummary;
