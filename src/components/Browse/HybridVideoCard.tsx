// src/components/Browse/HybridVideoCard.tsx - Netflix-style card with visible info
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useVideoAccess } from '@/hooks/useVideoAccess';
import {
  Play, Star, Crown, TrendingUp, Clock
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
      className="cursor-pointer group overflow-hidden border-0 rounded-lg transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-2xl hover:z-10 bg-card"
      onClick={() => canWatch ? onPlay(video) : onUpgrade(video)}
    >
      {/* Image Section */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-900">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5 z-10">
          {video.isNew && (
            <Badge className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 font-semibold">
              NEW
            </Badge>
          )}
          {video.isTrending && (
            <Badge className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 font-semibold flex items-center gap-1">
              <TrendingUp className="w-2.5 h-2.5" />
              TOP 10
            </Badge>
          )}
        </div>

        {/* Premium Badge - Top Right */}
        {!canWatch && (
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] px-1.5 py-0.5 font-semibold">
              <Crown className="w-2.5 h-2.5 mr-0.5" />
              PRO
            </Badge>
          </div>
        )}

        {/* Duration Badge - Always visible */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-[10px] font-medium flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          {video.duration}
        </div>

        {/* Center Play Button - Appears on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="rounded-full p-3 bg-white/95 shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
            {canWatch ? (
              <Play className="w-5 h-5 text-black fill-current" />
            ) : (
              <Crown className="w-5 h-5 text-orange-500" />
            )}
          </div>
        </div>
      </div>

      {/* Content Section - Always Visible */}
      <CardContent className="p-3 space-y-2">
        {/* Category Badge */}
        <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
          {video.category}
        </Badge>

        {/* Title - Always visible */}
        <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
          {video.title}
        </h3>

        {/* Expert - Always visible */}
        <p className="text-xs text-muted-foreground truncate">
          {video.expert}
        </p>

        {/* Stats - Always visible */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span>{video.rating}</span>
          </div>
          <span>•</span>
          <span>{video.views}</span>
        </div>

        {/* Description - Only visible on hover with expansion */}
        <div className="max-h-0 group-hover:max-h-20 overflow-hidden transition-all duration-300 ease-in-out">
          <p className="text-xs text-muted-foreground line-clamp-2 pt-2 border-t">
            {video.description || `Explore this ${video.category.toLowerCase()} session with ${video.expert}.`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HybridVideoCard;