// src/components/Browse/HeroSection.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useVideoAccess } from '@/hooks/useVideoAccess';
import {
  Play, Star, Clock, Award, Info
} from 'lucide-react';

interface VideoContent {
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
  videoUrl: string;
  relatedTopics: string[];
  learningObjectives: string[];
  accessTier: 'free' | 'premium';
  isFirstEpisode?: boolean;
  seriesId?: string;
  episodeNumber?: number;
}

interface HeroSectionProps {
  featuredVideo: VideoContent | null;
  loading: boolean;
  onPlay?: (video: VideoContent) => void;
  onMoreInfo?: (video: VideoContent) => void;
}

const HeroSection = ({ featuredVideo, loading, onPlay, onMoreInfo }: HeroSectionProps) => {
  const { canWatchVideo } = useVideoAccess();

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

  if (!featuredVideo) return null;

  const canWatch = canWatchVideo(featuredVideo, []);

  return (
    <div className="relative h-[65vh] w-full overflow-hidden rounded-b-3xl">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={featuredVideo.thumbnail}
          alt={featuredVideo.title}
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-end pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl">
            {/* Expert Badge */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30">
                <img
                  src={featuredVideo.expertAvatar}
                  alt={featuredVideo.expert}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 mb-1">
                  <Award className="w-3 h-3 mr-1" />
                  Featured Expert
                </Badge>
                <div className="text-white/90 text-sm font-medium">{featuredVideo.expert}</div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {featuredVideo.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-4 mb-6 text-white/80">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-medium">{featuredVideo.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{featuredVideo.duration}</span>
              </div>
              <Badge variant="outline" className="text-white border-white/30 bg-white/10 backdrop-blur-sm">
                {featuredVideo.category}
              </Badge>
            </div>

            {/* Description */}
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              {featuredVideo.description}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button 
                className="bg-white text-black hover:bg-white/90 font-semibold px-8 py-3 text-base h-12 rounded-lg"
                onClick={() => onPlay?.(featuredVideo)}
              >
                <Play className="w-5 h-5 mr-2 fill-current" />
                {canWatch ? 'Watch Now' : 'Preview'}
              </Button>
              <Button 
                variant="outline" 
                className="border-white/40 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-3 text-base h-12 rounded-lg"
                onClick={() => onMoreInfo?.(featuredVideo)}
              >
                <Info className="w-5 h-5 mr-2" />
                More Info
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;