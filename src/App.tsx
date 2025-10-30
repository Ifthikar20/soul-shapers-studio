// src/App.tsx - With protected search route and watch page
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

// Only import components that are absolutely necessary for ALL modes
import NewsletterOnlyPage from "./pages/NewsletterOnlyPage";

// Lazy load ALL other components to prevent unnecessary loading
const AuthProvider = lazy(() => import("@/contexts/AuthContext").then(module => ({ default: module.AuthProvider })));
const ProtectedRoute = lazy(() => import("@/components/ProtectedRoute").then(module => ({ default: module.ProtectedRoute })));
const PublicOnlyRoute = lazy(() => import("@/components/PublicOnlyRoute").then(module => ({ default: module.PublicOnlyRoute })));

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const NotFound = lazy(() => import("./pages/NotFound"));
const BrowsePage = lazy(() => import("./pages/BrowsePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const UpgradePage = lazy(() => import("./pages/UpgradePage"));
const UnauthorizedPage = lazy(() => import("./pages/UnauthorizedPage"));
const BlogLandingPage = lazy(() => import('./pages/blog/BlogLandingPage'));
const BlogPostPage = lazy(() => import('./pages/blog/BlogPostPage'));
const BlogCategoryPage = lazy(() => import('./pages/blog/BlogCategoryPage'));
const AudioPage = lazy(() => import("./pages/AudioPage"));
const SingleAudioPage = lazy(() => import("./pages/SingleAudioPage"));
const WatchPage = lazy(() => import("./pages/WatchPage")); // ✅ NEW: Watch page
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const SupportPage = lazy(() => import("./pages/SupportPage"));

// Lazy load components
const UnderConstructionPage = lazy(() => import("./components/UnderConstructionPage"));

const queryClient = new QueryClient();

// Loading component for Suspense
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const App = () => {
  // Check environment variables for different modes
  const isConstructionMode = import.meta.env.VITE_CONSTRUCTION_MODE === 'true';
  const isNewsletterOnlyMode = import.meta.env.VITE_NEWSLETTER_ONLY_MODE === 'true';

  console.log('App Mode:', {
    newsletterOnlyMode: isNewsletterOnlyMode,
    constructionMode: isConstructionMode,
  });

  // Newsletter-only mode - completely isolated, no routing needed
  if (isNewsletterOnlyMode) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <NewsletterOnlyPage />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Construction mode - minimal routing
  if (isConstructionMode) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="*" element={<UnderConstructionPage />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Normal application mode - full routing with lazy loading
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <AuthProvider>
              <Routes>
                {/* Landing Page - Public Only (redirects authenticated users to /browse) */}
                <Route
                  path="/"
                  element={
                    <PublicOnlyRoute>
                      <Index />
                    </PublicOnlyRoute>
                  }
                />

                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="/upgrade" element={<UpgradePage />} />
                <Route path="/upgrade/:upgradeId" element={<UpgradePage />} />

                {/* Blog Routes - Public */}
                <Route path="/blog" element={<BlogLandingPage />} />
                <Route path="/blog/post/:slug" element={<BlogPostPage />} />
                <Route path="/blog/category/:category" element={<BlogCategoryPage />} />

                {/* PROTECTED: Audio Routes - Requires Authentication */}
                <Route
                  path="/audio"
                  element={
                    <ProtectedRoute>
                      <AudioPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/audio/:id"
                  element={
                    <ProtectedRoute>
                      <SingleAudioPage />
                    </ProtectedRoute>
                  }
                />

                {/* PROTECTED: Watch Route - Requires Authentication */}
                <Route
                  path="/watch/:id"
                  element={
                    <ProtectedRoute>
                      <WatchPage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Routes - Requires Authentication */}
                <Route
                  path="/browse"
                  element={
                    <ProtectedRoute>
                      <BrowsePage />
                    </ProtectedRoute>
                  }
                />

                {/* PROTECTED: Search Route - Requires Authentication */}
                <Route
                  path="/search"
                  element={
                    <ProtectedRoute>
                      <SearchResults />
                    </ProtectedRoute>
                  }
                />

                {/* Catch all - 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;