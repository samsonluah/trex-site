
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const EmptyCartMessage = () => {
  const navigate = useNavigate();
  
  return (
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
  );
};

export default EmptyCartMessage;
