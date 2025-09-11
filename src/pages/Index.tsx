// src/pages/Index.tsx - Fixed to use new login routing
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import VideoGrid from "@/components/VideoGrid";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Categories />
      <VideoGrid />
      <Footer />
    </div>
  );
};

export default Index;