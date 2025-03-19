
import React, { createContext, useContext, useState, useEffect } from 'react';

type PasswordProtectionContextType = {
  isAuthenticated: boolean;
  authenticate: (password: string) => boolean;
  toggleProtection: (enabled: boolean) => void;
  isProtectionEnabled: boolean;
};

const PasswordProtectionContext = createContext<PasswordProtectionContextType | undefined>(undefined);

// The password hardcoded here - you can change it to whatever you want
const SITE_PASSWORD = 'trexclub';
const PASSWORD_ENABLED_KEY = 'password_protection_enabled';

export const PasswordProtectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isProtectionEnabled, setIsProtectionEnabled] = useState<boolean>(false);

  // Check local storage on initial load to see if protection is enabled
  useEffect(() => {
    const protectionStatus = localStorage.getItem(PASSWORD_ENABLED_KEY);
    setIsProtectionEnabled(protectionStatus === 'true');
    
    // Check if user has been authenticated in this session
    const authStatus = sessionStorage.getItem('password_authenticated');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  const authenticate = (password: string): boolean => {
    const isValid = password === SITE_PASSWORD;
    if (isValid) {
      setIsAuthenticated(true);
      sessionStorage.setItem('password_authenticated', 'true');
    }
    return isValid;
  };

  const toggleProtection = (enabled: boolean) => {
    setIsProtectionEnabled(enabled);
    localStorage.setItem(PASSWORD_ENABLED_KEY, enabled.toString());
  };

  return (
    <PasswordProtectionContext.Provider 
      value={{ 
        isAuthenticated, 
        authenticate, 
        toggleProtection, 
        isProtectionEnabled 
      }}
    >
      {children}
    </PasswordProtectionContext.Provider>
  );
};

export const usePasswordProtection = (): PasswordProtectionContextType => {
  const context = useContext(PasswordProtectionContext);
  if (context === undefined) {
    throw new Error('usePasswordProtection must be used within a PasswordProtectionProvider');
  }
  return context;
};
