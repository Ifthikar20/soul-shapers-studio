// src/components/AudioComponent.tsx - Fixed version
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Clock, 
  User, 
  Star, 
  Crown, 
  TrendingUp, 
  Headphones,
  Volume2,
  X,
  ChevronRight,
  Pause,
  SkipBack,
  SkipForward,
  VolumeX,
  Volume1
} from 'lucide-react';
import { AudioContent } from '@/types/audio.types';

// Mock audio data
const audioContent: AudioContent[] = [
  {
    id: 1,
    title: "Morning Meditation for Anxiety Relief",
    expert: "Dr. Sarah Johnson",
    expertCredentials: "Clinical Psychologist, PhD",
    expertAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
    duration: "12:30",
    category: "Meditation",
    rating: 4.9,
    listens: "25.3k",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    isNew: true,
    isTrending: true,
    description: "Start your day with calm and clarity through this guided anxiety relief meditation.",
    fullDescription: "A gentle morning meditation designed to help you release anxiety and set positive intentions for the day ahead.",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    accessTier: 'free',
    isFirstEpisode: true
  },
  {
    id: 2,
    title: "Deep Sleep Stories for Adults",
    expert: "Dr. Emily Chen",
    expertCredentials: "Sleep Specialist, MD",
    expertAvatar: "https://images.unsplash.com/photo-1594824388853-d0b8ccbfbb3d?w=100&h=100&fit=crop&crop=face",
    duration: "25:45",
    category: "Sleep",
    rating: 4.8,
    listens: "18.7k",
    thumbnail: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=250&fit=crop",
    isNew: false,
    isTrending: true,
    description: "Calming bedtime stories designed to help adults drift into peaceful sleep.",
    fullDescription: "Professionally crafted sleep stories that guide your mind into relaxation and prepare you for restorative sleep.",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    accessTier: 'premium'
  },
  {
    id: 3,
    title: "Breathing Techniques for Stress",
    expert: "Dr. Michael Park",
    expertCredentials: "Mindfulness Coach",
    expertAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    duration: "8:15",
    category: "Breathwork",
    rating: 4.7,
    listens: "12.4k",
    thumbnail: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=250&fit=crop",
    isNew: true,
    isTrending: false,
    description: "Learn powerful breathing techniques to manage stress in real-time.",
    fullDescription: "Master evidence-based breathing methods that you can use anywhere to quickly reduce stress and anxiety.",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    accessTier: 'free'
  },
  {
    id: 4,
    title: "Self-Compassion Practice",
    expert: "Dr. Lisa Rodriguez",
    expertCredentials: "Licensed Therapist, LMFT",
    expertAvatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face",
    duration: "15:20",
    category: "Self-Care",
    rating: 4.9,
    listens: "22.1k",
    thumbnail: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=250&fit=crop",
    isNew: false,
    isTrending: false,
    description: "Cultivate kindness toward yourself with this guided self-compassion practice.",
    fullDescription: "Learn to treat yourself with the same kindness you would offer a good friend through this transformative practice.",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    accessTier: 'premium'
  }
];

// Audio Card Component
const AudioCard = ({ audio, onPlay, onUpgrade }: {
  audio: AudioContent;
  onPlay: (audio: AudioContent) => void;
  onUpgrade: (audio: AudioContent) => void;
}) => {
  const canWatch = audio.accessTier === 'free' || audio.isFirstEpisode;

  return (
    <Card className="cursor-pointer group overflow-hidden hover:shadow-md transition-all duration-200 w-72 h-80">
      <div className="relative">
        <img
          src={audio.thumbnail}
          alt={audio.title}
          className="w-full h-40 object-cover"
        />
        
        {/* Audio Icon Overlay */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <Headphones className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        {/* Play Overlay on Hover */}
        <div 
          onClick={() => onPlay(audio)}
          className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
        >
          <div className="rounded-full p-2 bg-white/90 shadow-lg">
            {canWatch ? (
              <Play className="w-6 h-6 text-purple-600 fill-current" />
            ) : (
              <Crown className="w-6 h-6 text-orange-500" />
            )}
          </div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {audio.isNew && (
            <Badge className="bg-green-500 text-white text-xs px-2 py-0.5">
              New
            </Badge>
          )}
          {audio.isTrending && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
              Trending
            </Badge>
          )}
          {audio.accessTier === 'premium' && !audio.isFirstEpisode && (
            <Badge className="bg-orange-500 text-white text-xs px-2 py-0.5">
              <Crown className="w-2.5 h-2.5 mr-0.5" />
              Premium
            </Badge>
          )}
        </div>
        
        {/* Duration */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-0.5 rounded text-xs flex items-center">
          <Volume2 className="w-2.5 h-2.5 mr-1" />
          {audio.duration}
        </div>
      </div>
      
      <CardContent className="p-5 h-56 flex flex-col">
        {/* Category */}
        <Badge variant="outline" className="text-xs mb-2 w-fit">
          {audio.category}
        </Badge>
        
        {/* Title */}
        <h3 className="font-semibold text-base text-foreground mb-4 line-clamp-2 leading-tight h-12 overflow-hidden">
          {audio.title}
        </h3>
        
        {/* Expert */}
        <div className="flex items-center text-muted-foreground text-sm mb-4 h-5">
          <User className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{audio.expert}</span>
        </div>

        {/* Stats and Action */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Star className="w-4 h-4 mr-1 text-yellow-500 flex-shrink-0" />
            <span>{audio.rating}</span>
            <span className="mx-2">•</span>
            <span>{audio.listens}</span>
          </div>
          
          {!canWatch ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onUpgrade(audio)}
              className="text-orange-600 border-orange-200 hover:bg-orange-50 text-sm px-3 py-1.5 h-8 flex-shrink-0"
            >
              Upgrade
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onPlay(audio)}
              className="text-purple-600 hover:bg-purple-50 text-sm px-3 py-1.5 h-8 flex-shrink-0"
            >
              Listen
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Audio Player Modal
const AudioPlayerModal = ({ audio, open, onOpenChange }: {
  audio: AudioContent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([80]);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Parse duration string to seconds
  const parseDuration = (durationStr: string): number => {
    const [minutes, seconds] = durationStr.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  // Format time in MM:SS
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Audio event handlers
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement || !audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audioElement.duration || parseDuration(audio.duration));
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('play', handlePlay);
    audioElement.addEventListener('pause', handlePause);
    audioElement.addEventListener('ended', handleEnded);

    return () => {
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('play', handlePlay);
      audioElement.removeEventListener('pause', handlePause);
      audioElement.removeEventListener('ended', handleEnded);
    };
  }, [audio]);

  const togglePlayPause = () => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play().catch(console.error);
    }
  };

  const handleSeek = (value: number[]) => {
    const audioElement = audioRef.current;
    if (!audioElement) return;
    
    audioElement.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const audioElement = audioRef.current;
    if (!audioElement) return;
    
    const volumeValue = value[0] / 100;
    audioElement.volume = volumeValue;
    setVolume(value);
    setIsMuted(volumeValue === 0);
  };

  const toggleMute = () => {
    const audioElement = audioRef.current;
    if (!audioElement) return;
    
    if (isMuted) {
      audioElement.volume = volume[0] / 100;
      setIsMuted(false);
    } else {
      audioElement.volume = 0;
      setIsMuted(true);
    }
  };

  const skip = (seconds: number) => {
    const audioElement = audioRef.current;
    if (!audioElement) return;
    
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    audioElement.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const getVolumeIcon = () => {
    if (isMuted || volume[0] === 0) return VolumeX;
    if (volume[0] < 50) return Volume1;
    return Volume2;
  };

  if (!audio) return null;

  const VolumeIcon = getVolumeIcon();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border-0">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="absolute -top-2 -right-2 z-10 rounded-full w-8 h-8"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="text-center space-y-6 p-6">
            {/* Audio element */}
            <audio
              ref={audioRef}
              src={audio.audioUrl}
              preload="metadata"
            />

            {/* Thumbnail */}
            <div className="relative mx-auto w-48 h-48 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={audio.thumbnail}
                alt={audio.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <Headphones className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
            </div>

            {/* Content Info */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">{audio.title}</h2>
              <p className="text-gray-600">{audio.description}</p>
              
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {audio.expert}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {audio.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  {audio.rating}
                </span>
              </div>
            </div>

            {/* Player Controls */}
            <div className="space-y-4">
              {/* Main Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full"
                  onClick={() => skip(-10)}
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                
                <Button 
                  size="lg"
                  onClick={togglePlayPause}
                  className="rounded-full w-16 h-16 bg-purple-600 hover:bg-purple-700"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white fill-white" />
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full"
                  onClick={() => skip(10)}
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <Slider
                  value={[currentTime]}
                  max={duration || parseDuration(audio.duration)}
                  step={1}
                  onValueChange={handleSeek}
                  className="w-full"
                />
                
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{formatTime(currentTime)}</span>
                  <span>{audio.duration}</span>
                </div>
              </div>

              {/* Volume Control */}
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="rounded-full"
                >
                  <VolumeIcon className="w-4 h-4" />
                </Button>
                
                <div className="w-24">
                  <Slider
                    value={volume}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="w-full"
                  />
                </div>
                
                <span className="text-xs text-gray-500 w-8 text-center">
                  {Math.round(volume[0])}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
              onClick={() => {
                console.log('Navigate to full audio player for:', audio.id);
                onOpenChange(false);
              }}
            >
              Open Full Player
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main Audio Component
const AudioComponent = () => {
  const [selectedAudio, setSelectedAudio] = useState<AudioContent | null>(null);

  const handlePlay = useCallback((audio: AudioContent) => {
    const canListen = audio.accessTier === 'free' || audio.isFirstEpisode;
    
    if (canListen) {
      setSelectedAudio(audio);
    } else {
      handleUpgrade(audio);
    }
  }, []);

  const handleUpgrade = useCallback((audio: AudioContent) => {
    console.log('Navigate to upgrade for audio:', audio.id);
    // Navigate to upgrade page
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedAudio(null);
  }, []);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-sm font-medium px-4 py-2 rounded-full mb-4">
            <Headphones className="w-4 h-4" />
            Audio Content
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Guided Audio
            <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Wellness Sessions
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Listen to expert-guided meditation, sleep stories, and wellness practices 
            designed to support your mental health journey.
          </p>
        </div>

        {/* Audio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {audioContent.map((audio) => (
            <AudioCard
              key={audio.id}
              audio={audio}
              onPlay={handlePlay}
              onUpgrade={handleUpgrade}
            />
          ))}
        </div>

        {/* Audio Player Modal */}
        <AudioPlayerModal
          audio={selectedAudio}
          open={!!selectedAudio}
          onOpenChange={handleModalClose}
        />
      </div>
    </section>
  );
};

export default AudioComponent;