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
      const modalWidth = 440;
      const modalHeight = 580; // Approximate modal height with new styling

      // Determine horizontal position with smart centering
      let left = rect.left - (modalWidth - rect.width) / 2;
      if (left + modalWidth > viewportWidth - 30) {
        // Too close to right edge
        left = Math.max(30, viewportWidth - modalWidth - 30);
      } else if (left < 30) {
        // Too close to left edge
        left = 30;
      }

      // Determine vertical position
      let top = rect.top - 60; // Slightly above the card
      if (top + modalHeight > viewportHeight - 30) {
        // Would overflow bottom
        top = Math.max(30, viewportHeight - modalHeight - 30);
      }
      if (top < 30) {
        top = 30; // Minimum top padding
      }

      setModalPosition({ top, left });

      // Delay showing modal for smoother, more intentional experience
      hoverTimeoutRef.current = setTimeout(() => {
        setShowModal(true);
      }, 350);
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

  return (
    <div
      ref={cardRef}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={`cursor-pointer overflow-hidden border-0 rounded-xl transition-all duration-700 bg-transparent ${
          showModal
            ? 'opacity-0 scale-90 blur-sm'
            : 'opacity-100 scale-100 blur-0'
        }`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        onClick={() => canWatch ? onPlay(video) : onUpgrade(video)}
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-900">
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

      {/* Premium Professional Hover Modal */}
      {showModal && (
        <div
          className="fixed z-50 pointer-events-auto"
          style={{
            top: `${modalPosition.top}px`,
            left: `${modalPosition.left}px`,
            width: '440px',
            maxWidth: '90vw',
            animation: 'modalEntrance 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <Card className="overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 group/modal relative">
            {/* Enhanced shadow layers */}
            <div className="absolute inset-0 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]" />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5 dark:ring-white/5" />

            <style>{`
              @keyframes modalEntrance {
                0% {
                  opacity: 0;
                  transform: translateY(-20px) scale(0.92);
                  filter: blur(4px);
                }
                50% {
                  opacity: 0.8;
                  filter: blur(2px);
                }
                100% {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                  filter: blur(0);
                }
              }

              @keyframes contentFadeIn {
                0% {
                  opacity: 0;
                  transform: translateY(10px);
                }
                100% {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>

            <div className="relative z-10">
            {/* Image Section */}
            <div className="relative aspect-video w-full overflow-hidden bg-gray-900">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

              {/* Premium Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="relative"
                  style={{ animation: 'contentFadeIn 0.5s ease-out 0.2s both' }}
                >
                  {/* Glowing ring effect */}
                  <div className="absolute inset-0 rounded-full bg-white/20 blur-xl scale-150 animate-pulse" />

                  <Button
                    size="lg"
                    className="relative rounded-full h-20 w-20 p-0 bg-white hover:bg-white text-black shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] active:scale-95"
                    onClick={(e) => {
                      e.stopPropagation();
                      canWatch ? onPlay(video) : onUpgrade(video);
                    }}
                  >
                    {!canWatch ? (
                      <Crown className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8 fill-current ml-1" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Duration Badge */}
              <div
                className="absolute bottom-4 right-4 bg-black/95 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg border border-white/10"
                style={{ animation: 'contentFadeIn 0.5s ease-out 0.15s both' }}
              >
                {video.duration}
              </div>
            </div>

            {/* Premium Info Section */}
            <div
              className="p-6 space-y-4 bg-white dark:bg-gray-900"
              style={{ animation: 'contentFadeIn 0.5s ease-out 0.25s both' }}
            >
              {/* Title Section */}
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-bold text-lg leading-snug line-clamp-2 flex-1 text-gray-900 dark:text-white tracking-tight">
                  {video.title}
                </h3>
                {!canWatch && (
                  <Badge className="bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 text-white text-xs px-3 py-1 flex-shrink-0 font-bold shadow-lg">
                    <Crown className="w-3.5 h-3.5 mr-1.5" />
                    PRO
                  </Badge>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

              {/* Stats Row with Premium Styling */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-bold text-gray-900 dark:text-white">{video.rating}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <span>{video.views}</span>
                </div>
                <Badge variant="outline" className="text-xs px-2.5 py-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold">
                  {video.category}
                </Badge>
              </div>

              {/* Expert Section */}
              <div className="flex items-center gap-2.5 text-sm">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Expert</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{video.expert}</span>
                </div>
              </div>

              {/* Description */}
              {video.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                  {video.description}
                </p>
              )}

              {/* Premium Action Buttons */}
              <div className="flex gap-3 pt-3">
                {!canWatch ? (
                  <Button
                    size="lg"
                    variant="default"
                    className="flex-1 h-12 font-bold text-base rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 hover:from-amber-600 hover:via-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpgrade(video);
                    }}
                  >
                    <Crown className="w-5 h-5 mr-2" />
                    Upgrade to Watch
                  </Button>
                ) : (
                  <>
                    <Button
                      size="lg"
                      variant="default"
                      className="flex-1 h-12 font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlay(video);
                      }}
                    >
                      <Play className="w-5 h-5 mr-2 fill-current" />
                      Watch Now
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-12 w-12 p-0 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110 active:scale-95 hover:border-gray-400 dark:hover:border-gray-500"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ThumbsUp className="w-5 h-5" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default HybridVideoCard;