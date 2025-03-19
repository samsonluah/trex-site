
import React from 'react';
import { Order } from '@/services/OrderService';

interface OrderDetailsProps {
  order: (Order & {
    collectDate: string;
    collectLocation: string;
  });
  className?: string;
}

const OrderDetails = ({ order, className }: OrderDetailsProps) => {
  return (
    <div className={`brutalist-bordered p-6 ${className}`}>
      <h2 className="text-2xl font-bold mb-6">ORDER DETAILS</h2>
      <div className="space-y-2">
        <p><span className="font-mono">Order Number:</span> {order.order_number}</p>
        <p><span className="font-mono">Name:</span> {order.name}</p>
        <p><span className="font-mono">Collection:</span> {order.collectDate} at {order.collectLocation}</p>
        <p><span className="font-mono">Total Amount:</span> S${order.transaction_value.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default OrderDetails;
