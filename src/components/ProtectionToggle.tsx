
import React, { useState } from 'react';
import { usePasswordProtection } from '@/context/PasswordProtectionContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Lock, Unlock, Settings } from 'lucide-react';

// Admin code to access the protection toggle
const ADMIN_CODE = 'admin123';

const ProtectionToggle: React.FC = () => {
  const { isProtectionEnabled, toggleProtection } = usePasswordProtection();
  const [adminCode, setAdminCode] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminDialog, setShowAdminDialog] = useState(false);

  const checkAdminCode = () => {
    if (adminCode === ADMIN_CODE) {
      setIsAdmin(true);
      setShowAdminDialog(false);
    } else {
      setAdminCode('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAdminCode();
    }
  };

  return (
    <>
      {/* Admin verification dialog */}
      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Verification</DialogTitle>
            <DialogDescription>
              Enter the admin code to access site protection settings.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Input
              type="password"
              placeholder="Enter admin code"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <Button className="w-full" onClick={checkAdminCode}>
              Verify
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Protection toggle dialog - only shown if admin is verified */}
      {isAdmin && (
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
                Admin access is always available via the admin portal
              </p>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Small admin button visible to everyone, but doesn't reveal the actual toggle functionality */}
      {!isAdmin && (
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={() => setShowAdminDialog(true)}
          className="fixed bottom-4 right-4 z-50 bg-black/70 text-white hover:bg-black/90 p-2"
        >
          <Settings className="h-4 w-4" />
        </Button>
      )}
    </>
  );
};

export default ProtectionToggle;
