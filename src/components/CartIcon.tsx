
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const CartIcon = () => {
  const { cartCount } = useCart();

  return (
    <Link to="/cart" className="relative flex items-center">
      <ShoppingCart size={24} className="text-trex-white hover:text-trex-accent transition-colors" />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-trex-accent text-trex-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
