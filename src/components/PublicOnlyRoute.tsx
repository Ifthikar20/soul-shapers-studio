// src/components/PublicOnlyRoute.tsx
// Route component that only allows access when user is NOT authenticated
// Redirects authenticated users to /browse or specified redirect path

import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface PublicOnlyRouteProps {
  children: React.ReactNode;
  redirectTo?: string; // Where to redirect authenticated users (default: /browse)
}

export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({
  children,
  redirectTo = '/browse'
}) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // If authenticated, redirect to browse page or specified path
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Not authenticated - allow access to public page
  return <>{children}</>;
};
