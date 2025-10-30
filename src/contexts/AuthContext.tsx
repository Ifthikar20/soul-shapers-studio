// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { authService } from '@/services/auth.service';
import { useToast } from '@/hooks/use-toast';
import { logAuthEvent, clearSensitiveData } from '@/utils/auth.security';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'free_user' | 'premium_user' | 'admin';
  subscription_tier: 'free' | 'basic' | 'premium';
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  checkPermission: (permission: string) => boolean;
  canAccessContent: (contentTier: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Separate the Provider component
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Session timeout configuration (30 minutes of inactivity)
  const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
  const ACTIVITY_CHECK_INTERVAL_MS = 60 * 1000; // Check every minute

  // Use useCallback to prevent recreation on every render
  const checkAuthStatus = useCallback(async () => {
    if (isInitialized) return; // Prevent multiple calls
    
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      // Don't log error for expected 401s when not logged in
      setUser(null);
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // THIS WAS MISSING - Call checkAuthStatus on component mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Set up token refresh
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      authService.refreshToken().catch(console.error);
    }, 14 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials", // Fixed: use error.message instead of error.response?.data?.detail
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const register = useCallback(async (email: string, password: string, fullName: string) => {
    try {
      const response = await authService.register(email, password, fullName);
      setUser(response.user);
      toast({
        title: "Welcome to Better & Bliss!",
        description: "Your account has been created successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Could not create account", // Fixed: use error.message instead of error.response?.data?.detail
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  // Handle session expiry
  const handleSessionExpiry = useCallback(async () => {
    logAuthEvent('SESSION_EXPIRED', { reason: 'Inactivity timeout' });

    // Clear session timeout
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
      sessionTimeoutRef.current = null;
    }

    // Clear user state
    setUser(null);
    setIsInitialized(false);

    // Clear sensitive data
    clearSensitiveData();

    // Show notification
    toast({
      title: "Session Expired",
      description: "Your session has expired due to inactivity. Please log in again.",
      variant: "destructive",
    });

    // Call backend logout
    try {
      await authService.logout();
    } catch (error) {
      console.error('Session expiry logout failed:', error);
    }
  }, [toast]);

  // Reset session timeout on user activity
  const resetSessionTimeout = useCallback(() => {
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }

    // Set new timeout
    sessionTimeoutRef.current = setTimeout(() => {
      if (user) {
        handleSessionExpiry();
      }
    }, SESSION_TIMEOUT_MS);
  }, [user, SESSION_TIMEOUT_MS, handleSessionExpiry]);

  // Track user activity
  useEffect(() => {
    if (!user) return;

    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];

    const handleActivity = () => {
      resetSessionTimeout();
    };

    // Add activity listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Start session timeout
    resetSessionTimeout();

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });

      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
    };
  }, [user, resetSessionTimeout]);

  const logout = useCallback(async () => {
    try {
      // Call backend logout to clear session/cookies
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      logAuthEvent('LOGOUT', { error: 'Logout failed', details: error });
      // Continue with logout even if backend call fails
    } finally {
      // Clear session timeout
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
        sessionTimeoutRef.current = null;
      }

      // Always clear user state regardless of backend response
      setUser(null);
      setIsInitialized(false); // Reset initialization state

      // Clear sensitive data
      clearSensitiveData();

      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
    }
  }, [toast]);

  const checkPermission = useCallback((permission: string): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.permissions?.includes(permission) || false;
  }, [user]);

  const canAccessContent = useCallback((contentTier: string): boolean => {
    if (!user) return contentTier === 'free';
    
    const tierHierarchy: Record<string, number> = {
      'free': 0,
      'basic': 1,
      'premium': 2
    };
    
    return tierHierarchy[user.subscription_tier] >= tierHierarchy[contentTier];
  }, [user]);

  const value = React.useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      checkPermission,
      canAccessContent
    }),
    [user, loading, login, register, logout, checkPermission, canAccessContent]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Separate the hook
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Export them separately to fix HMR
export { AuthProvider, useAuth };