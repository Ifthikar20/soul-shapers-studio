// src/components/Browse/HybridVideoCard.tsx
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useVideoAccess } from '@/hooks/useVideoAccess';
import {
  Play, Clock, Star, Crown, TrendingUp
} from 'lucide-react';
import { VideoContent } from '@/types/video.types';

interface HybridVideoCardProps {
  video: VideoContent;
  onPlay: (video: VideoContent) => void;
  onUpgrade: (video: VideoContent) => void;
}

const getContentTypeBadge = (contentType: string) => {
  // Implementation for getContentTypeBadge
  return null; // Replace with actual implementation
};

const HybridVideoCard = ({ video, onPlay, onUpgrade }: HybridVideoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { canWatchVideo } = useVideoAccess();
  
  // Use accessTier to determine if video is accessible
  const canWatch = video.accessTier === 'free' || canWatchVideo(video);

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-0 bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => canWatch ? onPlay(video) : onUpgrade(video)}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden h-44">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {/* Blur transition between image and content */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white/95 via-white/60 to-transparent backdrop-blur-[2px]" />

        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300 ${
            canWatch ? 'bg-white' : 'bg-gradient-to-r from-orange-500 to-amber-500'
          }`}>
            {canWatch ? (
              <Play className="w-5 h-5 text-black ml-0.5 fill-current" />
            ) : (
              <Crown className="w-5 h-5 text-white" />
            )}
          </div>
        </div>

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {video.isNew && (
            <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-semibold px-2 py-1">
              NEW
            </Badge>
          )}
          {video.isTrending && (
            <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-semibold px-2 py-1 flex items-center gap-1">
              <TrendingUp className="w-2 h-2" />
              Trending
            </Badge>
          )}
      {getContentTypeBadge('video')}
        </div>

        {/* Duration & Access */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="bg-black/80 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
            <Clock className="w-2 h-2" />
            {video.duration}
          </div>
          {!canWatch && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-semibold px-2 py-1">
              <Crown className="w-2 h-2 mr-1" />
              Premium
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-5 space-y-4">
        {/* Category */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 text-xs font-medium">
            {video.category}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base text-gray-900 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
          {video.title}
        </h3>

        {/* Expert info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
            <img
              src={video.expertAvatar}
              alt={video.expert}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-gray-900 truncate">{video.expert}</div>
            <div className="text-xs text-gray-600 truncate">{video.expertCredentials}</div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {video.description}
        </p>

        {/* Stats & Action */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-current" />
              <span className="font-medium">{video.rating}</span>
            </div>
            <span className="text-xs">{video.views} views</span>
          </div>

          <div className="flex items-center gap-2">
            {!canWatch ? (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpgrade(video);
                }}
                className="text-amber-600 border-amber-300 hover:bg-amber-50 text-xs h-7 px-3"
              >
                <Crown className="w-2 h-2 mr-1" />
                Upgrade
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay(video);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary hover:bg-primary/90 text-xs h-7 px-3"
              >
                <Play className="w-2 h-2 mr-1" />
                View Details
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HybridVideoCard;