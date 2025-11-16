// ============================================
// FILE: src/components/progress/ContentPointsPreview.tsx
// Shows points/progress users will earn by completing content
// ============================================

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Zap,
  Clock,
  Flame,
  Target,
  Award,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

interface ContentPointsPreviewProps {
  contentType: 'video' | 'audio';
  durationMinutes: number;
  category?: string;
  isCompleted?: boolean;
  className?: string;
}

const ContentPointsPreview: React.FC<ContentPointsPreviewProps> = ({
  contentType,
  durationMinutes,
  category = 'General',
  isCompleted = false,
  className = '',
}) => {
  // Calculate points based on duration and content type
  const basePoints = Math.round(durationMinutes * 2); // 2 points per minute
  const bonusPoints = contentType === 'video' ? 5 : 3; // Bonus for completion
  const totalPoints = basePoints + bonusPoints;

  // Check which goals/badges this will help with
  const progressItems = [
    {
      icon: Zap,
      label: 'XP Points',
      value: `+${totalPoints}`,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      icon: Clock,
      label: contentType === 'video' ? 'Watch Time' : 'Listen Time',
      value: `+${durationMinutes}m`,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Flame,
      label: 'Daily Streak',
      value: 'Maintain',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: Target,
      label: 'Weekly Goal',
      value: 'Progress',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
  ];

  // Potential badges that could be unlocked
  const potentialBadges = getPotentialBadges(durationMinutes, contentType, category);

  if (isCompleted) {
    return (
      <Card className={`p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 ${className}`}>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          <div>
            <p className="font-semibold text-green-900 dark:text-green-100">
              Already Completed!
            </p>
            <p className="text-sm text-green-700 dark:text-green-300">
              You earned {totalPoints} XP from this session
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-5 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Complete this to earn:
            </h3>
          </div>
          <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
            {contentType === 'video' ? '🎥 Video' : '🎧 Audio'}
          </Badge>
        </div>

        {/* Progress Items Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {progressItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`flex flex-col items-center p-3 rounded-lg ${item.bgColor} transition-transform hover:scale-105`}
              >
                <Icon className={`w-5 h-5 mb-1.5 ${item.color}`} />
                <div className="text-center">
                  <div className={`text-lg font-bold ${item.color}`}>
                    {item.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Potential Badge Unlocks */}
        {potentialBadges.length > 0 && (
          <div className="pt-3 border-t border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-2">
              <Award className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  May unlock:
                </p>
                <div className="flex flex-wrap gap-2">
                  {potentialBadges.map((badge, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs border-purple-300 dark:border-purple-700 bg-white dark:bg-gray-900"
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Motivational Text */}
        <div className="text-center pt-2">
          <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
            💪 Keep up the great work on your wellness journey!
          </p>
        </div>
      </div>
    </Card>
  );
};

// Helper function to determine potential badge unlocks
function getPotentialBadges(
  durationMinutes: number,
  contentType: 'video' | 'audio',
  category: string
): string[] {
  const badges: string[] = [];

  // Check if this could unlock first session badge
  badges.push('🌱 Journey Begins');

  // Check meditation time badges
  if (contentType === 'audio' || category.toLowerCase().includes('meditation')) {
    if (durationMinutes >= 10) {
      badges.push('🧘 First Hour');
    }
  }

  // Streak badges
  badges.push('🔥 3-Day Warrior');

  // Limit to 3 badges to keep it clean
  return badges.slice(0, 3);
}

export default ContentPointsPreview;
