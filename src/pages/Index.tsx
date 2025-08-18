import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import VideoGrid from "@/components/VideoGrid";
import Footer from "@/components/Footer";
import AuthPage from "@/components/AuthPage";
import SearchResults from "./SearchResults";

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const handleShowAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  if (showAuth) {
    return (
      <AuthPage 
        mode={authMode} 
        onModeChange={setAuthMode}
        onBack={() => setShowAuth(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onShowAuth={handleShowAuth} />
      <Hero />
      <Categories />
      <VideoGrid />
      <Footer />
    </div>
  );
};

export default Index;
