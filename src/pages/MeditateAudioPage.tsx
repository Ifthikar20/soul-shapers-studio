import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, X } from 'lucide-react';

// Import bird scene video and audio
import birdSceneVideo from '@/assets/Static_Scene_With_Flying_Birds.mp4';
import birdChirpingAudio from '@/assets/bird-chipping-426107.mp3';

interface MeditationAudioExperience {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  audioUrl?: string; // Will be added when user provides the audio file
  category: string;
}

// Helper function to create meditation experience
const createExperience = (id: string, title: string, description: string, category: string): MeditationAudioExperience => ({
  id,
  title,
  description,
  videoUrl: birdSceneVideo,
  audioUrl: birdChirpingAudio,
  category,
});

// All meditation experiences use the bird scene video and bird chirping audio
const meditationExperiences: Record<string, MeditationAudioExperience> = {
  // Sounds of Nature
  'waterflow': createExperience('waterflow', 'Waterfall Meditation', 'Gentle cascade of water', 'Sounds of Nature'),
  'morning-walk': createExperience('morning-walk', 'Morning Walk', 'Peaceful nature stroll', 'Sounds of Nature'),
  'morning-fishing': createExperience('morning-fishing', 'Morning Fishing', 'Tranquil lakeside sounds', 'Sounds of Nature'),
  'thunder-rain': createExperience('thunder-rain', 'Village Thunderstorm', 'Powerful storm ambience', 'Sounds of Nature'),
  'burning-wood': createExperience('burning-wood', 'Crackling Fireplace', 'Warm fire sounds', 'Sounds of Nature'),
  'ocean-waves': createExperience('ocean-waves', 'Ocean Waves', 'Rhythmic peace of ocean', 'Sounds of Nature'),
  'rain-forest': createExperience('rain-forest', 'Rain Forest', 'Tropical rainforest sounds', 'Sounds of Nature'),
  'mountain-stream': createExperience('mountain-stream', 'Mountain Stream', 'Gentle mountain flow', 'Sounds of Nature'),

  // Seasonal Meditations
  'autumn-leaves': createExperience('autumn-leaves', 'Autumn Leaves', 'Leaves dancing in breeze', 'Seasonal Meditations'),
  'autumn-wind': createExperience('autumn-wind', 'Autumn Wind', 'Crisp autumn air', 'Seasonal Meditations'),
  'winter-snow': createExperience('winter-snow', 'Winter Snowfall', 'Peaceful falling snow', 'Seasonal Meditations'),
  'spring-garden': createExperience('spring-garden', 'Spring Garden', 'Blooming flowers', 'Seasonal Meditations'),
  'summer-meadow': createExperience('summer-meadow', 'Summer Meadow', 'Warm sunny fields', 'Seasonal Meditations'),

  // Guided Meditation for Professionals
  'focus-boost': createExperience('focus-boost', 'Focus Boost', 'Enhance concentration', 'Guided Meditation for Professionals'),
  'stress-release': createExperience('stress-release', 'Stress Release', 'Let go of tension', 'Guided Meditation for Professionals'),
  'decision-clarity': createExperience('decision-clarity', 'Decision Clarity', 'Clear mind guidance', 'Guided Meditation for Professionals'),
  'leadership-mindset': createExperience('leadership-mindset', 'Leadership Mindset', 'Executive presence', 'Guided Meditation for Professionals'),
  'creativity-flow': createExperience('creativity-flow', 'Creativity Flow', 'Unlock innovation', 'Guided Meditation for Professionals'),
  'work-life-balance': createExperience('work-life-balance', 'Work-Life Balance', 'Find equilibrium', 'Guided Meditation for Professionals'),

  // Sleep & Relaxation
  'deep-sleep': createExperience('deep-sleep', 'Deep Sleep', 'Drift into slumber', 'Sleep & Relaxation'),
  'insomnia-relief': createExperience('insomnia-relief', 'Insomnia Relief', 'Overcome sleeplessness', 'Sleep & Relaxation'),
  'bedtime-story': createExperience('bedtime-story', 'Bedtime Journey', 'Guided sleep story', 'Sleep & Relaxation'),
  'power-nap': createExperience('power-nap', 'Power Nap', '20-minute refresh', 'Sleep & Relaxation'),
  'evening-unwind': createExperience('evening-unwind', 'Evening Unwind', 'Release the day', 'Sleep & Relaxation'),

  // Focus & Concentration
  'study-focus': createExperience('study-focus', 'Study Focus', 'Academic concentration', 'Focus & Concentration'),
  'work-productivity': createExperience('work-productivity', 'Work Productivity', 'Peak performance', 'Focus & Concentration'),
  'exam-preparation': createExperience('exam-preparation', 'Exam Preparation', 'Calm test anxiety', 'Focus & Concentration'),
  'deep-work': createExperience('deep-work', 'Deep Work', 'Eliminate distractions', 'Focus & Concentration'),
  'memory-boost': createExperience('memory-boost', 'Memory Boost', 'Enhance recall', 'Focus & Concentration'),

  // Stress Relief
  'anxiety-calm': createExperience('anxiety-calm', 'Anxiety Calm', 'Soothe worried mind', 'Stress Relief'),
  'panic-relief': createExperience('panic-relief', 'Panic Relief', 'Ground yourself', 'Stress Relief'),
  'tension-release': createExperience('tension-release', 'Tension Release', 'Body scan relaxation', 'Stress Relief'),
  'overwhelm-support': createExperience('overwhelm-support', 'Overwhelm Support', 'Find your center', 'Stress Relief'),
  'burnout-recovery': createExperience('burnout-recovery', 'Burnout Recovery', 'Restore energy', 'Stress Relief'),

  // Morning Meditations
  'morning-energy': createExperience('morning-energy', 'Morning Energy', 'Start day right', 'Morning Meditations'),
  'gratitude-practice': createExperience('gratitude-practice', 'Gratitude Practice', 'Count blessings', 'Morning Meditations'),
  'intention-setting': createExperience('intention-setting', 'Intention Setting', 'Define your day', 'Morning Meditations'),
  'sunrise-meditation': createExperience('sunrise-meditation', 'Sunrise Meditation', 'Greet the dawn', 'Morning Meditations'),
  'positive-affirmations': createExperience('positive-affirmations', 'Positive Affirmations', 'Build confidence', 'Morning Meditations'),

  // Evening Wind Down
  'sunset-reflection': createExperience('sunset-reflection', 'Sunset Reflection', "Day's end peace", 'Evening Wind Down'),
  'gratitude-evening': createExperience('gratitude-evening', 'Evening Gratitude', 'Reflect with thanks', 'Evening Wind Down'),
  'letting-go': createExperience('letting-go', 'Letting Go', 'Release the day', 'Evening Wind Down'),
  'night-peace': createExperience('night-peace', 'Night Peace', 'Prepare for rest', 'Evening Wind Down'),

  // Mindfulness Practice
  'present-moment': createExperience('present-moment', 'Present Moment', 'Be here now', 'Mindfulness Practice'),
  'body-awareness': createExperience('body-awareness', 'Body Awareness', 'Connect with self', 'Mindfulness Practice'),
  'mindful-eating': createExperience('mindful-eating', 'Mindful Eating', 'Savor each bite', 'Mindfulness Practice'),
  'walking-meditation': createExperience('walking-meditation', 'Walking Meditation', 'Mindful movement', 'Mindfulness Practice'),

  // Breathing Exercises
  'box-breathing': createExperience('box-breathing', 'Box Breathing', '4-4-4-4 technique', 'Breathing Exercises'),
  '478-breathing': createExperience('478-breathing', '4-7-8 Breathing', 'Rapid relaxation', 'Breathing Exercises'),
  'alternate-nostril': createExperience('alternate-nostril', 'Alternate Nostril', 'Balance energy', 'Breathing Exercises'),
  'diaphragmatic': createExperience('diaphragmatic', 'Deep Belly Breathing', 'Full breath', 'Breathing Exercises'),
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
