import React, { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import watercolor backdrop image
import watercolor1 from '@/assets/watercolor-1.png';

const Hero = () => {
  const navigate = useNavigate();
  const [isSwiping, setIsSwiping] = useState(false);

  const handleExploreContent = () => {
    setIsSwiping(true);
    
    // Wait for swipe animation to complete before navigating
    setTimeout(() => {
      navigate('/login');
    }, 1000); // Slightly longer for more graceful feel
  };

  return (
    <section 
      className={`relative min-h-screen bg-white overflow-hidden transition-transform ${
        isSwiping ? '-translate-x-full' : 'translate-x-0'
      }`}
      style={{
        transitionDuration: '1000ms',
        transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)', // More graceful easing
      }}
    >
      
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        
        {/* Curved Image Backdrop with Content */}
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl">
          <img 
            src={watercolor1}
            alt="Wellness journey backdrop"
            className="w-full h-[600px] object-cover"
          />
          
          {/* Dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>
          
          {/* Content Centered Inside the Backdrop */}
          <div 
            className={`absolute inset-0 flex flex-col items-center justify-center p-8 text-center transition-opacity ${
              isSwiping ? 'opacity-0' : 'opacity-100'
            }`}
            style={{
              transitionDuration: '600ms',
              transitionTimingFunction: 'ease-out',
            }}
          >
            <div className="space-y-8 w-full max-w-2xl">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                  Explore Content
                </h1>
                <p className="text-xl md:text-2xl text-white/90">
                  Join our wellness community and start your transformation journey
                </p>
              </div>
              
              {/* Explore Content Button */}
              <button 
                onClick={handleExploreContent}
                disabled={isSwiping}
                className="h-16 px-12 rounded-full bg-white hover:bg-gray-100 text-gray-900 font-semibold transition-all flex items-center justify-center gap-3 mx-auto whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg hover:scale-105 hover:shadow-2xl group"
              >
                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                Explore Content
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="text-base text-white/80">
                Join <strong className="text-white font-semibold">10,000+</strong> members transforming their mental health
              </p>
            </div>
          </div>
        </div>

        {/* Social Proof Below */}
        <div 
          className={`flex items-center justify-center gap-6 pt-12 transition-opacity ${
            isSwiping ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            transitionDuration: '500ms',
            transitionTimingFunction: 'ease-out',
          }}
        >
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-white"></div>
            ))}
          </div>
          <div className="text-sm">
            <p className="font-semibold text-gray-900">10,000+ Members</p>
            <p className="text-gray-600">Growing daily</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;