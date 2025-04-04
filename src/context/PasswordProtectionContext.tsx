
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
const AUTH_TIMESTAMP_KEY = 'password_auth_timestamp';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

export const PasswordProtectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Set isAuthenticated to true by default to bypass the password check
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  // Set isProtectionEnabled to false by default to disable the password protection
  const [isProtectionEnabled, setIsProtectionEnabled] = useState<boolean>(false);

  // Still include the localStorage check for consistency, but it won't enable protection
  useEffect(() => {
    // Force isProtectionEnabled to false regardless of localStorage
    setIsProtectionEnabled(false);
    // Force authentication to true
    setIsAuthenticated(true);
    // Clear any existing localStorage values related to password protection
    localStorage.removeItem(PASSWORD_ENABLED_KEY);
    localStorage.removeItem(AUTH_STATUS_KEY);
    localStorage.removeItem(AUTH_TIMESTAMP_KEY);
  }, []);

  const authenticate = (password: string): boolean => {
    // Always return true to bypass the password check
    setIsAuthenticated(true);
    return true;
  };

  const toggleProtection = (enabled: boolean) => {
    // Always set to false regardless of the passed value
    setIsProtectionEnabled(false);
    localStorage.setItem(PASSWORD_ENABLED_KEY, 'false');
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
