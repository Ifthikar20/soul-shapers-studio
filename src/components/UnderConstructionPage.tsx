import React from 'react';

const SimpleUnderConstructionPage = () => {
  return (
    <div className="h-screen flex">
      
      {/* Left Side - Canvas Drawing */}
      <div className="flex-1 bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center"
          alt="Serene wellness landscape" 
          className="w-4/5 h-4/5 object-cover rounded-2xl shadow-xl"
          style={{ filter: 'saturate(0.9) contrast(1.1)' }}
        />
      </div>

      {/* Right Side - Message */}
      <div className="flex-1 bg-white flex items-center justify-center">
        <div className="text-center max-w-sm">
          
          <h1 className="text-5xl font-light mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Better & Bliss
          </h1>

          <p className="text-xl text-gray-600 mb-8 font-light">
            Wellness Experience Coming Soon
          </p>

          <p className="text-gray-500 mb-12 text-lg leading-relaxed">
            We're crafting your perfect wellness sanctuary. Something beautiful is on the way.
          </p>

          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-4 rounded-full transition-all duration-300 font-medium">
            Join the Journey with us
          </button>

        </div>
      </div>
    </div>
  );
};

export default SimpleUnderConstructionPage;