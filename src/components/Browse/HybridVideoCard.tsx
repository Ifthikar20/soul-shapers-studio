// src/components/Browse/HybridVideoCard.tsx - Amazon Prime-style card with hover modal
import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useVideoAccess } from '@/hooks/useVideoAccess';
import {
  Play, Crown, TrendingUp, Clock, Star, User, ThumbsUp
} from 'lucide-react';
import { VideoContent } from '@/types/video.types';

interface HybridVideoCardProps {
  video: VideoContent;
  onPlay: (video: VideoContent) => void;
  onUpgrade: (video: VideoContent) => void;
}

const HybridVideoCard = ({ video, onPlay, onUpgrade }: HybridVideoCardProps) => {
  const { canWatchVideo } = useVideoAccess();
  const [isHovered, setIsHovered] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Use accessTier to determine if video is accessible
  const canWatch = video.accessTier === 'free' || canWatchVideo(video);

  // Calculate modal position when hovering
  useEffect(() => {
    if (isHovered && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const modalWidth = 400;
      const modalHeight = 500; // Approximate modal height

      // Determine horizontal position
      let left = rect.left;
      if (rect.left + modalWidth > viewportWidth) {
        // Too close to right edge, align right
        left = rect.right - modalWidth;
      } else if (rect.left < 0) {
        // Too close to left edge, align left
        left = 0;
      }

      // Determine vertical position
      let top = rect.top - 50; // Slightly above the card
      if (top + modalHeight > viewportHeight) {
        // Would overflow bottom, position above or center
        top = Math.max(10, viewportHeight - modalHeight - 10);
      }
      if (top < 10) {
        top = 10; // Minimum top padding
      }

      setModalPosition({ top, left });
    }
  }, [isHovered]);

  return (
    <div
      ref={cardRef}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className="cursor-pointer overflow-hidden border-0 rounded-2xl transition-all duration-300 ease-in-out bg-transparent group-hover:opacity-0"
        onClick={() => canWatch ? onPlay(video) : onUpgrade(video)}
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-900">
          {/* Main Image */}
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />

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

          {/* Premium/Duration Badge - Top Right */}
          <div className="absolute top-3 right-3 z-10">
            {!canWatch ? (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] px-2 py-0.5 font-semibold shadow-lg">
                <Crown className="w-3 h-3 mr-1" />
                PRO
              </Badge>
            ) : (
              <div className="bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded-md text-[10px] font-medium flex items-center gap-1 shadow-lg">
                <Clock className="w-3 h-3" />
                {video.duration}
              </div>
            )}
          </div>

          {/* Bottom Section - Title, Category, Author & Views */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <Badge
              variant="secondary"
              className="bg-white/20 backdrop-blur-md text-white border-0 text-[10px] px-2 py-0.5 font-medium shadow-lg mb-2"
            >
              {video.category}
            </Badge>
            <h3 className="font-bold text-white text-base line-clamp-2 leading-tight drop-shadow-2xl mb-2">
              {video.title}
            </h3>
            {/* Author & Views - Always visible */}
            <div className="flex items-center gap-2 text-white/80 text-xs">
              <span className="font-medium">{video.expert}</span>
              <span className="text-white/50">•</span>
              <span>{video.views}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Amazon Prime-style Hover Modal */}
      {isHovered && (
        <div
          className="fixed z-50 pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
          style={{
            top: `${modalPosition.top}px`,
            left: `${modalPosition.left}px`,
            width: '400px',
            maxWidth: '90vw'
          }}
        >
          <Card className="overflow-hidden border-0 rounded-2xl shadow-2xl bg-card border-2 border-white/10">
            {/* Image Section */}
            <div className="relative aspect-video w-full overflow-hidden bg-gray-900">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="lg"
                  className="rounded-full h-14 w-14 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    canWatch ? onPlay(video) : onUpgrade(video);
                  }}
                >
                  {!canWatch ? (
                    <Crown className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 fill-current" />
                  )}
                </Button>
              </div>

              {/* Duration */}
              <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
                {video.duration}
              </div>
            </div>

            {/* Expanded Info Section */}
            <div className="p-4 space-y-3 bg-card">
              {/* Title */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-sm line-clamp-2 flex-1">
                  {video.title}
                </h3>
                {!canWatch && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] px-2 py-0.5 flex-shrink-0">
                    <Crown className="w-3 h-3 mr-1" />
                    PRO
                  </Badge>
                )}
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="font-semibold text-foreground">{video.rating}</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{video.views}</span>
                <span className="text-muted-foreground">•</span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {video.category}
                </Badge>
              </div>

              {/* Expert */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="w-3 h-3" />
                <span>{video.expert}</span>
              </div>

              {/* Description */}
              {video.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {video.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                {!canWatch ? (
                  <Button
                    size="sm"
                    variant="default"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpgrade(video);
                    }}
                  >
                    <Crown className="w-3 h-3 mr-1" />
                    Upgrade to Watch
                  </Button>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="default"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlay(video);
                      }}
                    >
                      <Play className="w-3 h-3 mr-1 fill-current" />
                      Watch Now
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default HybridVideoCard;