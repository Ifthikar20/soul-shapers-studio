import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/Layout/PageLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Waves, Wind, Droplets, Leaf, Music, Sparkles, Play, Pause, Volume2, VolumeX, X } from 'lucide-react';
import waterflowVideo from '@/assets/waterflow-meditate.mp4';
import waterfallImage from '@/assets/waterfall-meditate-img.jpg';

interface CalmingSoundCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  iconColor: string;
}

const MeditatePage: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [selectedSound, setSelectedSound] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [mouseTimeout, setMouseTimeout] = useState<NodeJS.Timeout | null>(null);

  const calmingSounds: CalmingSoundCard[] = [
    {
      id: 'ocean-waves',
      title: 'Ocean Waves',
      description: 'Immerse yourself in sunset waves gently lapping against golden shores',
      icon: <Waves className="w-12 h-12" />,
      gradient: 'from-blue-500 to-cyan-500',
      iconColor: 'text-blue-100',
    },
    {
      id: 'flowing-river',
      title: 'Flowing River',
      description: 'Experience the peaceful flow of a crystal-clear river through nature',
      icon: <Droplets className="w-12 h-12" />,
      gradient: 'from-teal-500 to-emerald-500',
      iconColor: 'text-teal-100',
    },
    {
      id: 'forest-stream',
      title: 'Forest Stream',
      description: 'Lose yourself in the gentle sounds of water cascading over forest rocks',
      icon: <Sparkles className="w-12 h-12" />,
      gradient: 'from-green-500 to-teal-500',
      iconColor: 'text-green-100',
    },
    {
      id: 'rain-sounds',
      title: 'Gentle Rain',
      description: 'Let soft rainfall wash away your stress in this calming scene',
      icon: <Wind className="w-12 h-12" />,
      gradient: 'from-slate-500 to-blue-500',
      iconColor: 'text-slate-100',
    },
    {
      id: 'plants-germinating',
      title: 'Plants Germinating',
      description: 'Witness the quiet beauty and wonder of life emerging and growing',
      icon: <Leaf className="w-12 h-12" />,
      gradient: 'from-lime-500 to-green-500',
      iconColor: 'text-lime-100',
    },
    {
      id: 'nature-ambience',
      title: 'Nature Ambience',
      description: 'A harmonious blend of natural scenes for profound relaxation',
      icon: <Music className="w-12 h-12" />,
      gradient: 'from-purple-500 to-pink-500',
      iconColor: 'text-purple-100',
    },
  ];

  const selectedSoundData = calmingSounds.find(s => s.id === selectedSound);

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

  useEffect(() => {
    return () => {
      if (mouseTimeout) {
        clearTimeout(mouseTimeout);
      }
    };
  }, [mouseTimeout]);

  const handleSoundClick = (soundId: string) => {
    setSelectedSound(soundId);
    setIsPlaying(false);
    setShowControls(true);
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

  const handleMouseMove = () => {
    setShowControls(true);

    if (mouseTimeout) {
      clearTimeout(mouseTimeout);
    }

    const timeout = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);

    setMouseTimeout(timeout);
  };

  return (
    <>
      <Header />
      <PageLayout hasHero={false}>
        <div className="max-w-7xl mx-auto py-12 px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Immersive Meditation
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Escape into beautiful, calming scenes from nature. Each experience features
              a fullscreen video with ambient sounds to help you relax and find inner peace.
            </p>
          </div>

          {/* Calming Sounds Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calmingSounds.map((sound) => (
              <Card
                key={sound.id}
                onClick={() => handleSoundClick(sound.id)}
                className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
              >
                {/* Image Preview */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={waterfallImage}
                    alt={sound.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${sound.gradient} opacity-30 group-hover:opacity-40 transition-opacity duration-300`} />

                  {/* Play Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="relative p-6">
                  {/* Icon Container */}
                  <div
                    className={`mb-4 w-16 h-16 rounded-full bg-gradient-to-br ${sound.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className={sound.iconColor}>{sound.icon}</div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300">
                    {sound.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {sound.description}
                  </p>

                  {/* Hover Indicator */}
                  <div className="mt-4 flex items-center text-sm font-medium text-gray-500 dark:text-gray-500 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors duration-300">
                    <span>Click to experience</span>
                    <svg
                      className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Additional Info Section */}
          <div className="mt-16 text-center">
            <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Immersive Video Meditation
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Each experience takes you on a visual journey with beautiful nature scenes and ambient sounds.
                The fullscreen video creates an immersive environment that helps you disconnect from stress
                and reconnect with peace. Simply click, press play, and let the calming visuals and sounds
                wash over you.
              </p>
            </Card>
          </div>
        </div>
      </PageLayout>
      <Footer />

      {/* Fullscreen Video Overlay */}
      {selectedSound && (
        <div
          className="fixed inset-0 z-50 bg-black"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setShowControls(true)}
        >
          {/* Fullscreen Video Background */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            loop
            muted={isMuted}
            playsInline
            src={waterflowVideo}
          />

          {/* Transparent Dark Overlay */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Floating Controls */}
          <div
            className={`absolute top-0 left-0 right-0 z-10 transition-opacity duration-500 ${
              showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="flex items-center justify-between backdrop-blur-md bg-black/30 rounded-2xl px-6 py-4 shadow-2xl border border-white/10">
                {/* Left: Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>

                {/* Center: Title and Play/Pause */}
                <div className="flex items-center gap-6">
                  <h1 className="text-white text-2xl font-semibold hidden sm:block">
                    {selectedSoundData?.title}
                  </h1>

                  <Button
                    onClick={handlePlayPause}
                    size="lg"
                    className="rounded-full w-14 h-14 bg-white/90 hover:bg-white text-gray-900 shadow-lg hover:scale-105 transition-transform"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" fill="currentColor" />
                    ) : (
                      <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
                    )}
                  </Button>
                </div>

                {/* Right: Volume Control */}
                <div className="flex items-center gap-3 min-w-[180px]">
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
                    className="w-24 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: Description */}
          <div
            className={`absolute bottom-0 left-0 right-0 z-10 transition-opacity duration-500 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="backdrop-blur-md bg-black/30 rounded-2xl px-8 py-6 shadow-2xl border border-white/10">
                <p className="text-white/90 text-lg text-center leading-relaxed">
                  {selectedSoundData?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Center: Initial Play Prompt */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center z-5">
              <div className="text-center">
                <Button
                  onClick={handlePlayPause}
                  size="lg"
                  className="rounded-full w-20 h-20 bg-white/90 hover:bg-white text-gray-900 shadow-2xl hover:scale-110 transition-all duration-300"
                >
                  <Play className="w-10 h-10 ml-1" fill="currentColor" />
                </Button>
                <p className="text-white text-xl mt-6 font-light tracking-wide">
                  Click to begin
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MeditatePage;
