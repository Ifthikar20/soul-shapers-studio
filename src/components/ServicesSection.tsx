// src/components/ServicesSection.tsx
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Brain, Heart, Users, Target, Sparkles } from "lucide-react";

const ServicesSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Image rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev === 0 ? 1 : 0));
    }, 4000); // Switch every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const services = [
    {
      number: "1",
      title: "Expert Mental Health Videos",
      description: "Access our curated library of professional content covering anxiety, depression, mindfulness, and personal growth from licensed therapists and wellness experts.",
      icon: Brain,
      color: "text-purple-400"
    },
    {
      number: "2", 
      title: "Join A Wellness Training Program",
      description: "Join a program lead by experts. Answer questions to challenge your ability. Share your Journey with others.",
      icon: Heart,
      color: "text-pink-400"
    },
    {
      number: "3",
      title: "Share your story and upvort it",
      description: "Connect with others on similar wellness journeys. Share experiences, offer support, and build meaningful connections in a safe, moderated environment.",
      icon: Users,
      color: "text-blue-400"
    },
    {
      number: "4",
      title: "Grow Your Milestone, earn wellness points",
      description: "Monitor your mental health journey with built-in progress tracking, mood logs, and achievement milestones to celebrate your growth over time.",
      icon: Target,
      color: "text-green-400"
    }
  ];

  const images = [
    "/src/assets/happydude.png",
    "/src/assets/happylady.png"
  ];

  return (
    <section className="py-20 bg-gradient-secondary relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-6 py-2 bg-gradient-card border border-primary/20 text-primary rounded-full shadow-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            What we offer
          </Badge>
          <h2 className="text-4xl md:text-4xl font-bold text-foreground mb-4">
            Your Path to{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Better Wellness
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover a comprehensive approach to mental health and personal growth with our expert-guided platform.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Services List - Left Side */}
          <div className="space-y-6">
            {services.map((service, index) => (
              <Card 
                key={service.number}
                className="relative overflow-hidden hover:shadow-hover transition-all duration-500 group cursor-pointer bg-gradient-card/80 backdrop-blur-sm border-border/30"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Number Badge */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-primary text-white font-bold text-xl flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform duration-300">
                        {service.number}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <service.icon className={`w-6 h-6 ${service.color}`} />
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {service.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                      
                      
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Image Display - Right Side */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Cloud-like background */}
            <div className="absolute inset-0 w-full h-full">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-primary/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-tl from-blue-400/10 to-primary/10 rounded-full blur-2xl animate-pulse delay-500" />
              <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-gradient-to-tr from-purple-500/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Phone/Device Frame */}
            <div className="relative z-10 bg-gradient-card/90 backdrop-blur-xl rounded-3xl p-8 shadow-glow border border-border/20 max-w-md mx-auto">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-card">
                
                {/* Animated Image Container */}
                <div className="relative h-80 w-full rounded-xl overflow-hidden bg-gradient-hero">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-1000 ${
                        currentImageIndex === index 
                          ? 'opacity-100 scale-100 rotate-0' 
                          : 'opacity-0 scale-95 rotate-2'
                      }`}
                    >
                      <img
                        src={image}
                        alt={index === 0 ? "Happy person achieving wellness goals" : "Joyful person on wellness journey"}
                        className="w-full h-full object-cover rounded-xl shadow-soft"
                      />
                    </div>
                  ))}
                  
                  {/* Overlay Content */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-soft">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-gray-800">
                          Wellness Journey Active
                        </span>
                      </div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>Daily check-in completed</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>Expert content watched</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>Community support accessed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Text */}
                <div className="mt-6 text-center">
                  <p className="text-sm font-medium text-gray-800 mb-1">
                    Join thousands on their wellness journey
                  </p>
                  <p className="text-xs text-gray-600">
                    Transform your mental health with expert guidance
                  </p>
                  
                  {/* Image indicators */}
                  <div className="flex justify-center gap-2 mt-4">
                    {images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          currentImageIndex === index 
                            ? 'bg-primary scale-125' 
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ServicesSection;