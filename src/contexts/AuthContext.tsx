// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import { useToast } from '@/hooks/use-toast';

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

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
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