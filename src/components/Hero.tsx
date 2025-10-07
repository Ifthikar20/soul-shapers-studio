import React, { useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";

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

  // Plant images in a grid/tile layout
  const plantImages = [
    "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80", // Monstera
    "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80", // Ferns
    "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400&q=80", // Palm
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400&q=80", // Snake plant
    "https://images.unsplash.com/photo-1509937528035-ad76254b0356?w=400&q=80", // Indoor plants
    "https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=400&q=80", // Botanical
  ];

  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-white to-purple-50/20"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full border border-purple-100">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Curated Wellness Journey</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-purple-900 via-purple-700 to-purple-600 bg-clip-text text-transparent">
                  Better Tribe,
                </span>
                <br />
                <span className="text-gray-900">Better Mind</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-xl">
                Discover expert-curated content on mental health, wellness, and personal transformation. 
                Break limiting patterns and unlock your infinite potential.
              </p>
            </div>

            {/* Newsletter Form */}
            {newsletterStep === 'form' ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full h-14 px-5 rounded-2xl bg-white border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-all shadow-sm text-gray-900 placeholder:text-gray-500"
                    />
                  </div>
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || !email}
                    className="h-14 px-8 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        Subscribe
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  Join <strong>10,000+</strong> transforming their mental health. 
                  <span className="text-purple-700 font-medium ml-1">Free resources, no spam.</span>
                </p>
              </div>
            ) : (
              <div className="space-y-4 p-6 bg-green-50 rounded-2xl border border-green-200">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome to the community!</h3>
                  <p className="text-gray-700">
                    Check your inbox for exclusive wellness resources and expert tips.
                  </p>
                </div>
              </div>
            )}

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-semibold text-gray-900">10,000+ Members</p>
                <p className="text-gray-600">Growing daily</p>
              </div>
            </div>
          </div>

          {/* Right Column - Plant Image Grid with Fade */}
          <div className="relative order-1 lg:order-2 h-[600px]">
            {/* Grid of plant images with staggered layout */}
            <div className="grid grid-cols-3 gap-3 h-full">
              {plantImages.map((image, index) => {
                // Calculate vertical offset: right tiles are higher than left tiles
                const col = index % 3;
                const offsetY = col * 40; // Each column to the right is 40px higher
                
                return (
                  <div 
                    key={index}
                    className="relative rounded-2xl overflow-hidden bg-gray-100"
                    style={{
                      transform: `translateY(-${offsetY}px)`
                    }}
                  >
                    <img 
                      src={image}
                      alt={`Plant ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })}
            </div>

            {/* Purple gradient fade overlay on the right side */}
            <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-purple-100/80 via-purple-50/40 to-transparent pointer-events-none"></div>
            
            {/* Bottom fade for smooth transition */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/60 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;