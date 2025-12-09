// src/pages/Index.tsx - Fixed to use new login routing
import Header from "@/components/Header";
import Hero from "@/components/Hero";
// import VideoGrid from "@/components/VideoGrid";
import Footer from "@/components/Footer";
import ServicesSection from "@/components/ServicesSection";
import BeginJourneySection from "@/components/BeginJourneySection";
import AudioComponent from "@/components/AudioComponent";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ServicesSection />
      <BeginJourneySection />
      {/* <VideoGrid /> */}
      <AudioComponent />
      <Footer />
    </div>
  );
};

export default Index;



