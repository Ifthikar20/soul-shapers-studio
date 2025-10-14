import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import custom logo images
import logoBrain from '/src/assets/logo-brain.png';
import logoHeart from '/src/assets/logo-heart.png';
import logoLeaf from '/src/assets/logo-leaf.png';
import logoTarget from '/src/assets/logo-target.png';

// Import watercolor images
import watercolor1 from '/src/assets/watercolor-4.png';
import watercolor2 from '/src/assets/watercolor-2.png';

const Categories = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const categories = [
    { 
      id: 1, 
      title: "Mental Health", 
      description: "Expert guidance on anxiety, depression, stress management, and emotional well-being from licensed therapists.", 
      icon: logoBrain,
      image: watercolor1,
      author: "Dr. Sarah Johnson",
      role: "Clinical Psychologist"
    },
    { 
      id: 2, 
      title: "Mindfulness & Meditation", 
      description: "Learn meditation techniques, breathing exercises, and mindful living practices to cultivate inner peace.", 
      icon: logoLeaf,
      image: watercolor2,
      author: "James Chen",
      role: "Meditation Instructor"
    },
    { 
      id: 3, 
      title: "Emotional Wellness", 
      description: "Develop emotional intelligence, build healthy relationships, and master the art of self-compassion.", 
      icon: logoHeart,
      image: watercolor1,
      author: "Dr. Emily Rodriguez",
      role: "Relationship Therapist"
    },
    { 
      id: 4, 
      title: "Breaking Habits", 
      description: "Evidence-based strategies for addiction recovery, habit formation, and sustainable behavioral change.", 
      icon: logoTarget,
      image: watercolor2,
      author: "Dr. Michael Park",
      role: "Addiction Specialist"
    }
  ];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? categories.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === categories.length - 1 ? 0 : prev + 1));
  };

  const currentCategory = categories[currentIndex];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="mb-16">
          <p className="text-sm text-gray-500 mb-2">Curated Categories</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Wellness Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Discover expert content across different mental health and wellness topics.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Testimonial Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-12 rounded-lg relative">
            {/* Category Icon */}
            <div className="mb-8">
              <img 
                src={currentCategory.icon} 
                alt={currentCategory.title}
                className="w-16 h-16 object-contain"
              />
            </div>

            {/* Quote/Description */}
            <blockquote className="mb-12">
              <p className="text-2xl md:text-3xl font-serif leading-relaxed text-gray-900 mb-8">
                "{currentCategory.description}"
              </p>
            </blockquote>

            {/* Author Info */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {currentCategory.author}
                </p>
                <p className="text-gray-500">
                  {currentCategory.role}
                </p>
              </div>

              {/* Navigation Arrows */}
              <div className="flex gap-2">
                <button
                  onClick={handlePrevious}
                  className="w-10 h-10 rounded-full bg-white hover:bg-gray-100 transition-colors flex items-center justify-center shadow-sm"
                  aria-label="Previous category"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full bg-white hover:bg-gray-100 transition-colors flex items-center justify-center shadow-sm"
                  aria-label="Next category"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Progress Dots */}
            <div className="flex gap-2 mt-8">
              {categories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'w-8 bg-gray-900' 
                      : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to category ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="relative h-[600px] rounded-lg overflow-hidden shadow-2xl">
            {categories.map((category, index) => (
              <img
                key={category.id}
                src={category.image}
                alt={category.title}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>

        </div>

        {/* Category Title Below */}
        <div className="mt-8 text-center lg:text-left">
          <h3 className="text-3xl font-bold text-gray-900 transition-opacity duration-300">
            {currentCategory.title}
          </h3>
        </div>

      </div>
    </section>
  );
};

export default Categories;