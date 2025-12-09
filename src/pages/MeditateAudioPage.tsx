import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, X } from 'lucide-react';

// Import placeholder video for background
import placeholderVideo from '@/assets/stardustvid.mp4';

// Audio file - User should replace this with their actual audio file path
// import firewoodAudio from '@/assets/firewood-burning-sound-179862.mp3';

interface MeditationAudioExperience {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  audioUrl?: string; // Will be added when user provides the audio file
  category: string;
}

// Sample meditation experiences
const meditationExperiences: Record<string, MeditationAudioExperience> = {
  '1': {
    id: '1',
    title: 'Crackling Fireplace',
    description: 'Warm, soothing sounds of a crackling fireplace to help you relax and unwind',
    videoUrl: placeholderVideo,
    // audioUrl: firewoodAudio, // Uncomment when audio file is added
    category: 'Sounds of Nature',
  },
  'waterflow': {
    id: 'waterflow',
    title: 'Waterfall Meditation',
    description: 'Gentle cascade of water flowing peacefully',
    videoUrl: placeholderVideo,
    category: 'Sounds of Nature',
  },
  'burning-wood': {
    id: 'burning-wood',
    title: 'Crackling Fireplace',
    description: 'Warm fire sounds for deep relaxation',
    videoUrl: placeholderVideo,
    category: 'Sounds of Nature',
  },
};

const MeditateAudioPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(true); // Auto-play on load
  const [volume, setVolume] = useState([70]);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [mouseTimeout, setMouseTimeout] = useState<NodeJS.Timeout | null>(null);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const experience = id ? meditationExperiences[id] : null;

  // Meditation quotes that rotate
  const meditationQuotes = [
    "Peace comes from within. Do not seek it without.",
    "The present moment is the only time over which we have dominion.",
    "Meditation is not evasion; it is a serene encounter with reality.",
    "In the midst of movement and chaos, keep stillness inside of you.",
    "Quiet the mind and the soul will speak.",
    "Meditation brings wisdom; lack of meditation leaves ignorance.",
    "The thing about meditation is: You become more and more you.",
    "Wherever you are, be there totally.",
  ];

  // Auto-play video and audio when component mounts
  useEffect(() => {
    const playMedia = async () => {
      try {
        if (videoRef.current) {
          videoRef.current.volume = volume[0] / 100;
          await videoRef.current.play();
        }
        if (audioRef.current) {
          audioRef.current.volume = volume[0] / 100;
          await audioRef.current.play();
        }
        setIsPlaying(true);
      } catch (error) {
        console.log('Auto-play prevented:', error);
        setIsPlaying(false);
      }
    };

    playMedia();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume[0] / 100;
    }
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0] / 100;
    }
  }, [volume, isMuted]);

  // Rotate quotes every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % meditationQuotes.length);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current?.pause();
      audioRef.current?.pause();
    } else {
      videoRef.current?.play();
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
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
    videoRef.current?.pause();
    audioRef.current?.pause();
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
          <p className="text-xl mb-4">Meditation experience not found</p>
          <Button onClick={() => navigate('/meditate')} variant="outline" className="text-white border-white hover:bg-white/10">
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
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        loop
        muted={isMuted}
        playsInline
        src={experience.videoUrl}
      />

      {/* Audio Element (hidden, plays in background) */}
      {experience.audioUrl && (
        <audio
          ref={audioRef}
          loop
          src={experience.audioUrl}
        />
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Close Button - Fixed Top Right */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClose}
        className="absolute top-6 right-6 z-20 text-white hover:bg-white/20 rounded-full"
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Centered Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center max-w-4xl px-6">
          {/* Title */}
          <h1 className="text-white text-4xl md:text-5xl font-semibold mb-6 drop-shadow-2xl">
            {experience.title}
          </h1>

          {/* Description */}
          <p className="text-white/90 text-xl md:text-2xl mb-12 max-w-2xl mx-auto drop-shadow-lg font-light">
            {experience.description}
          </p>

          {/* Rotating Quote */}
          <div className="mb-16 max-w-3xl mx-auto">
            <div className="relative">
              <svg className="absolute -top-4 -left-2 w-8 h-8 text-white/20" fill="currentColor" viewBox="0 0 32 32">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <p className="text-xl md:text-2xl font-light text-white/90 italic px-8 leading-relaxed transition-all duration-1000 drop-shadow-lg">
                {meditationQuotes[currentQuoteIndex]}
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
  );
};

export default MeditateAudioPage;
