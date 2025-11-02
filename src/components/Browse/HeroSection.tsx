// src/components/Browse/HeroSection.tsx - COMPLETE FIXED VERSION
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useVideoAccess } from '@/hooks/useVideoAccess';
import { Video } from '@/types/video.types'; // ✅ FIXED: Use centralized type
import {
  Play, Star, Clock, Award, Info, ChevronLeft, ChevronRight
} from 'lucide-react';

interface HeroSectionProps {
  featuredVideo: Video | null; // ✅ FIXED: Use Video type
  loading: boolean;
  onPlay?: (video: Video) => void; // ✅ FIXED
  onMoreInfo?: (video: Video) => void; // ✅ FIXED
  onPrevSlide?: () => void;
  onNextSlide?: () => void;
  currentIndex?: number;
  totalSlides?: number;
}

const HeroSection = ({
  featuredVideo,
  loading,
  onPlay,
  onMoreInfo,
  onPrevSlide,
  onNextSlide,
  currentIndex = 0,
  totalSlides = 0
}: HeroSectionProps) => {
  const { canWatchVideo } = useVideoAccess();

  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-12 md:pt-16 pb-8">
        <div className="relative h-[65vh] w-full overflow-hidden rounded-[3rem] bg-gradient-to-r from-slate-200 to-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
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
      </div>
    );
  }

  if (!featuredVideo) return null;

  const canWatch = canWatchVideo(featuredVideo, []);

  return (
    <div className="container mx-auto px-6 pt-12 md:pt-16 pb-8">
      <div className="relative h-[65vh] w-full overflow-hidden rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] ring-1 ring-black/5 group">
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
                  src={
                    featuredVideo.expertAvatar || 
                    featuredVideo.expert_avatar || 
                    `https://api.dicebear.com/7.x/initials/svg?seed=${featuredVideo.expert}`
                  }
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
                <span className="font-medium">{featuredVideo.rating || '4.8'}</span>
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
            <p className="text-lg text-white/90 mb-8 leading-relaxed line-clamp-2">
              {featuredVideo.description}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button
                className="bg-white text-black hover:bg-white/90 font-semibold px-8 py-3 text-base h-12 rounded-full"
                onClick={() => onPlay?.(featuredVideo)}
              >
                <Play className="w-5 h-5 mr-2 fill-current" />
                {canWatch ? 'Watch Now' : 'Preview'}
              </Button>
              <Button
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-3 text-base h-12 rounded-full"
                onClick={() => onMoreInfo?.(featuredVideo)}
              >
                <Info className="w-5 h-5 mr-2" />
                More Info
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons - Only show if multiple slides */}
      {totalSlides > 1 && onPrevSlide && onNextSlide && (
        <>
          {/* Previous Button */}
          <button
            onClick={onPrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous featured video"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={onNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next featured video"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carousel Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-white'
                    : 'w-1.5 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
    </div>
  );
};

export default HeroSection;