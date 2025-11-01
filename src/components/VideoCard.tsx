// src/components/VideoCard.tsx - Netflix-style horizontal card
import { memo } from "react";
import {
  Play, Star, TrendingUp, Crown, Info
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useVideoAccess } from '@/hooks/useVideoAccess';
import { Video } from '@/types/video.types';

interface VideoCardProps {
  video: Video;
  videos: Video[];
  onPlay: (video: Video) => void;
  onUpgrade: (video: Video) => void;
}

const VideoCard = memo(({ video, videos, onPlay, onUpgrade }: VideoCardProps) => {
  const { canWatchVideo } = useVideoAccess();

  const canWatch = canWatchVideo(video, videos);
  const isLocked = !canWatch;

  return (
    <Card
      className="cursor-pointer group overflow-hidden border-0 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:z-10"
      onClick={() => canWatch ? onPlay(video) : onUpgrade(video)}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-900">
        {/* Main Image */}
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Gradient Overlay - Always visible at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

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
        {isLocked && (
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] px-1.5 py-0.5 font-semibold">
              <Crown className="w-2.5 h-2.5 mr-0.5" />
              PRO
            </Badge>
          </div>
        )}

        {/* Center Play Button - Appears on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="rounded-full p-4 bg-white/95 shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
            {isLocked ? (
              <Crown className="w-6 h-6 text-orange-500" />
            ) : (
              <Play className="w-6 h-6 text-black fill-current" />
            )}
          </div>
        </div>

        {/* Bottom Info - Slides up slightly on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
          <div className="space-y-1.5">
            {/* Title */}
            <h3 className="font-bold text-white text-sm line-clamp-1 drop-shadow-lg">
              {video.title}
            </h3>

            {/* Info Row - Only visible on hover */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-1.5 text-xs text-white/90">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="font-medium">{video.rating || '4.8'}</span>
              </div>
              <span className="text-white/60 text-xs">•</span>
              <span className="text-white/90 text-xs">{video.duration}</span>
              <span className="text-white/60 text-xs">•</span>
              <span className="text-white/90 text-xs">{video.views}</span>
            </div>

            {/* Category & Expert - Only visible on hover */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-white/40 text-white bg-white/10">
                {video.category}
              </Badge>
              <span className="text-white/80 text-xs truncate">{video.expert}</span>
            </div>
          </div>
        </div>

        {/* Info Button - Bottom Right on Hover */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="rounded-full p-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/40 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              canWatch ? onPlay(video) : onUpgrade(video);
            }}
          >
            <Info className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </Card>
  );
});

VideoCard.displayName = 'VideoCard';

export default VideoCard;