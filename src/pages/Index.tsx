// src/pages/Index.tsx - Fixed to use new login routing
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import VideoGrid from "@/components/VideoGrid";
import Footer from "@/components/Footer";
import ServicesSection from "@/components/ServicesSection";
import { NewsletterOptIn } from '@/components/newsletter/NewsletterOptIn';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
        {/* Add Newsletter Section */}
        <div className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Stay Inspired
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our newsletter for exclusive insights, expert tips, and new content alerts.
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <NewsletterOptIn source="index-hero" />
          </div>
        </div>
      </div>

      <Categories />
      <ServicesSection />
      <VideoGrid />
      <Footer />
    </div>
  );
};

export default Index;



