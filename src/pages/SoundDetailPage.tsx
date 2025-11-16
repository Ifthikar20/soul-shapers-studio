import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, ArrowLeft, X } from 'lucide-react';
import waterflowVideo from '@/assets/waterflow-meditate.mp4';

interface SoundExperience {
  id: string;
  title: string;
  videoUrl: string;
  audioUrl?: string;
  description: string;
}

const SoundDetailPage: React.FC = () => {
  const { soundId } = useParams<{ soundId: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [mouseTimeout, setMouseTimeout] = useState<NodeJS.Timeout | null>(null);

  // Sound experiences with video backgrounds
  const soundExperiences: Record<string, SoundExperience> = {
    'ocean-waves': {
      id: 'ocean-waves',
      title: 'Ocean Waves',
      videoUrl: waterflowVideo,
      description: 'Gentle waves lapping against the shore at sunset',
    },
    'flowing-river': {
      id: 'flowing-river',
      title: 'Flowing River',
      videoUrl: waterflowVideo,
      description: 'A peaceful river flowing through nature',
    },
    'forest-stream': {
      id: 'forest-stream',
      title: 'Forest Stream',
      videoUrl: waterflowVideo,
      description: 'Water trickling over rocks in a forest',
    },
    'rain-sounds': {
      id: 'rain-sounds',
      title: 'Gentle Rain',
      videoUrl: waterflowVideo,
      description: 'Soft rainfall creating a calming atmosphere',
    },
    'plants-germinating': {
      id: 'plants-germinating',
      title: 'Plants Germinating',
      videoUrl: waterflowVideo,
      description: 'The subtle beauty of life emerging and growing',
    },
    'nature-ambience': {
      id: 'nature-ambience',
      title: 'Nature Ambience',
      videoUrl: waterflowVideo,
      description: 'A blend of natural scenes for deep relaxation',
    },
  };

  const experience = soundId ? soundExperiences[soundId] : null;

  useEffect(() => {
    // Set video volume when component mounts
    if (videoRef.current) {
      videoRef.current.volume = volume[0] / 100;
    }
  }, []);

  useEffect(() => {
    // Update video volume when slider changes
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume[0] / 100;
    }
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0] / 100;
    }
  }, [volume, isMuted]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        audioRef.current?.pause();
      } else {
        videoRef.current.play();
        audioRef.current?.play();
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

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    navigate('/meditate');
  };

  useEffect(() => {
    return () => {
      if (mouseTimeout) {
        clearTimeout(mouseTimeout);
      }
    };
  }, [mouseTimeout]);

  if (!experience) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Sound experience not found</p>
          <Button onClick={() => navigate('/meditate')} variant="outline">
            Back to Meditation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-black"
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
        src={experience.videoUrl}
      />

      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Floating Controls */}
      <div
        className={`absolute top-0 left-0 right-0 z-10 transition-opacity duration-500 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between backdrop-blur-md bg-black/30 rounded-2xl px-6 py-4 shadow-2xl border border-white/10">
            {/* Left: Back/Close Button */}
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
                {experience.title}
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

      {/* Bottom: Description (appears on hover/when controls visible) */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-10 transition-opacity duration-500 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="backdrop-blur-md bg-black/30 rounded-2xl px-8 py-6 shadow-2xl border border-white/10">
            <p className="text-white/90 text-lg text-center leading-relaxed">
              {experience.description}
            </p>
          </div>
        </div>
      </div>

      {/* Center: Initial Play Prompt (only shown when not playing) */}
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
  );
};

export default SoundDetailPage;
