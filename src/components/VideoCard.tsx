import { memo } from "react";
import { 
  Play, Clock, User, Star, TrendingUp, Crown
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useVideoAccess } from '@/hooks/useVideoAccess';
import { VideoContent } from '@/types/video.types';

interface VideoCardProps {
  video: VideoContent;
  videos: VideoContent[];
  onPlay: (video: VideoContent) => void;
  onUpgrade: (video: VideoContent) => void;
}

const VideoCard = memo(({ video, videos, onPlay, onUpgrade }: VideoCardProps) => {
  const { canWatchVideo, getAccessMessage } = useVideoAccess();
  
  const canWatch = canWatchVideo(video, videos);
  const isLocked = !canWatch;

  return (
    <Card className="cursor-pointer group overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="relative">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-44 object-cover"
        />
        
        {/* Play Overlay */}
        <div 
          onClick={() => onPlay(video)}
          className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
        >
          <div className="rounded-full p-3 bg-white/90 shadow-lg">
            {isLocked ? (
              <Crown className="w-5 h-5 text-orange-500" />
            ) : (
              <Play className="w-5 h-5 text-primary" />
            )}
          </div>
        </div>
        
        {/* Essential Badges Only */}
        <div className="absolute top-2 left-2 flex gap-1">
          {video.isNew && (
            <Badge className="bg-primary text-white text-xs px-2 py-1">
              New
            </Badge>
          )}
          {video.isTrending && (
            <Badge variant="secondary" className="text-xs px-2 py-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              Hot
            </Badge>
          )}
          {video.accessTier === 'premium' && !video.isFirstEpisode && (
            <Badge className="bg-orange-500 text-white text-xs px-2 py-1">
              <Crown className="w-3 h-3 mr-1" />
              Pro
            </Badge>
          )}
        </div>
        
        {/* Duration */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
          {video.duration}
        </div>
      </div>
      
      <CardContent className="p-3">
        {/* Category */}
        <Badge variant="outline" className="text-xs mb-2">
          {video.category}
        </Badge>
        
        {/* Title */}
        <h3 className="font-semibold text-sm text-foreground mb-2 line-clamp-2 leading-tight">
          {video.title}
        </h3>
        
        {/* Expert */}
        <div className="flex items-center text-muted-foreground text-xs mb-2">
          <User className="w-3 h-3 mr-1" />
          <span className="truncate">{video.expert}</span>
        </div>

        {/* Stats and Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-muted-foreground">
            <Star className="w-3 h-3 mr-1 text-yellow-500" />
            <span>{video.rating}</span>
            <span className="mx-2">•</span>
            <span>{video.views}</span>
          </div>
          
          {isLocked ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onUpgrade(video)}
              className="text-orange-600 border-orange-200 hover:bg-orange-50 text-xs px-3 py-1 h-7"
            >
              Upgrade
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onPlay(video)}
              className="text-primary hover:bg-primary/10 text-xs px-3 py-1 h-7"
            >
              Watch
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

VideoCard.displayName = 'VideoCard';

export default VideoCard;