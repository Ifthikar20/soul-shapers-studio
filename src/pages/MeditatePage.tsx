import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/Layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, X } from 'lucide-react';

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
}

const MeditatePage: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [selectedSound, setSelectedSound] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [isMuted, setIsMuted] = useState(false);

  const meditationExperiences: MeditationExperience[] = [
    {
      id: 'waterflow',
      title: 'Waterfall Meditation',
      description: 'Let the gentle cascade of water wash away your worries',
      videoUrl: waterflowVideo,
      imageUrl: waterfallImage,
      category: 'Water',
    },
    {
      id: 'autumn-leaves',
      title: 'Autumn Leaves',
      description: 'Watch leaves dance gracefully in the autumn breeze',
      videoUrl: autumnLeavesVideo,
      imageUrl: autumnLeavesImage,
      category: 'Nature',
    },
    {
      id: 'autumn-wind',
      title: 'Autumn Wind',
      description: 'Feel the crisp autumn air and gentle rustling of trees',
      videoUrl: autumnWindVideo,
      imageUrl: autumnWindImage,
      category: 'Nature',
    },
  ];

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

  return (
    <>
      <Header />
      <PageLayout hasHero={false}>
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Meditation
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
              Find your calm. Choose an experience and let nature guide you to peace.
            </p>
          </div>

          {/* Meditation Experiences Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {meditationExperiences.map((experience) => (
              <div
                key={experience.id}
                onClick={() => handleSoundClick(experience.id)}
                className="group relative cursor-pointer"
              >
                {/* Card Container */}
                <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={experience.imageUrl}
                      alt={experience.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 text-xs font-medium tracking-wide uppercase bg-white/90 text-gray-900 rounded-full backdrop-blur-sm">
                        {experience.category}
                      </span>
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-7 h-7 text-gray-900 ml-0.5" fill="currentColor" />
                      </div>
                    </div>

                    {/* Title Overlay on Image */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {experience.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {experience.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="mt-20 text-center">
            <div className="inline-block p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Mindful Moments
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Each meditation experience is designed to help you disconnect from stress
                and reconnect with your inner peace through the beauty of nature.
              </p>
            </div>
          </div>
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
