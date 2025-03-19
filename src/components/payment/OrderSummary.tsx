
import React from 'react';
import { CartItem } from '@/context/CartContext';

interface OrderSummaryProps {
  items: CartItem[];
  cartTotal: number;
  className?: string;
}

const OrderSummary = ({ items, cartTotal, className }: OrderSummaryProps) => {
  return (
    <div className={`brutalist-bordered p-6 ${className}`}>
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
  );
};

export default OrderSummary;
