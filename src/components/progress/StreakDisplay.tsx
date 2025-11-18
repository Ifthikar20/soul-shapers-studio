// ============================================
// FILE: src/components/progress/StreakDisplay.tsx
// Streak Display Component for Header
// ============================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { progressService } from '@/services/progress.service';
import type { StreakData } from '@/types/progress.types';
import { getStreakEmoji } from '@/types/progress.types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface StreakDisplayProps {
  className?: string;
}

const StreakDisplay: React.FC<StreakDisplayProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStreak();
  }, []);

  const loadStreak = async () => {
    try {
      const data = await progressService.getStreak();
      setStreak(data);
    } catch (error) {
      console.error('Failed to load streak:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Skeleton className="h-8 w-20" />;
  }

  if (!streak || streak.currentStreak === 0) {
    return null;
  }

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
              flex items-center gap-2 px-3 py-1.5 rounded-full
              bg-gradient-to-r from-orange-500/10 to-red-500/10
              border border-orange-500/20
              hover:border-orange-500/40 transition-colors
              cursor-pointer
              ${className}
            `}
          >
            <span className="text-lg">{getStreakEmoji(streak.currentStreak)}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold">{streak.currentStreak}</span>
              <span className="text-xs text-muted-foreground">day{streak.currentStreak !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-semibold">Current Streak: {streak.currentStreak} days</p>
            <p className="text-sm text-muted-foreground">
              Longest Streak: {streak.longestStreak} days
            </p>
            {streak.isActive && (
              <p className="text-xs text-green-500">✓ Active today!</p>
            )}
            <p className="text-xs text-muted-foreground italic">Click to view progress</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default StreakDisplay;
