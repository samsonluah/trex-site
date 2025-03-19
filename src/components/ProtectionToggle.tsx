
import React from 'react';
import { usePasswordProtection } from '@/context/PasswordProtectionContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Lock, Unlock } from 'lucide-react';

const ProtectionToggle: React.FC = () => {
  const { isProtectionEnabled, toggleProtection } = usePasswordProtection();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          variant="ghost" 
          className="fixed bottom-4 right-4 z-50 bg-black/70 text-white hover:bg-black/90"
        >
          {isProtectionEnabled ? <Lock className="h-4 w-4 mr-2" /> : <Unlock className="h-4 w-4 mr-2" />}
          {isProtectionEnabled ? 'Site Locked' : 'Site Unlocked'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Password Protection</DialogTitle>
          <DialogDescription>
            Toggle site password protection. When enabled, visitors will need to enter a password to access the site.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-between py-4">
          <div className="space-y-0.5">
            <h4 className="font-medium">Site Protection</h4>
            <p className="text-sm text-muted-foreground">
              {isProtectionEnabled ? 'Currently: Enabled' : 'Currently: Disabled'}
            </p>
          </div>
          <Switch 
            checked={isProtectionEnabled}
            onCheckedChange={toggleProtection}
          />
        </div>
        
        <DialogFooter>
          <p className="text-xs text-muted-foreground">
            Admin access is always available via this button
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProtectionToggle;
