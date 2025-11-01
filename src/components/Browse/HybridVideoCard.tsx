// src/components/Browse/HybridVideoCard.tsx - Modern image-only card with overlay
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useVideoAccess } from '@/hooks/useVideoAccess';
import {
  Play, Crown, TrendingUp, Clock
} from 'lucide-react';
import { VideoContent } from '@/types/video.types';

interface HybridVideoCardProps {
  video: VideoContent;
  onPlay: (video: VideoContent) => void;
  onUpgrade: (video: VideoContent) => void;
}

const HybridVideoCard = ({ video, onPlay, onUpgrade }: HybridVideoCardProps) => {
  const { canWatchVideo } = useVideoAccess();

  // Use accessTier to determine if video is accessible
  const canWatch = video.accessTier === 'free' || canWatchVideo(video);

  return (
    <Card
      className="cursor-pointer group overflow-hidden border-0 rounded-2xl transition-all duration-300 ease-in-out hover:scale-[1.05] hover:shadow-2xl hover:z-10 bg-transparent"
      onClick={() => canWatch ? onPlay(video) : onUpgrade(video)}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-900">
        {/* Main Image */}
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient Overlay - Stronger for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 group-hover:from-black/95 group-hover:via-black/60 transition-all duration-300" />

        {/* Top Section - Badges */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          {video.isNew && (
            <Badge className="bg-red-600 text-white text-[10px] px-2 py-0.5 font-semibold shadow-lg">
              NEW
            </Badge>
          )}
          {video.isTrending && (
            <Badge className="bg-orange-500 text-white text-[10px] px-2 py-0.5 font-semibold flex items-center gap-1 shadow-lg">
              <TrendingUp className="w-3 h-3" />
              TOP 10
            </Badge>
          )}
        </div>

        {/* Premium Badge - Top Right */}
        {!canWatch && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] px-2 py-0.5 font-semibold shadow-lg">
              <Crown className="w-3 h-3 mr-1" />
              PRO
            </Badge>
          </div>
        )}

        {/* Duration Badge - Top Right (when not locked) */}
        {canWatch && (
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded-md text-[10px] font-medium flex items-center gap-1 shadow-lg">
            <Clock className="w-3 h-3" />
            {video.duration}
          </div>
        )}

        {/* Center Play Button - Appears on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="rounded-full p-4 bg-white/95 backdrop-blur-sm shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
            {canWatch ? (
              <Play className="w-6 h-6 text-black fill-current" />
            ) : (
              <Crown className="w-6 h-6 text-orange-500" />
            )}
          </div>
        </div>

        {/* Bottom Section - Title and Category Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <div className="space-y-2">
            {/* Category Badge */}
            <Badge
              variant="secondary"
              className="bg-white/20 backdrop-blur-md text-white border-0 text-[10px] px-2 py-0.5 font-medium shadow-lg"
            >
              {video.category}
            </Badge>

            {/* Title */}
            <h3 className="font-bold text-white text-base line-clamp-2 leading-tight drop-shadow-2xl">
              {video.title}
            </h3>

            {/* Subtle info on hover */}
            <div className="flex items-center gap-2 text-white/90 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="font-medium">{video.expert}</span>
              <span className="text-white/60">•</span>
              <span>{video.views}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HybridVideoCard;