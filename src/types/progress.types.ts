// ============================================
// FILE: src/types/progress.types.ts
// Progress Tracking & Gamification Types
// ============================================

/**
 * Badge/Achievement Types
 */
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name or emoji
  category: 'meditation' | 'streak' | 'completion' | 'milestone' | 'social';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  earnedAt?: string; // ISO date when unlocked
  progress?: number; // 0-100 percentage
  requirement: number; // What number triggers the badge
  isUnlocked: boolean;
}

/**
 * Streak Data
 */
export interface StreakData {
  currentStreak: number; // Current consecutive days
  longestStreak: number; // All-time longest streak
  lastActivityDate: string; // ISO date of last activity
  weeklyStreak: number; // Consecutive weeks
  isActive: boolean; // True if activity today
}

/**
 * User Statistics
 */
export interface UserStats {
  // Time-based stats
  totalMeditationMinutes: number;
  totalVideoMinutes: number;
  totalAudioMinutes: number;
  totalBreathingSessions: number;

  // Completion stats
  coursesCompleted: number;
  videosCompleted: number;
  audioCompleted: number;

  // Activity stats
  totalSessions: number;
  averageSessionLength: number; // in minutes

  // Favorites & Engagement
  favoriteCategory: string | null;
  mostWatchedExpert: string | null;
  totalBreaths: number;

  // Dates
  joinedDate: string;
  lastActiveDate: string;

  // Streak
  streak: StreakData;
}

/**
 * Goal Types
 */
export type GoalType = 'daily_meditation' | 'weekly_sessions' | 'complete_course' | 'meditation_minutes' | 'streak_days';

export interface Goal {
  id: string;
  type: GoalType;
  name: string;
  description: string;
  target: number; // Target value (e.g., 7 for 7 days)
  current: number; // Current progress
  unit: string; // 'minutes', 'sessions', 'days', 'courses'
  deadline?: string; // ISO date (optional)
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  icon: string;
  color: string;
}

/**
 * Activity Log Entry
 */
export interface ActivityEntry {
  id: string;
  userId: string;
  activityType: 'video_watched' | 'audio_completed' | 'meditation_session' | 'course_completed' | 'badge_earned';
  contentId?: string;
  contentTitle?: string;
  durationMinutes?: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

/**
 * Progress Summary for Dashboard
 */
export interface ProgressSummary {
  stats: UserStats;
  badges: Badge[];
  goals: Goal[];
  recentActivity: ActivityEntry[];
  weeklyProgress: WeeklyProgress;
}

/**
 * Weekly Progress Data
 */
export interface WeeklyProgress {
  week: string; // ISO week string
  days: {
    date: string;
    minutesMeditated: number;
    sessionsCompleted: number;
    hasActivity: boolean;
  }[];
  totalMinutes: number;
  totalSessions: number;
  goalProgress: number; // 0-100 percentage
}

/**
 * Category Statistics
 */
export interface CategoryStats {
  categoryName: string;
  minutesWatched: number;
  videosWatched: number;
  percentage: number; // Percentage of total time
}

/**
 * Expert Statistics
 */
export interface ExpertStats {
  expertName: string;
  minutesWatched: number;
  videosWatched: number;
  percentage: number;
}

/**
 * Achievement Unlock Notification
 */
export interface AchievementNotification {
  badge: Badge;
  message: string;
  timestamp: string;
  shown: boolean;
}

/**
 * Progress API Response Types
 */
export interface ProgressResponse {
  success: boolean;
  data: ProgressSummary;
  message?: string;
}

export interface GoalCreateRequest {
  type: GoalType;
  target: number;
  deadline?: string;
}

export interface TrackActivityRequest {
  activityType: 'video_watched' | 'audio_completed' | 'meditation_session';
  contentId?: string;
  contentTitle?: string;
  durationMinutes?: number;
}

/**
 * Badge Definitions
 */
export const BADGE_DEFINITIONS: Omit<Badge, 'earnedAt' | 'progress' | 'isUnlocked'>[] = [
  // Streak Badges
  {
    id: 'streak_3',
    name: '3-Day Warrior',
    description: 'Complete 3 consecutive days of meditation',
    icon: '🔥',
    category: 'streak',
    tier: 'bronze',
    requirement: 3,
  },
  {
    id: 'streak_7',
    name: 'Week Champion',
    description: 'Maintain a 7-day meditation streak',
    icon: '⚡',
    category: 'streak',
    tier: 'silver',
    requirement: 7,
  },
  {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Achieve a 30-day meditation streak',
    icon: '✨',
    category: 'streak',
    tier: 'gold',
    requirement: 30,
  },
  {
    id: 'streak_100',
    name: 'Centurion',
    description: 'Reach a legendary 100-day streak',
    icon: '👑',
    category: 'streak',
    tier: 'platinum',
    requirement: 100,
  },

  // Meditation Time Badges
  {
    id: 'meditation_60',
    name: 'First Hour',
    description: 'Complete 60 minutes of meditation',
    icon: '🧘',
    category: 'meditation',
    tier: 'bronze',
    requirement: 60,
  },
  {
    id: 'meditation_300',
    name: 'Meditation Devotee',
    description: 'Meditate for 5 hours total',
    icon: '🌸',
    category: 'meditation',
    tier: 'silver',
    requirement: 300,
  },
  {
    id: 'meditation_1000',
    name: 'Zen Master',
    description: 'Accumulate 1000 minutes of meditation',
    icon: '🕉️',
    category: 'meditation',
    tier: 'gold',
    requirement: 1000,
  },
  {
    id: 'meditation_5000',
    name: 'Enlightened One',
    description: 'Reach 5000 minutes of meditation',
    icon: '☯️',
    category: 'meditation',
    tier: 'platinum',
    requirement: 5000,
  },

  // Course Completion Badges
  {
    id: 'course_1',
    name: 'Course Starter',
    description: 'Complete your first course',
    icon: '📚',
    category: 'completion',
    tier: 'bronze',
    requirement: 1,
  },
  {
    id: 'course_5',
    name: 'Knowledge Seeker',
    description: 'Complete 5 courses',
    icon: '🎓',
    category: 'completion',
    tier: 'silver',
    requirement: 5,
  },
  {
    id: 'course_10',
    name: 'Scholar',
    description: 'Complete 10 courses',
    icon: '📖',
    category: 'completion',
    tier: 'gold',
    requirement: 10,
  },
  {
    id: 'course_25',
    name: 'Wisdom Keeper',
    description: 'Complete 25 courses',
    icon: '🏆',
    category: 'completion',
    tier: 'platinum',
    requirement: 25,
  },

  // Milestone Badges
  {
    id: 'first_session',
    name: 'Journey Begins',
    description: 'Complete your first meditation session',
    icon: '🌱',
    category: 'milestone',
    tier: 'bronze',
    requirement: 1,
  },
  {
    id: 'sessions_10',
    name: 'Consistent Practitioner',
    description: 'Complete 10 meditation sessions',
    icon: '🌿',
    category: 'milestone',
    tier: 'bronze',
    requirement: 10,
  },
  {
    id: 'sessions_50',
    name: 'Dedicated Soul',
    description: 'Complete 50 meditation sessions',
    icon: '🌳',
    category: 'milestone',
    tier: 'silver',
    requirement: 50,
  },
  {
    id: 'sessions_100',
    name: 'Mindfulness Veteran',
    description: 'Complete 100 meditation sessions',
    icon: '🌲',
    category: 'milestone',
    tier: 'gold',
    requirement: 100,
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Meditate before 8 AM',
    icon: '🌅',
    category: 'milestone',
    tier: 'bronze',
    requirement: 1,
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Meditate after 10 PM',
    icon: '🌙',
    category: 'milestone',
    tier: 'bronze',
    requirement: 1,
  },
];

/**
 * Helper Functions
 */
export function calculateProgress(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

export function checkBadgeUnlock(badgeId: string, currentValue: number): boolean {
  const badge = BADGE_DEFINITIONS.find(b => b.id === badgeId);
  if (!badge) return false;
  return currentValue >= badge.requirement;
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function getStreakEmoji(streak: number): string {
  if (streak === 0) return '💤';
  if (streak < 3) return '🔥';
  if (streak < 7) return '⚡';
  if (streak < 30) return '✨';
  if (streak < 100) return '💎';
  return '👑';
}

export function getBadgeColor(tier: Badge['tier']): string {
  const colors = {
    bronze: 'bg-amber-600',
    silver: 'bg-gray-400',
    gold: 'bg-yellow-500',
    platinum: 'bg-purple-500',
  };
  return colors[tier];
}
