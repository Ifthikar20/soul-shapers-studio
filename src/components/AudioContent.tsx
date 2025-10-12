import React, { useState } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

// Import plant images for audio thumbnails
import plant4 from '/src/assets/plant4.png';
import plant5 from '/src/assets/plant5.png';
import plant7 from '/src/assets/plant7.png';
import plant8 from '/src/assets/plant8.png';
import plant9 from '/src/assets/plant9.png';
import plant10 from '/src/assets/plant10.png';

const AudioContent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const audioSessions = [
    {
      id: 1,
      title: "Morning Meditation for Anxiety Relief",
      description: "Start your day with calm and clarity through this guided anxiety relief meditation. Perfect for those struggling with morning anxiety or racing thoughts.",
      duration: "12:30",
      expert: "Dr. Sarah Johnson",
      role: "Clinical Psychologist",
      category: "Meditation",
      image: plant4
    },
    {
      id: 2,
      title: "Deep Sleep Stories for Adults",
      description: "Calming bedtime stories designed to help adults drift into peaceful sleep. Let your mind wander through soothing narratives crafted for deep relaxation.",
      duration: "25:45",
      expert: "Dr. Emily Chen",
      role: "Sleep Specialist",
      category: "Sleep",
      image: plant5
    },
    {
      id: 3,
      title: "Breathing Techniques for Stress",
      description: "Learn powerful breathing techniques to manage stress in real-time. Evidence-based methods you can use anywhere to quickly reduce anxiety and tension.",
      duration: "8:15",
      expert: "Dr. Michael Park",
      role: "Mindfulness Coach",
      category: "Breathwork",
      image: plant7
    },
    {
      id: 4,
      title: "Self-Compassion Practice",
      description: "Cultivate kindness toward yourself with this guided self-compassion practice. Learn to treat yourself with the same care you would offer a good friend.",
      duration: "15:20",
      expert: "Dr. Lisa Rodriguez",
      role: "Licensed Therapist",
      category: "Self-Care",
      image: plant8
    },
    {
      id: 5,
      title: "Focus & Concentration Boost",
      description: "Enhance your focus and mental clarity with targeted mindfulness techniques. Scientifically-backed exercises to improve concentration and cognitive performance.",
      duration: "18:45",
      expert: "Dr. James Park",
      role: "Cognitive Specialist",
      category: "Focus",
      image: plant9
    },
    {
      id: 6,
      title: "Emotional Release & Healing",
      description: "Gentle guidance for processing and releasing stored emotional tension. A safe space to explore and release emotional blocks through mindful awareness.",
      duration: "22:15",
      expert: "Dr. Rachel Kim",
      role: "Trauma Specialist",
      category: "Healing",
      image: plant10
    }
  ];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? audioSessions.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === audioSessions.length - 1 ? 0 : prev + 1));
  };

  const currentAudio = audioSessions[currentIndex];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="mb-16">
          <p className="text-sm text-gray-500 mb-2">Audio Content</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Guided Audio Wellness Sessions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Listen to expert-guided meditation, sleep stories, and wellness practices designed to support your mental health journey.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Image with Play Button */}
          <div className="relative h-[600px] rounded-lg overflow-hidden shadow-2xl group">
            {audioSessions.map((audio, index) => (
              <div
                key={audio.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={audio.image}
                  alt={audio.title}
                  className="w-full h-full object-contain bg-white"
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="w-20 h-20 rounded-full bg-white/95 hover:bg-white transition-all shadow-2xl flex items-center justify-center group/play">
                    <Play className="w-8 h-8 text-purple-600 ml-1 fill-purple-600 group-hover/play:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            ))}

            {/* Duration Badge */}
            <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium z-10">
              {currentAudio.duration}
            </div>

            {/* Category Badge */}
            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full text-sm font-medium z-10">
              {currentAudio.category}
            </div>
          </div>

          {/* Right Side - Audio Details */}
          <div className="bg-white p-12 rounded-lg shadow-sm">
            
            {/* Audio Title */}
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {currentAudio.title}
            </h3>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {currentAudio.description}
            </p>

            {/* Divider */}
            <div className="h-px bg-gray-200 mb-8" />

            {/* Expert Info */}
            <div className="mb-8">
              <p className="text-sm text-gray-500 mb-1">Guided by</p>
              <p className="text-xl font-semibold text-gray-900">
                {currentAudio.expert}
              </p>
              <p className="text-gray-600">
                {currentAudio.role}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              {/* Progress Dots */}
              <div className="flex gap-2">
                {audioSessions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'w-8 bg-gray-900' 
                        : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to audio ${index + 1}`}
                  />
                ))}
              </div>

              {/* Arrow Navigation */}
              <div className="flex gap-2">
                <button
                  onClick={handlePrevious}
                  className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center"
                  aria-label="Previous audio"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center"
                  aria-label="Next audio"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Listen Button */}
            <button className="w-full mt-8 bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 group">
              <Play className="w-5 h-5 fill-white" />
              <span>Listen Now</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AudioContent;