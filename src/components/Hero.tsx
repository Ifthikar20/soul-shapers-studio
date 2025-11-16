import React, { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { analyticsService } from "@/services/analytics.service";

// Import watercolor backdrop image
import watercolor1 from '@/assets/watercolor-1.png';

const Hero = () => {
  const navigate = useNavigate();
  const [isSwiping, setIsSwiping] = useState(false);
  const [totalViews, setTotalViews] = useState<number>(15000); // Default fallback
  const [isLoadingViews, setIsLoadingViews] = useState(true);

  // Fetch total video views on component mount
  useEffect(() => {
    const fetchTotalViews = async () => {
      try {
        const views = await analyticsService.getTotalVideoViews();
        setTotalViews(views);
      } catch (error) {
        console.error('Failed to fetch total views:', error);
        // Keep default fallback value
      } finally {
        setIsLoadingViews(false);
      }
    };

    fetchTotalViews();
  }, []);

  // Format number with commas (e.g., 15,234)
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
  };

  const handleExploreContent = () => {
    setIsSwiping(true);

    // Wait for swipe animation to complete before navigating
    setTimeout(() => {
      navigate('/login');
    }, 1000); // Slightly longer for more graceful feel
  };

  return (
    <section
      className={`relative min-h-screen bg-white overflow-visible transition-transform ${
        isSwiping ? '-translate-x-full' : 'translate-x-0'
      }`}
      style={{
        transitionDuration: '1000ms',
        transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)', // More graceful easing
      }}
    >

      <div className="max-w-6xl mx-auto px-6 pt-12 pb-20 md:pt-16 md:pb-32">

        {/* Floating Capsule - Curved Image Backdrop with Content */}
        <div className="relative rounded-[3rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
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
              
              <div className="flex items-center justify-center gap-2 text-base text-white/90">
                <Eye className="w-5 h-5" />
                <span>
                  <strong className="text-white font-semibold">
                    {isLoadingViews ? '...' : formatNumber(totalViews)}+
                  </strong>{' '}
                  Total video views
                </span>
              </div>
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
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <div className="text-sm">
            <p className="font-semibold text-gray-900">
              {isLoadingViews ? 'Loading...' : `${formatNumber(totalViews)}+`} Total views
            </p>
            <p className="text-gray-600">And growing every day</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;