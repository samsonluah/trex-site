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
const AUTH_STATUS_KEY = 'password_authenticated';

export const PasswordProtectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isProtectionEnabled, setIsProtectionEnabled] = useState<boolean>(true); // Default to true to ensure protection

  // Check local storage on initial load to see if protection is enabled
  useEffect(() => {
    const protectionStatus = localStorage.getItem(PASSWORD_ENABLED_KEY);
    
    // If protection status is not explicitly set to false, keep it enabled
    // This ensures that new devices will have protection enabled by default
    setIsProtectionEnabled(protectionStatus !== 'false');
    
    // Check if user has been authenticated
    const authStatus = localStorage.getItem(AUTH_STATUS_KEY);
    setIsAuthenticated(authStatus === 'true');
  }, []);

  const authenticate = (password: string): boolean => {
    const isValid = password === SITE_PASSWORD;
    if (isValid) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_STATUS_KEY, 'true');
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
