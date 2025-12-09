// ============================================
// FILE: src/components/progress/GreatFeelPointsDisplay.tsx
// Great Feel Points Display Component for Header
// ============================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useGreatFeelPoints } from '@/contexts/GreatFeelPointsContext';

interface GreatFeelPointsDisplayProps {
  className?: string;
}

const GreatFeelPointsDisplay: React.FC<GreatFeelPointsDisplayProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const { points, isAnimating } = useGreatFeelPoints();
  const [displayPoints, setDisplayPoints] = useState(points);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);

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
    navigate('/progress');
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
            <p className="text-xs text-muted-foreground italic">Click to view progress</p>
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
    </TooltipProvider>
  );
};

export default GreatFeelPointsDisplay;
