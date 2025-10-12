import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

// Import watercolor backdrop image
import watercolor1 from '@/assets/watercolor-1.png';

const Hero = () => {
  const [newsletterStep, setNewsletterStep] = useState<'form' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async () => {
    if (!email) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setNewsletterStep('success');
    setIsSubmitting(false);
  };

  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      
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
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            
            {newsletterStep === 'form' ? (
              <div className="space-y-8 w-full max-w-2xl">
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                    Explore Content
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90">
                    Join our wellness community and start your transformation journey
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 h-16 px-6 rounded-full bg-white/95 backdrop-blur-sm border-2 border-white/20 focus:border-white focus:outline-none transition-all text-gray-900 placeholder:text-gray-500 text-lg"
                  />
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || !email}
                    className="h-16 px-10 rounded-full bg-white hover:bg-gray-100 text-gray-900 font-semibold transition-all flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        Get Started
                        <ArrowRight className="w-6 h-6" />
                      </>
                    )}
                  </button>
                </div>
                
                <p className="text-base text-white/80">
                  Join <strong className="text-white font-semibold">10,000+</strong> members transforming their mental health
                </p>
              </div>
            ) : (
              <div className="bg-white/95 backdrop-blur-sm p-10 rounded-3xl shadow-2xl max-w-lg">
                <div className="flex flex-col items-center gap-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-10 h-10 text-green-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">Welcome to Better & Bliss!</h3>
                    <p className="text-gray-600 text-lg">
                      Check your inbox for exclusive wellness resources and expert tips to start your journey.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* Social Proof Below */}
        <div className="flex items-center justify-center gap-6 pt-12">
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