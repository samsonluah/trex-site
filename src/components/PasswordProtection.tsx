
import React, { useState } from 'react';
import { usePasswordProtection } from '@/context/PasswordProtectionContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PasswordProtection: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { authenticate } = usePasswordProtection();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    const isValid = authenticate(password);
    if (!isValid) {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">TREX ATHLETICS CLUB</h1>
          <p className="mt-2 text-gray-400">The dinosaurs are hibernating. Please enter the password to wake them at your own risk.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-lg text-black bg-white"
            />
            
            <Button type="submit" className="w-full">
              Enter Site
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordProtection;
