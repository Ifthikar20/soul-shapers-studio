import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/Layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, X, ChevronLeft, ChevronRight } from 'lucide-react';

// Import videos
import waterflowVideo from '@/assets/waterflow-meditate.mp4';
import autumnLeavesVideo from '@/assets/autumn-leaves-meditate.mp4';
import autumnWindVideo from '@/assets/autumn-wind-meditate.mp4';

// Import images
import waterfallImage from '@/assets/waterfall-meditate-img.jpg';
import autumnLeavesImage from '@/assets/autumn-leaves-meditate.jpg';
import autumnWindImage from '@/assets/autumn-wind-img.jpg';

interface MeditationExperience {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  imageUrl: string;
  category: string;
  type: 'Sound' | 'Guided';
}

const MeditatePage: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [selectedSound, setSelectedSound] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [isMuted, setIsMuted] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Quotes for each meditation experience
  const experienceQuotes: Record<string, string[]> = {
    'waterflow': [
      "Water is the driving force of all nature.",
      "In one drop of water are found all the secrets of all the oceans.",
      "A river cuts through rock not because of its power, but because of its persistence.",
      "Nothing is softer or more flexible than water, yet nothing can resist it.",
      "Water does not resist. Water flows.",
      "Be like water making its way through cracks.",
      "The cure for anything is salt water: sweat, tears, or the sea.",
      "Still waters run deep.",
    ],
    'default': [
      "Peace comes from within. Do not seek it without.",
      "The present moment is the only time over which we have dominion.",
      "Meditation is not evasion; it is a serene encounter with reality.",
      "In the midst of movement and chaos, keep stillness inside of you.",
      "Quiet the mind and the soul will speak.",
      "Meditation brings wisdom; lack of meditation leaves ignorance.",
      "The thing about meditation is: You become more and more you.",
      "Wherever you are, be there totally.",
    ],
  };

  // Get quotes for the selected experience, or default
  const currentQuotes = selectedSound ? (experienceQuotes[selectedSound] || experienceQuotes['default']) : experienceQuotes['default'];

  const meditationExperiences: MeditationExperience[] = [
    // Sounds of Nature
    { id: 'waterflow', title: 'Waterfall Meditation', description: 'Gentle cascade of water', videoUrl: waterflowVideo, imageUrl: waterfallImage, category: 'Sounds of Nature', type: 'Sound' },
    { id: 'ocean-waves', title: 'Ocean Waves', description: 'Rhythmic peace of ocean', videoUrl: autumnLeavesVideo, imageUrl: autumnLeavesImage, category: 'Sounds of Nature', type: 'Sound' },
    { id: 'rain-forest', title: 'Rain Forest', description: 'Tropical rainforest sounds', videoUrl: autumnWindVideo, imageUrl: autumnWindImage, category: 'Sounds of Nature', type: 'Sound' },
    { id: 'mountain-stream', title: 'Mountain Stream', description: 'Gentle mountain flow', videoUrl: waterflowVideo, imageUrl: waterfallImage, category: 'Sounds of Nature', type: 'Sound' },
    { id: 'thunder-rain', title: 'Thunder & Rain', description: 'Powerful storm ambience', videoUrl: autumnLeavesVideo, imageUrl: autumnLeavesImage, category: 'Sounds of Nature', type: 'Sound' },
    { id: 'bird-songs', title: 'Morning Birds', description: 'Peaceful bird chirping', videoUrl: autumnWindVideo, imageUrl: autumnWindImage, category: 'Sounds of Nature', type: 'Sound' },

    // Seasonal Meditations
    { id: 'autumn-leaves', title: 'Autumn Leaves', description: 'Leaves dancing in breeze', videoUrl: autumnLeavesVideo, imageUrl: autumnLeavesImage, category: 'Seasonal Meditations', type: 'Sound' },
    { id: 'autumn-wind', title: 'Autumn Wind', description: 'Crisp autumn air', videoUrl: autumnWindVideo, imageUrl: autumnWindImage, category: 'Seasonal Meditations', type: 'Sound' },
    { id: 'winter-snow', title: 'Winter Snowfall', description: 'Peaceful falling snow', videoUrl: waterflowVideo, imageUrl: waterfallImage, category: 'Seasonal Meditations', type: 'Sound' },
    { id: 'spring-garden', title: 'Spring Garden', description: 'Blooming flowers', videoUrl: autumnLeavesVideo, imageUrl: autumnLeavesImage, category: 'Seasonal Meditations', type: 'Sound' },
    { id: 'summer-meadow', title: 'Summer Meadow', description: 'Warm sunny fields', videoUrl: autumnWindVideo, imageUrl: autumnWindImage, category: 'Seasonal Meditations', type: 'Sound' },

    // Guided Meditation for Professionals
    { id: 'focus-boost', title: 'Focus Boost', description: 'Enhance concentration', videoUrl: waterflowVideo, imageUrl: waterfallImage, category: 'Guided Meditation for Professionals', type: 'Guided' },
    { id: 'stress-release', title: 'Stress Release', description: 'Let go of tension', videoUrl: autumnLeavesVideo, imageUrl: autumnLeavesImage, category: 'Guided Meditation for Professionals', type: 'Guided' },
    { id: 'decision-clarity', title: 'Decision Clarity', description: 'Clear mind guidance', videoUrl: autumnWindVideo, imageUrl: autumnWindImage, category: 'Guided Meditation for Professionals', type: 'Guided' },
    { id: 'leadership-mindset', title: 'Leadership Mindset', description: 'Executive presence', videoUrl: waterflowVideo, imageUrl: waterfallImage, category: 'Guided Meditation for Professionals', type: 'Guided' },
    { id: 'creativity-flow', title: 'Creativity Flow', description: 'Unlock innovation', videoUrl: autumnLeavesVideo, imageUrl: autumnLeavesImage, category: 'Guided Meditation for Professionals', type: 'Guided' },
    { id: 'work-life-balance', title: 'Work-Life Balance', description: 'Find equilibrium', videoUrl: autumnWindVideo, imageUrl: autumnWindImage, category: 'Guided Meditation for Professionals', type: 'Guided' },

    // Sleep & Relaxation
    { id: 'deep-sleep', title: 'Deep Sleep', description: 'Drift into slumber', videoUrl: waterflowVideo, imageUrl: waterfallImage, category: 'Sleep & Relaxation', type: 'Guided' },
    { id: 'insomnia-relief', title: 'Insomnia Relief', description: 'Overcome sleeplessness', videoUrl: autumnLeavesVideo, imageUrl: autumnLeavesImage, category: 'Sleep & Relaxation', type: 'Guided' },
    { id: 'bedtime-story', title: 'Bedtime Journey', description: 'Guided sleep story', videoUrl: autumnWindVideo, imageUrl: autumnWindImage, category: 'Sleep & Relaxation', type: 'Guided' },
    { id: 'power-nap', title: 'Power Nap', description: '20-minute refresh', videoUrl: waterflowVideo, imageUrl: waterfallImage, category: 'Sleep & Relaxation', type: 'Guided' },
    { id: 'evening-unwind', title: 'Evening Unwind', description: 'Release the day', videoUrl: autumnLeavesVideo, imageUrl: autumnLeavesImage, category: 'Sleep & Relaxation', type: 'Guided' },

    // Focus & Concentration
    { id: 'study-focus', title: 'Study Focus', description: 'Academic concentration', videoUrl: autumnWindVideo, imageUrl: autumnWindImage, category: 'Focus & Concentration', type: 'Guided' },
    { id: 'work-productivity', title: 'Work Productivity', description: 'Peak performance', videoUrl: waterflowVideo, imageUrl: waterfallImage, category: 'Focus & Concentration', type: 'Guided' },
    { id: 'exam-preparation', title: 'Exam Preparation', description: 'Calm test anxiety', videoUrl: autumnLeavesVideo, imageUrl: autumnLeavesImage, category: 'Focus & Concentration', type: 'Guided' },
    { id: 'deep-work', title: 'Deep Work', description: 'Eliminate distractions', videoUrl: autumnWindVideo, imageUrl: autumnWindImage, category: 'Focus & Concentration', type: 'Guided' },
    { id: 'memory-boost', title: 'Memory Boost', description: 'Enhance recall', videoUrl: waterflowVideo, imageUrl: waterfallImage, category: 'Focus & Concentration', type: 'Guided' },

    // Stress Relief
    { id: 'anxiety-calm', title: 'Anxiety Calm', description: 'Soothe worried mind', videoUrl: autumnLeavesVideo, imageUrl: autumnLeavesImage, category: 'Stress Relief', type: 'Guided' },
    { id: 'panic-relief', title: 'Panic Relief', description: 'Ground yourself', videoUrl: autumnWindVideo, imageUrl: autumnWindImage, category: 'Stress Relief', type: 'Guided' },
    { id: 'tension-release', title: 'Tension Release', description: 'Body scan relaxation', videoUrl: waterflowVideo, imageUrl: waterfallImage, category: 'Stress Relief', type: 'Guided' },
    { id: 'overwhelm-support', title: 'Overwhelm Support', description: 'Find your center', videoUrl: autumnLeavesVideo, imageUrl: autumnLeavesImage, category: 'Stress Relief', type: 'Guided' },
    { id: 'burnout-recovery', title: 'Burnout Recovery', description: 'Restore energy', videoUrl: autumnWindVideo, imageUrl: autumnWindImage, category: 'Stress Relief', type: 'Guided' },

    // Morning Meditations
    { id: 'morning-energy', title: 'Morning Energy', description: 'Start day right', videoUrl: waterflowVideo, imageUrl: waterfallImage, category: 'Morning Meditations', type: 'Guided' },
    { id: 'gratitude-practice', title: 'Gratitude Practice', description: 'Count blessings', videoUrl: autumnLeavesVideo, imageUrl: autumnLeavesImage, category: 'Morning Meditations', type: 'Guided' },
    { id: 'intention-setting', title: 'Intention Setting', description: 'Define your day', videoUrl: autumnWindVideo, imageUrl: autumnWindImage, category: 'Morning Meditations', type: 'Guided' },
    { id: 'sunrise-meditation', title: 'Sunrise Meditation', description: 'Greet the dawn', videoUrl: waterflowVideo, imageUrl: waterfallImage, category: 'Morning Meditations', type: 'Guided' },
    { id: 'positive-affirmations', title: 'Positive Affirmations', description: 'Build confidence', videoUrl: autumnLeavesVideo, imageUrl: autumnLeavesImage, category: 'Morning Meditations', type: 'Guided' },

    // Evening Wind Down
    { id: 'sunset-reflection', title: 'Sunset Reflection', description: 'Day\'s end peace', videoUrl: autumnWindVideo, imageUrl: autumnWindImage, category: 'Evening Wind Down', type: 'Guided' },
    { id: 'gratitude-evening', title: 'Evening Gratitude', description: 'Reflect with thanks', videoUrl: waterflowVideo, imageUrl: waterfallImage, category: 'Evening Wind Down', type: 'Guided' },
    { id: 'letting-go', title: 'Letting Go', description: 'Release the day', videoUrl: autumnLeavesVideo, imageUrl: autumnLeavesImage, category: 'Evening Wind Down', type: 'Guided' },
    { id: 'night-peace', title: 'Night Peace', description: 'Prepare for rest', videoUrl: autumnWindVideo, imageUrl: autumnWindImage, category: 'Evening Wind Down', type: 'Guided' },

    // Mindfulness Practice
    { id: 'present-moment', title: 'Present Moment', description: 'Be here now', videoUrl: waterflowVideo, imageUrl: waterfallImage, category: 'Mindfulness Practice', type: 'Guided' },
    { id: 'body-awareness', title: 'Body Awareness', description: 'Connect with self', videoUrl: autumnLeavesVideo, imageUrl: autumnLeavesImage, category: 'Mindfulness Practice', type: 'Guided' },
    { id: 'mindful-eating', title: 'Mindful Eating', description: 'Savor each bite', videoUrl: autumnWindVideo, imageUrl: autumnWindImage, category: 'Mindfulness Practice', type: 'Guided' },
    { id: 'walking-meditation', title: 'Walking Meditation', description: 'Mindful movement', videoUrl: waterflowVideo, imageUrl: waterfallImage, category: 'Mindfulness Practice', type: 'Guided' },

    // Breathing Exercises
    { id: 'box-breathing', title: 'Box Breathing', description: '4-4-4-4 technique', videoUrl: autumnLeavesVideo, imageUrl: autumnLeavesImage, category: 'Breathing Exercises', type: 'Guided' },
    { id: '478-breathing', title: '4-7-8 Breathing', description: 'Rapid relaxation', videoUrl: autumnWindVideo, imageUrl: autumnWindImage, category: 'Breathing Exercises', type: 'Guided' },
    { id: 'alternate-nostril', title: 'Alternate Nostril', description: 'Balance energy', videoUrl: waterflowVideo, imageUrl: waterfallImage, category: 'Breathing Exercises', type: 'Guided' },
    { id: 'diaphragmatic', title: 'Deep Belly Breathing', description: 'Full breath', videoUrl: autumnLeavesVideo, imageUrl: autumnLeavesImage, category: 'Breathing Exercises', type: 'Guided' },
  ];

  // Group experiences by category
  const categorizedExperiences = meditationExperiences.reduce((acc, experience) => {
    if (!acc[experience.category]) {
      acc[experience.category] = [];
    }
    acc[experience.category].push(experience);
    return acc;
  }, {} as Record<string, MeditationExperience[]>);

  const selectedExperience = meditationExperiences.find(e => e.id === selectedSound);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume[0] / 100;
    }
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume[0] / 100;
    }
  }, [volume, isMuted]);

  // Rotate quotes every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % currentQuotes.length);
    }, 300000);

    return () => clearInterval(interval);
  }, [currentQuotes.length]);

  // Reset quote index when changing experiences
  useEffect(() => {
    setCurrentQuoteIndex(0);
  }, [selectedSound]);

  const handleSoundClick = (soundId: string) => {
    setSelectedSound(soundId);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume);
    if (newVolume[0] > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setSelectedSound(null);
    setIsPlaying(false);
  };

  const scrollContainer = (categoryId: string, direction: 'left' | 'right') => {
    const container = document.getElementById(`scroll-${categoryId}`);
    if (container) {
      const scrollAmount = 400;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <Header />
      <PageLayout hasHero={false}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
              Meditation
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Find your calm. Choose an experience and let nature guide you to peace.
            </p>
          </div>

          {/* Categories with Horizontal Scrolling */}
          {Object.entries(categorizedExperiences).map(([categoryName, experiences]) => {
            const categoryType = experiences[0]?.type || 'Sound';
            return (
              <div key={categoryName} className="mb-10">
                {/* Category Header with Type Badge */}
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    {categoryName}
                  </h2>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    categoryType === 'Sound'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  }`}>
                    {categoryType === 'Sound' ? 'Sounds' : 'Expert Audio'}
                  </span>
                </div>

                {/* Horizontal Scrollable Container */}
                <div className="relative group -mx-4 sm:-mx-6 lg:-mx-8">
                  <div
                    id={`scroll-${categoryName.replace(/\s+/g, '-')}`}
                    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-4 sm:px-6 lg:px-8"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                  {experiences.map((experience) => (
                    <div
                      key={experience.id}
                      onClick={() => handleSoundClick(experience.id)}
                      className="flex-shrink-0 w-64 cursor-pointer group/card"
                    >
                      {/* Card Container */}
                      <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        {/* Image */}
                        <div className="relative h-36 overflow-hidden">
                          <img
                            src={experience.imageUrl}
                            alt={experience.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                          />

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-xl">
                              <Play className="w-5 h-5 text-gray-900 ml-0.5" fill="currentColor" />
                            </div>
                          </div>

                          {/* Title Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <h3 className="text-sm font-bold text-white line-clamp-1">
                              {experience.title}
                            </h3>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-3">
                          <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed line-clamp-2">
                            {experience.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Scroll Buttons */}
                <button
                  onClick={() => scrollContainer(categoryName.replace(/\s+/g, '-'), 'left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-800 z-10"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-white" />
                </button>
                <button
                  onClick={() => scrollContainer(categoryName.replace(/\s+/g, '-'), 'right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-800 z-10"
                >
                  <ChevronRight className="w-5 h-5 text-gray-900 dark:text-white" />
                </button>
              </div>
            </div>
          );
          })}
        </div>
      </PageLayout>
      <Footer />

      {/* Fullscreen Video Overlay */}
      {selectedSound && selectedExperience && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Fullscreen Video Background */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            loop
            muted={isMuted}
            playsInline
            src={selectedExperience.videoUrl}
          />

          {/* Opaque Dark Overlay */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Centered Video Player Controls */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center">
              {/* Close Button - Top Right */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="absolute top-6 right-6 text-white hover:bg-white/20 rounded-full"
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Title */}
              <h1 className="text-white text-3xl font-semibold mb-4">
                {selectedExperience.title}
              </h1>

              {/* Description */}
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto px-4">
                {selectedExperience.description}
              </p>

              {/* Rotating Quote */}
              <div className="mb-12 max-w-2xl mx-auto px-6">
                <div className="relative">
                  <svg className="absolute -top-4 -left-2 w-8 h-8 text-white/20" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="text-xl md:text-2xl font-light text-white/90 italic px-8 leading-relaxed transition-all duration-1000">
                    {currentQuotes[currentQuoteIndex]}
                  </p>
                  <svg className="absolute -bottom-4 -right-2 w-8 h-8 text-white/20 transform rotate-180" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                </div>
              </div>

              {/* Play/Pause Button */}
              <Button
                onClick={handlePlayPause}
                size="lg"
                className="rounded-full w-20 h-20 bg-white/90 hover:bg-white text-gray-900 shadow-2xl hover:scale-110 transition-all duration-300 mb-8"
              >
                {isPlaying ? (
                  <Pause className="w-10 h-10" fill="currentColor" />
                ) : (
                  <Play className="w-10 h-10 ml-1" fill="currentColor" />
                )}
              </Button>

              {/* Volume Control */}
              <div className="flex items-center justify-center gap-4 backdrop-blur-md bg-black/30 rounded-full px-6 py-3 border border-white/10 max-w-xs mx-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20 rounded-full flex-shrink-0"
                >
                  {isMuted || volume[0] === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </Button>

                <Slider
                  value={volume}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="w-32 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MeditatePage;
