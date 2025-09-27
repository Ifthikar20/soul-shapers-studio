// src/components/Audio/AudioHeroSection.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useVideoAccess } from '@/hooks/useVideoAccess';
import {
  Play, Star, Clock, Award, Info, Headphones, Volume2
} from 'lucide-react';

interface AudioContent {
  id: number;
  title: string;
  expert: string;
  expertCredentials: string;
  expertAvatar: string;
  duration: string;
  category: string;
  rating: number;
  views: string;
  thumbnail: string;
  isNew: boolean;
  isTrending: boolean;
  description: string;
  fullDescription: string;
  audioUrl: string;
  relatedTopics: string[];
  learningObjectives: string[];
  accessTier: 'free' | 'premium';
  isFirstEpisode?: boolean;
  seriesId?: string;
  episodeNumber?: number;
}

interface AudioHeroSectionProps {
  featuredAudio: AudioContent | null;
  loading: boolean;
  onPlay?: (audio: AudioContent) => void;
}

const AudioHeroSection = ({ featuredAudio, loading, onPlay }: AudioHeroSectionProps) => {
  const { canWatchVideo } = useVideoAccess();
  const [isPlaying, setIsPlaying] = useState(false);

  if (loading) {
    return (
      <div className="relative h-[65vh] w-full overflow-hidden rounded-b-3xl bg-gradient-to-r from-slate-200 to-slate-100">
        <div className="absolute inset-0 flex items-end pb-12">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl space-y-4">
              <Skeleton className="h-16 w-12 rounded-full" />
              <Skeleton className="h-12 w-96" />
              <Skeleton className="h-6 w-80" />
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!featuredAudio) return null;

  const canListen = canWatchVideo(featuredAudio, []);

  return (
    <div className="relative h-[65vh] w-full overflow-hidden rounded-b-3xl">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={featuredAudio.thumbnail}
          alt={featuredAudio.title}
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Audio Visualization */}
      <div className="absolute top-8 right-8 z-10">
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
          <Headphones className="w-5 h-5 text-white" />
          <span className="text-white text-sm font-medium">Audio Content</span>
          {isPlaying && (
            <div className="flex items-center gap-1">
              <div className="w-1 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div className="w-1 h-5 bg-green-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-1 h-4 bg-green-400 rounded-full animate-pulse delay-150"></div>
              <div className="w-1 h-6 bg-green-400 rounded-full animate-pulse delay-200"></div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-end pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl">
            {/* Expert Badge */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30">
                <img
                  src={featuredAudio.expertAvatar}
                  alt={featuredAudio.expert}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <Badge className="bg-purple-500/80 backdrop-blur-sm text-white border-purple-300/30 mb-1">
                  <Volume2 className="w-3 h-3 mr-1" />
                  Featured Audio
                </Badge>
                <div className="text-white/90 text-sm font-medium">{featuredAudio.expert}</div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {featuredAudio.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-4 mb-6 text-white/80">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-medium">{featuredAudio.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{featuredAudio.duration}</span>
              </div>
              <Badge variant="outline" className="text-white border-white/30 bg-white/10 backdrop-blur-sm">
                {featuredAudio.category}
              </Badge>
            </div>

            {/* Description */}
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              {featuredAudio.description}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 text-base h-12 rounded-lg"
                onClick={() => onPlay?.(featuredAudio)}
              >
                <Play className="w-5 h-5 mr-2 fill-current" />
                {canListen ? 'Listen Now' : 'Preview'}
              </Button>
              <Button 
                variant="outline" 
                className="border-white/40 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-3 text-base h-12 rounded-lg"
                onClick={() => onPlay?.(featuredAudio)}
              >
                <Info className="w-5 h-5 mr-2" />
                More Info
              </Button>
            </div>

            {/* Audio Benefits */}
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm">
                <Headphones className="w-3 h-3 inline mr-1" />
                Perfect for commuting
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm">
                <Star className="w-3 h-3 inline mr-1" />
                No screen required
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm">
                <Clock className="w-3 h-3 inline mr-1" />
                Listen anytime
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioHeroSection;