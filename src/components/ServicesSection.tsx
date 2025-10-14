import React, { useState } from 'react';

// Import watercolor images
import watercolor1 from '/src/assets/watercolor-0.png';
import watercolor2 from '/src/assets/watercolor-5.png';
import watercolor6 from '/src/assets/watercolor-6.png';

const ServicesSection = () => {
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      title: "Expert Mental Health Videos",
      description: "Access our curated library of professional content covering anxiety, depression, mindfulness, and personal growth from licensed therapists and wellness experts.",
      image: watercolor1
    },
    {
      title: "Join A Wellness Training Program",
      description: "Join a program led by experts. Answer questions to challenge your ability. Share your journey with others.",
      image: watercolor2
    },
    {
      title: "Share your story and upvote it",
      description: "Connect with others on similar wellness journeys. Share experiences, offer support, and build meaningful connections in a safe, moderated environment.",
      image: watercolor6
    },
    {
      title: "Grow Your Milestone, earn wellness points",
      description: "Monitor your mental health journey with built-in progress tracking, mood logs, and achievement milestones to celebrate your growth over time.",
      image: watercolor2
    }
  ];

  return (
    <section className="py-32 bg-gray-50">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="mb-20">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Your Path to Better Wellness
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl">
            Discover a comprehensive approach to mental health and personal growth with our expert-guided platform.
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Side - Service List */}
          <div className="space-y-0">
            {services.map((service, index) => {
              const isActive = activeService === index;
              
              return (
                <div key={index}>
                  <div
                    onClick={() => setActiveService(index)}
                    className={`
                      py-8 cursor-pointer transition-all duration-300
                      ${isActive ? '' : 'opacity-50 hover:opacity-75'}
                    `}
                  >
                    <h3 className={`
                      text-2xl font-semibold mb-3 transition-colors duration-300
                      ${isActive ? 'text-gray-900' : 'text-gray-700'}
                    `}>
                      {service.title}
                    </h3>
                    
                    <p className={`
                      text-base leading-relaxed transition-colors duration-300
                      ${isActive ? 'text-gray-600' : 'text-gray-500'}
                    `}>
                      {service.description}
                    </p>
                  </div>
                  
                  {/* Divider line - except for last item */}
                  {index < services.length - 1 && (
                    <div className="h-px bg-gray-200" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Side - Image Display */}
          <div className="lg:sticky lg:top-8">
            <div className="relative overflow-hidden rounded-lg shadow-xl bg-white">
              {services.map((service, index) => (
                <img
                  key={index}
                  src={service.image}
                  alt={service.title}
                  className={`
                    w-full h-auto object-cover transition-opacity duration-500
                    ${activeService === index ? 'opacity-100' : 'opacity-0 absolute inset-0'}
                  `}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ServicesSection;