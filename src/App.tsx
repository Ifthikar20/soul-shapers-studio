// src/App.tsx - Updated with Newsletter Mode Support
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
import CommunityPage from "./pages/CommunityPage";
import BlogLandingPage from './pages/blog/BlogLandingPage';
import BlogPostPage from './pages/blog/BlogPostPage';
import BlogCategoryPage from './pages/blog/BlogCategoryPage';

// Import components
import UnderConstructionPage from "./components/UnderConstructionPage";
import NewsletterOnlyPage from "./pages/NewsletterOnlyPage";

const queryClient = new QueryClient();

const App = () => {
  // Check environment variables for different modes
  const isConstructionMode = import.meta.env.VITE_CONSTRUCTION_MODE === 'true';
  const isNewsletterOnlyMode = import.meta.env.VITE_NEWSLETTER_ONLY_MODE === 'true';

  console.log('App Mode:', {
    newsletterOnlyMode: isNewsletterOnlyMode,
    constructionMode: isConstructionMode,
  });

  // Newsletter-only mode - show only newsletter signup
  if (isNewsletterOnlyMode) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="*" element={<NewsletterOnlyPage />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Construction mode - show construction page
  if (isConstructionMode) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="*" element={<UnderConstructionPage />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Normal application mode
  return (
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
              <Route path="/upgrade/:upgradeId" element={<UpgradePage />} />
              
              {/* Blog Routes */}
              <Route path="/blog" element={<BlogLandingPage />} />
              <Route path="/blog/post/:slug" element={<BlogPostPage />} />
              <Route path="/blog/category/:category" element={<BlogCategoryPage />} />

              {/* Protected Routes - Requires Authentication */}
              <Route
                path="/browse"
                element={
                  <ProtectedRoute>
                    <BrowsePage />
                  </ProtectedRoute>
                }
              />

              {/* Community Route */}
              <Route path="/community" element={<CommunityPage />} />

              {/* Catch all - 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;