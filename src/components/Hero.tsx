import { Play, ArrowRight, Sparkles, Brain, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-futuristic.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-primary/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <Badge className="mb-6 px-6 py-2 bg-gradient-card border border-primary/20 text-primary font-medium rounded-full shadow-soft">
            <Sparkles className="w-4 h-4 mr-2" />
            Transforming Mental Wellness
          </Badge>
          
          <h1 className="text-6xl md:text-8xl font-bold text-foreground mb-8 leading-tight">
            Better Mind,
            <span className="bg-gradient-primary bg-clip-text text-transparent block">
              Blissful Life
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Discover expert-curated content on mental health, wellness, and personal transformation. 
            Break limiting patterns and unlock your infinite potential with our futuristic learning platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button variant="futuristic" size="lg" className="min-w-[220px] h-14 text-base rounded-full">
              <Play className="w-5 h-5 mr-3" />
              Start Your Journey
            </Button>
            <Button variant="outline" size="lg" className="min-w-[220px] h-14 text-base rounded-full">
              <Brain className="w-5 h-5 mr-3" />
              Explore Content
              <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center group">
              <div className="bg-gradient-card rounded-3xl p-6 shadow-card hover:shadow-hover transition-smooth border border-border/20">
                <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3">1000+</div>
                <div className="text-muted-foreground font-medium">Expert Videos</div>
                <Heart className="w-5 h-5 text-primary mx-auto mt-2 opacity-60" />
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-card rounded-3xl p-6 shadow-card hover:shadow-hover transition-smooth border border-border/20">
                <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3">50+</div>
                <div className="text-muted-foreground font-medium">Mental Health Experts</div>
                <Brain className="w-5 h-5 text-primary mx-auto mt-2 opacity-60" />
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-card rounded-3xl p-6 shadow-card hover:shadow-hover transition-smooth border border-border/20">
                <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3">10k+</div>
                <div className="text-muted-foreground font-medium">Lives Transformed</div>
                <Sparkles className="w-5 h-5 text-primary mx-auto mt-2 opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;