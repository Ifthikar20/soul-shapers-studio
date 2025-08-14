// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Import pages
import Index from "./pages/Index";
import SearchResults from "./pages/SearchResults";
import NotFound from "./pages/NotFound";
import BrowsePage from "./pages/BrowsePage";
import LoginPage from "./pages/LoginPage";
import UpgradePage from "./pages/UpgradePage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import AdminApp from "./admin/AdminApp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/upgrade" element={<UpgradePage />} />
            
            {/* Protected Routes - Requires Authentication */}
            <Route 
              path="/browse" 
              element={
                <ProtectedRoute>
                  <BrowsePage />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes - Requires Admin Role */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminApp />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all - 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;