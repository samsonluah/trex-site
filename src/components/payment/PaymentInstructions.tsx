
import React from 'react';
import { Wallet, CreditCard } from 'lucide-react';

interface PaymentInstructionsProps {
  qrImageSrc: string;
  cartTotal: number;
  className?: string;
}

const PaymentInstructions = ({ qrImageSrc, cartTotal, className }: PaymentInstructionsProps) => {
  return (
    <div className={`brutalist-bordered p-6 ${className}`}>
      <h2 className="text-2xl font-bold mb-6">HOW TO PAY</h2>
      
      <div className="flex items-center justify-center mb-8">
        <div className="p-4 bg-white">
          <img src={qrImageSrc} alt="PayLah QR Code" className="w-60 h-60" />
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold mb-2">Step 1: Scan QR Code</h3>
          <p className="text-gray-400">
            Use your preferred payment app to scan the QR code above. We accept:
          </p>
          <ul className="space-y-2 mt-2">
            <li className="flex items-center gap-2 font-mono">
              <Wallet size={18} /> PayNow
            </li>
            <li className="flex items-center gap-2 font-mono">
              <Wallet size={18} /> PayLah!
            </li>
            <li className="flex items-center gap-2 font-mono">
              <CreditCard size={18} /> NETS QR
            </li>
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
          <p className="text-gray-400 mb-4">
            After payment is complete, take a screenshot of your payment confirmation
            and upload it below.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentInstructions;
