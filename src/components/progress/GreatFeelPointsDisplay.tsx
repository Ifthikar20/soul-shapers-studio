// ============================================
// FILE: src/components/progress/GreatFeelPointsDisplay.tsx
// Great Feel Points Display Component for Header
// ============================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, X, Play, Music, Video } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGreatFeelPoints } from '@/contexts/GreatFeelPointsContext';

interface GreatFeelPointsDisplayProps {
  className?: string;
}

const GreatFeelPointsDisplay: React.FC<GreatFeelPointsDisplayProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const { points, isAnimating } = useGreatFeelPoints();
  const [displayPoints, setDisplayPoints] = useState(points);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [showHowToEarn, setShowHowToEarn] = useState(false);

  // Animate counter when points change
  useEffect(() => {
    if (points > displayPoints) {
      const increment = Math.ceil((points - displayPoints) / 10);
      const timer = setInterval(() => {
        setDisplayPoints((prev) => {
          const next = prev + increment;
          if (next >= points) {
            clearInterval(timer);
            return points;
          }
          return next;
        });
      }, 50);

      return () => clearInterval(timer);
    } else {
      setDisplayPoints(points);
    }
  }, [points, displayPoints]);

  // Create sparkle animation when earning points
  useEffect(() => {
    if (isAnimating) {
      const newSparkles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
      }));
      setSparkles(newSparkles);

      const timer = setTimeout(() => {
        setSparkles([]);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const handleClick = () => {
    setShowHowToEarn(true);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={handleClick}
            className={`
              relative flex items-center gap-2 px-3 py-1.5 rounded-full
              bg-gradient-to-r from-purple-500/10 to-indigo-500/10
              border border-purple-500/20
              hover:border-purple-500/40 transition-all duration-300
              cursor-pointer
              ${isAnimating ? 'scale-110 shadow-lg' : 'scale-100'}
              ${className}
            `}
          >
            {/* Sparkles flying animation */}
            {sparkles.map((sparkle) => (
              <div
                key={sparkle.id}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  animation: `flyToCounter 1s ease-out forwards`,
                }}
              >
                <Sparkles
                  className="w-4 h-4 text-yellow-400 animate-pulse"
                  style={{
                    transform: `translate(${sparkle.x}px, ${sparkle.y}px)`,
                    opacity: 0,
                  }}
                />
              </div>
            ))}

            <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                {displayPoints.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">pts</span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-semibold">Great Feel Points: {points.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">
              Earned from watching videos & audio
            </p>
            <p className="text-xs text-muted-foreground italic">Click to learn how to earn more</p>
          </div>
        </TooltipContent>
      </Tooltip>

      {/* CSS for sparkle animation */}
      <style>{`
        @keyframes flyToCounter {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(0, 0) scale(1.5);
            opacity: 0;
          }
        }
      `}</style>

      {/* How to Earn Points Modal */}
      <Dialog open={showHowToEarn} onOpenChange={setShowHowToEarn}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              How to Earn Great Feel Points
            </DialogTitle>
            <DialogDescription>
              Accumulate points by engaging with our wellness content
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Current Points Display */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Your Total Points</span>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {points.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Ways to Earn */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Ways to Earn Points:</h4>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
                  <Video className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900 dark:text-white">Watch Meditation Videos</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Earn 10 points per meditation session</p>
                </div>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">+10 pts</span>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900">
                  <Music className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900 dark:text-white">Listen to Audio Content</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Earn points for wellness audio sessions</p>
                </div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">+10 pts</span>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
                  <Play className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900 dark:text-white">Complete Activities</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Engage with wellness exercises and practices</p>
                </div>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">+10 pts</span>
              </div>
            </div>

            {/* Tip */}
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-900 dark:text-blue-100">
                <span className="font-semibold">💡 Tip:</span> Points are awarded automatically after 3 seconds of engagement with content!
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowHowToEarn(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setShowHowToEarn(false);
                navigate('/meditate');
              }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Start Earning Points
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default GreatFeelPointsDisplay;
