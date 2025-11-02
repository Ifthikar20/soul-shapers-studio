// src/components/Browse/HybridVideoCard.tsx - Amazon Prime-style card with hover modal
import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useVideoAccess } from '@/hooks/useVideoAccess';
import {
  Play, Crown, TrendingUp, Clock, Star, User
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
  const [showModal, setShowModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use accessTier to determine if video is accessible
  const canWatch = video.accessTier === 'free' || canWatchVideo(video);

  // Calculate modal position when hovering
  useEffect(() => {
    if (isHovered && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const modalWidth = 400;
      const modalHeight = 540; // Approximate modal height

      // For fixed positioning, use viewport coordinates from getBoundingClientRect
      // Center the modal horizontally over the card
      let left = rect.left + (rect.width - modalWidth) / 2;

      // Keep modal within viewport horizontally
      if (left + modalWidth > viewportWidth - 20) {
        left = viewportWidth - modalWidth - 20;
      }
      if (left < 20) {
        left = 20;
      }

      // Position modal slightly above the card
      let top = rect.top - 50;

      // Keep modal within viewport vertically
      if (top + modalHeight > viewportHeight - 20) {
        top = viewportHeight - modalHeight - 20;
      }
      if (top < 20) {
        top = 20;
      }

      setModalPosition({ top, left });

      // Delay showing modal
      hoverTimeoutRef.current = setTimeout(() => {
        setShowModal(true);
      }, 300);
    } else {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      setShowModal(false);
    }

    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [isHovered]);

  // Lock body scroll when modal is visible
  useEffect(() => {
    if (showModal) {
      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      // Prevent body scroll while keeping layout intact
      document.body.style.overflow = 'hidden';
      // Compensate for scrollbar width to prevent page resize
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      // Apply padding to all fixed elements to keep them stable
      const header = document.querySelector('header');
      if (header) {
        const headerContainer = header.querySelector('.max-w-7xl');
        if (headerContainer) {
          (headerContainer as HTMLElement).style.paddingRight = `${scrollbarWidth}px`;
        }
      }
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';

      // Restore header container padding
      const header = document.querySelector('header');
      if (header) {
        const headerContainer = header.querySelector('.max-w-7xl');
        if (headerContainer) {
          (headerContainer as HTMLElement).style.paddingRight = '';
        }
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';

      const header = document.querySelector('header');
      if (header) {
        const headerContainer = header.querySelector('.max-w-7xl');
        if (headerContainer) {
          (headerContainer as HTMLElement).style.paddingRight = '';
        }
      }
    };
  }, [showModal]);

  return (
    <div
      ref={cardRef}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={`cursor-pointer overflow-hidden border-0 rounded-xl transition-all duration-300 ease-out bg-transparent ${
          showModal
            ? 'opacity-0 scale-95'
            : 'opacity-100 scale-100'
        }`}
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

      {/* Clean Hover Modal */}
      {showModal && (
        <div
          className="fixed z-50 pointer-events-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            top: `${modalPosition.top}px`,
            left: `${modalPosition.left}px`,
            width: '400px',
            maxWidth: '90vw',
            animation: 'modalEntrance 0.25s ease-out',
          }}
        >
          <Card className="overflow-hidden rounded-2xl bg-white dark:bg-black border border-gray-200 dark:border-gray-700 shadow-xl">
            <style>{`
              @keyframes modalEntrance {
                0% {
                  opacity: 0;
                  transform: translateY(-10px) scale(0.95);
                }
                100% {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
              }
            `}</style>
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
                  className="rounded-full h-16 w-16 p-0 bg-white hover:bg-white text-black shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
                  onClick={(e) => {
                    e.stopPropagation();
                    canWatch ? onPlay(video) : onUpgrade(video);
                  }}
                >
                  {!canWatch ? (
                    <Crown className="w-7 h-7" />
                  ) : (
                    <Play className="w-7 h-7 fill-current ml-1" />
                  )}
                </Button>
              </div>

              {/* Duration Badge */}
              <div className="absolute bottom-3 right-3 bg-black/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-sm font-semibold">
                {video.duration}
              </div>
            </div>

            {/* Info Section */}
            <div className="p-5 space-y-3.5 bg-white dark:bg-black">
              {/* Title Section */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-xl leading-tight line-clamp-2 flex-1 text-gray-900 dark:text-white">
                  {video.title}
                </h3>
                {!canWatch && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm px-2.5 py-1 flex-shrink-0 font-semibold">
                    <Crown className="w-4 h-4 mr-1" />
                    PRO
                  </Badge>
                )}
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-3 text-base">
                <div className="flex items-center gap-1.5 text-yellow-500">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-bold text-gray-900 dark:text-white">{video.rating}</span>
                </div>
                <span className="text-gray-400 dark:text-gray-600">•</span>
                <span className="text-gray-700 dark:text-gray-300 font-medium">{video.views}</span>
                <span className="text-gray-400 dark:text-gray-600">•</span>
                <Badge variant="outline" className="text-sm px-2 py-0.5 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                  {video.category}
                </Badge>
              </div>

              {/* Expert Section */}
              <div className="flex items-center gap-2.5 text-base">
                <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">{video.expert}</span>
              </div>

              {/* Description */}
              {video.description && (
                <p className="text-base text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {video.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-2">
                {!canWatch ? (
                  <Button
                    size="lg"
                    variant="default"
                    className="w-full h-11 font-semibold text-base rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpgrade(video);
                    }}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Watch
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    variant="default"
                    className="w-full h-11 font-semibold text-base rounded-xl transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlay(video);
                    }}
                  >
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    Watch Now
                  </Button>
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