
import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface PaymentStatusProps {
  hasPaymentProof: boolean;
  className?: string;
}

const PaymentStatus = ({ hasPaymentProof, className }: PaymentStatusProps) => {
  return (
    <div className={`brutalist-bordered p-6 ${className}`}>
      <h2 className="text-2xl font-bold mb-4">PAYMENT STATUS</h2>
      {!hasPaymentProof ? (
        <div className="flex items-center gap-2 text-yellow-500">
          <AlertCircle size={20} /> 
          <span>Awaiting payment proof</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-green-500">
          <CheckCircle size={20} /> 
          <span>Payment proof ready</span>
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;
