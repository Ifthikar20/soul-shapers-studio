// src/pages/Index.tsx - Fixed to use new login routing
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import VideoGrid from "@/components/VideoGrid";
import Footer from "@/components/Footer";
import ServicesSection from "@/components/ServicesSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Categories />
      <ServicesSection />
      <VideoGrid />
      <Footer />
    </div>
  );
};

export default Index;