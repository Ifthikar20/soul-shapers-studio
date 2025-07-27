import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import VideoGrid from "@/components/VideoGrid";
import CaseStudies from "@/components/CaseStudies";
import Footer from "@/components/Footer";
import AuthPage from "@/components/AuthPage";

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  if (showAuth) {
    return (
      <AuthPage 
        mode={authMode} 
        onModeChange={setAuthMode}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Categories />
      <VideoGrid />
      <CaseStudies />
      <Footer />
    </div>
  );
};

export default Index;
