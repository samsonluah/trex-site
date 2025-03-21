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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isProtectionEnabled, setIsProtectionEnabled] = useState<boolean>(true); // Default to true to ensure protection

  // Check local storage on initial load to see if protection is enabled and if the session is still valid
  useEffect(() => {
    const protectionStatus = localStorage.getItem(PASSWORD_ENABLED_KEY);
    
    // If protection status is not explicitly set to false, keep it enabled
    // This ensures that new devices will have protection enabled by default
    setIsProtectionEnabled(protectionStatus !== 'false');
    
    // Check if user has been authenticated and if the session is still valid
    const authStatus = localStorage.getItem(AUTH_STATUS_KEY);
    const authTimestamp = localStorage.getItem(AUTH_TIMESTAMP_KEY);
    
    if (authStatus === 'true' && authTimestamp) {
      const timestamp = parseInt(authTimestamp, 10);
      const currentTime = Date.now();
      
      // If the session has not expired, keep the user authenticated
      if (currentTime - timestamp < SESSION_TIMEOUT) {
        setIsAuthenticated(true);
        
        // Update the timestamp to extend the session
        localStorage.setItem(AUTH_TIMESTAMP_KEY, currentTime.toString());
      } else {
        // Session expired, remove authentication
        localStorage.removeItem(AUTH_STATUS_KEY);
        localStorage.removeItem(AUTH_TIMESTAMP_KEY);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Set up interval to check session timeout
  useEffect(() => {
    const checkSessionTimeout = () => {
      const authTimestamp = localStorage.getItem(AUTH_TIMESTAMP_KEY);
      
      if (authTimestamp) {
        const timestamp = parseInt(authTimestamp, 10);
        const currentTime = Date.now();
        
        if (currentTime - timestamp >= SESSION_TIMEOUT) {
          // Session expired
          localStorage.removeItem(AUTH_STATUS_KEY);
          localStorage.removeItem(AUTH_TIMESTAMP_KEY);
          setIsAuthenticated(false);
        }
      }
    };
    
    // Check every minute
    const interval = setInterval(checkSessionTimeout, 60 * 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  const authenticate = (password: string): boolean => {
    const isValid = password === SITE_PASSWORD;
    if (isValid) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_STATUS_KEY, 'true');
      localStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
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
