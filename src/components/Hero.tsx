import { Play, ArrowRight, Sparkles, Brain, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import startdustVideo from "@/assets/startdustvid.mp4";

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Video with Curved Bottom */}
      <div className="absolute inset-0 overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)'
          }}
        >
          <source src={startdustVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-hero opacity-60"></div>
      </div>

      {/* Curved Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-[400px] h-[300px] bg-primary/8 rounded-[60%_40%_50%_50%] blur-3xl animate-pulse rotate-12"></div>
        <div className="absolute top-40 right-20 w-[500px] h-[350px] bg-purple-400/8 rounded-[40%_60%_70%_30%] blur-3xl animate-pulse delay-1000 -rotate-12"></div>
        <div className="absolute bottom-32 left-1/4 w-[350px] h-[250px] bg-primary/6 rounded-[70%_30%_40%_60%] blur-3xl animate-pulse delay-500 rotate-45"></div>
        <div className="absolute bottom-10 right-10 w-[300px] h-[200px] bg-purple-500/6 rounded-[50%_50%_60%_40%] blur-2xl animate-pulse delay-700"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <Badge className="mb-6 px-6 py-2 bg-gradient-card border border-primary/20 text-primary font-medium rounded-full shadow-soft">
            <Sparkles className="w-4 h-4 mr-2" />
            Transforming Mental Wellness
          </Badge>
          
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
            Better Mind,
            <span className="bg-gradient-primary bg-clip-text text-transparent block">
              Blissful Life
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
            Discover expert-curated content on mental health, wellness, and personal transformation. 
            Break limiting patterns and unlock your infinite potential with our futuristic learning platform.
          </p>

          <div className="flex justify-center items-center mb-16">
            <Button variant="outline" size="lg" className="min-w-[220px] h-14 text-base rounded-full">
              <Brain className="w-5 h-5 mr-3" />
              Explore Content
              <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center group">
              <div className="bg-gradient-card/80 backdrop-blur-sm rounded-3xl p-6 shadow-card hover:shadow-hover transition-smooth border border-border/20">
                <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3">1000+</div>
                <div className="text-white/70 font-medium">Expert Videos</div>
                <Heart className="w-5 h-5 text-primary mx-auto mt-2 opacity-60" />
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-card/80 backdrop-blur-sm rounded-3xl p-6 shadow-card hover:shadow-hover transition-smooth border border-border/20">
                <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3">50+</div>
                <div className="text-white/70 font-medium">Mental Health Experts</div>
                <Brain className="w-5 h-5 text-primary mx-auto mt-2 opacity-60" />
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-card/80 backdrop-blur-sm rounded-3xl p-6 shadow-card hover:shadow-hover transition-smooth border border-border/20">
                <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3">10k+</div>
                <div className="text-white/70 font-medium">Lives Transformed</div>
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