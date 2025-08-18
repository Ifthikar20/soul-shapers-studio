import { memo } from "react";
import { 
  Play, Clock, User, Star, TrendingUp, Bookmark, 
  Lock, Crown
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
  const accessMessage = getAccessMessage(video);
  const isLocked = !canWatch;

  return (
    <Card className="cursor-pointer group overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl">
      <div className="relative">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-52 object-cover group-hover:scale-110 transition-all duration-500"
        />
        
        {/* Lock Overlay for Premium Content */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center text-white">
              <Lock className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Premium Content</p>
            </div>
          </div>
        )}
        
        {/* Hover Play Overlay */}
        <div 
          onClick={() => onPlay(video)}
          className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer"
        >
          <div className={`rounded-full p-4 backdrop-blur-sm shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300 ${
            isLocked ? 'bg-orange-500/90' : 'bg-white/20'
          }`}>
            {isLocked ? (
              <Crown className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white" />
            )}
          </div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {video.isNew && (
            <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white border-0 rounded-full px-3 py-1 text-xs font-medium">
              New
            </Badge>
          )}
          {video.isTrending && (
            <Badge className="bg-white/90 text-primary border-0 rounded-full px-3 py-1 text-xs font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              Trending
            </Badge>
          )}
          {video.isFirstEpisode && (
            <Badge className="bg-green-500 text-white border-0 rounded-full px-3 py-1 text-xs font-medium">
              Free Episode
            </Badge>
          )}
          {video.accessTier === 'premium' && !video.isFirstEpisode && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 rounded-full px-3 py-1 text-xs font-medium">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>
        
        <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center backdrop-blur-sm">
          <Clock className="w-3 h-3 mr-1" />
          {video.duration}
        </div>

        <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white transform translate-y-2 group-hover:translate-y-0">
          <Bookmark className="w-4 h-4 text-primary" />
        </button>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-3">
          <Badge variant="secondary" className="text-xs rounded-full px-3 py-1">
            {video.category}
          </Badge>
        </div>
        
        <h3 className="font-bold text-lg text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
          {video.title}
        </h3>
        
        <div className="flex items-center text-muted-foreground text-sm mb-4">
          <User className="w-4 h-4 mr-2" />
          <span className="font-medium">{video.expert}</span>
        </div>

        {/* Access Message for Locked Content */}
        {isLocked && (
          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-orange-700 text-sm font-medium">{accessMessage}</p>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Star className="w-4 h-4 mr-1 text-yellow-500" />
            <span className="font-medium">{video.rating}</span>
            <span className="mx-2">•</span>
            <span>{video.views} views</span>
          </div>
          
          {isLocked ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onUpgrade(video)}
              className="text-orange-600 border-orange-200 hover:bg-orange-50 rounded-full"
            >
              <Crown className="w-4 h-4 mr-1" />
              Upgrade
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onPlay(video)}
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-primary hover:bg-primary/10 rounded-full"
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