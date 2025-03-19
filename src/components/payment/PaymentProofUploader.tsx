
import React, { useState } from 'react';
import { Upload, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PaymentProofUploaderProps {
  isProcessingPayment: boolean;
  onFileChange: (file: File) => void;
  className?: string;
}

const PaymentProofUploader = ({ isProcessingPayment, onFileChange, className }: PaymentProofUploaderProps) => {
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handlePaymentProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Only accept image files
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setPaymentProof(file);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    
    // Pass file to parent component
    onFileChange(file);
  };

  return (
    <div className={className}>
      <Label htmlFor="payment-proof" className="text-white mb-2 block">
        Upload Payment Proof
      </Label>
      
      <div className="mt-2">
        {!imagePreview ? (
          <div className="border-2 border-dashed border-gray-600 rounded-md p-8 text-center cursor-pointer hover:border-trex-accent transition-colors"
               onClick={() => document.getElementById('payment-proof')?.click()}>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm font-medium text-gray-400">
              Click to upload or drag and drop
            </p>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, GIF up to 5MB
            </p>
            <Input
              id="payment-proof"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePaymentProofChange}
              disabled={isProcessingPayment}
            />
          </div>
        ) : (
          <div className="relative mt-2">
            <img 
              src={imagePreview} 
              alt="Payment proof" 
              className="max-h-96 rounded-md mx-auto"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => {
                setPaymentProof(null);
                setImagePreview(null);
                onFileChange(null as unknown as File);
              }}
              disabled={isProcessingPayment}
            >
              Change
            </Button>
          </div>
        )}
      </div>
      
      {paymentProof && (
        <p className="mt-2 text-sm flex items-center gap-1 text-green-500">
          <CheckCircle size={16} className="inline" />
          {paymentProof.name} ready to upload
        </p>
      )}
    </div>
  );
};

export default PaymentProofUploader;
