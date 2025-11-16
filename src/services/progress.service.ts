// ============================================
// FILE: src/services/progress.service.ts
// Progress Tracking Service
// ============================================

import axios, { AxiosInstance } from 'axios';
import type {
  ProgressSummary,
  UserStats,
  Badge,
  Goal,
  GoalCreateRequest,
  TrackActivityRequest,
  ActivityEntry,
  WeeklyProgress,
  CategoryStats,
  ExpertStats,
  StreakData,
  BADGE_DEFINITIONS,
} from '@/types/progress.types';
import { checkBadgeUnlock } from '@/types/progress.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Development mode - set to true to use mock data only (no backend calls)
const USE_MOCK_DATA = true; // TODO: Set to false when backend progress endpoints are ready

class ProgressService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    });
  }

  /**
   * Get complete progress summary for dashboard
   */
  async getProgressSummary(): Promise<ProgressSummary> {
    // Use mock data in development mode
    if (USE_MOCK_DATA) {
      return this.getMockProgressSummary();
    }

    try {
      const response = await this.api.get('/api/progress/summary');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch progress summary:', error);

      // Return mock data for development if backend not available
      if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        console.warn('⚠️ Progress API not available, using mock data');
        return this.getMockProgressSummary();
      }

      throw error;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<UserStats> {
    // Use mock data in development mode
    if (USE_MOCK_DATA) {
      return this.getMockUserStats();
    }

    try {
      const response = await this.api.get('/api/progress/stats');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch user stats:', error);

      if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        return this.getMockUserStats();
      }

      throw error;
    }
  }

  /**
   * Get user badges
   */
  async getBadges(): Promise<Badge[]> {
    // Use mock data in development mode
    if (USE_MOCK_DATA) {
      return this.getMockBadges();
    }

    try {
      const response = await this.api.get('/api/progress/badges');
      return response.data.badges;
    } catch (error: any) {
      console.error('Failed to fetch badges:', error);

      if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        return this.getMockBadges();
      }

      throw error;
    }
  }

  /**
   * Get user's streak data
   */
  async getStreak(): Promise<StreakData> {
    // Use mock data in development mode
    if (USE_MOCK_DATA) {
      return this.getMockStreak();
    }

    try {
      const response = await this.api.get('/api/progress/streak');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch streak:', error);

      if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        return this.getMockStreak();
      }

      throw error;
    }
  }

  /**
   * Get user goals
   */
  async getGoals(): Promise<Goal[]> {
    // Use mock data in development mode
    if (USE_MOCK_DATA) {
      return this.getMockGoals();
    }

    try {
      const response = await this.api.get('/api/progress/goals');
      return response.data.goals;
    } catch (error: any) {
      console.error('Failed to fetch goals:', error);

      if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        return this.getMockGoals();
      }

      throw error;
    }
  }

  /**
   * Create a new goal
   */
  async createGoal(goalData: GoalCreateRequest): Promise<Goal> {
    try {
      const response = await this.api.post('/api/progress/goals', goalData);
      return response.data.goal;
    } catch (error) {
      console.error('Failed to create goal:', error);
      throw error;
    }
  }

  /**
   * Update goal progress
   */
  async updateGoal(goalId: string, current: number): Promise<Goal> {
    try {
      const response = await this.api.patch(`/api/progress/goals/${goalId}`, {
        current,
      });
      return response.data.goal;
    } catch (error) {
      console.error('Failed to update goal:', error);
      throw error;
    }
  }

  /**
   * Delete a goal
   */
  async deleteGoal(goalId: string): Promise<void> {
    try {
      await this.api.delete(`/api/progress/goals/${goalId}`);
    } catch (error) {
      console.error('Failed to delete goal:', error);
      throw error;
    }
  }

  /**
   * Track user activity (video watched, meditation completed, etc.)
   */
  async trackActivity(activityData: TrackActivityRequest): Promise<void> {
    // Skip tracking in development mode
    if (USE_MOCK_DATA) {
      console.log('📊 [Mock Mode] Activity tracked:', activityData.activityType);
      return;
    }

    try {
      await this.api.post('/api/progress/activity', activityData);
      console.log('✅ Activity tracked:', activityData.activityType);
    } catch (error) {
      console.error('Failed to track activity:', error);
      // Don't throw - tracking failures shouldn't break the app
    }
  }

  /**
   * Get weekly progress data
   */
  async getWeeklyProgress(): Promise<WeeklyProgress> {
    // Use mock data in development mode
    if (USE_MOCK_DATA) {
      return this.getMockWeeklyProgress();
    }

    try {
      const response = await this.api.get('/api/progress/weekly');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch weekly progress:', error);

      if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        return this.getMockWeeklyProgress();
      }

      throw error;
    }
  }

  /**
   * Get category statistics
   */
  async getCategoryStats(): Promise<CategoryStats[]> {
    // Use mock data in development mode
    if (USE_MOCK_DATA) {
      return this.getMockCategoryStats();
    }

    try {
      const response = await this.api.get('/api/progress/categories');
      return response.data.categories;
    } catch (error: any) {
      console.error('Failed to fetch category stats:', error);

      if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        return this.getMockCategoryStats();
      }

      throw error;
    }
  }

  /**
   * Get expert statistics
   */
  async getExpertStats(): Promise<ExpertStats[]> {
    // Use mock data in development mode
    if (USE_MOCK_DATA) {
      return this.getMockExpertStats();
    }

    try {
      const response = await this.api.get('/api/progress/experts');
      return response.data.experts;
    } catch (error: any) {
      console.error('Failed to fetch expert stats:', error);

      if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        return this.getMockExpertStats();
      }

      throw error;
    }
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(limit: number = 10): Promise<ActivityEntry[]> {
    // Use mock data in development mode
    if (USE_MOCK_DATA) {
      return this.getMockActivity();
    }

    try {
      const response = await this.api.get(`/api/progress/activity?limit=${limit}`);
      return response.data.activities;
    } catch (error: any) {
      console.error('Failed to fetch recent activity:', error);

      if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        return this.getMockActivity();
      }

      throw error;
    }
  }

  // ========================================
  // MOCK DATA FOR DEVELOPMENT
  // ========================================

  private getMockUserStats(): UserStats {
    const joinedDate = new Date();
    joinedDate.setMonth(joinedDate.getMonth() - 2);

    // Calculate XP based on activity
    const totalMinutes = 247 + 523 + 189; // meditation + video + audio
    const sessionsXP = 54 * 10; // 10 XP per session
    const minutesXP = totalMinutes * 2; // 2 XP per minute
    const coursesXP = 3 * 50; // 50 XP per course completed
    const totalXP = sessionsXP + minutesXP + coursesXP;

    // Calculate level (every 500 XP = 1 level)
    const level = Math.floor(totalXP / 500) + 1;
    const xpToNextLevel = 500 - (totalXP % 500);

    return {
      // Points & Level
      totalXP,
      level,
      xpToNextLevel,

      totalMeditationMinutes: 247,
      totalVideoMinutes: 523,
      totalAudioMinutes: 189,
      totalBreathingSessions: 12,
      coursesCompleted: 3,
      videosCompleted: 18,
      audioCompleted: 24,
      totalSessions: 54,
      averageSessionLength: 12,
      favoriteCategory: 'Meditation & Mindfulness',
      mostWatchedExpert: 'Dr. Sarah Chen',
      totalBreaths: 1247,
      joinedDate: joinedDate.toISOString(),
      lastActiveDate: new Date().toISOString(),
      streak: this.getMockStreak(),
    };
  }

  private getMockStreak(): StreakData {
    return {
      currentStreak: 5,
      longestStreak: 12,
      lastActivityDate: new Date().toISOString(),
      weeklyStreak: 1,
      isActive: true,
    };
  }

  private getMockBadges(): Badge[] {
    const badges = (BADGE_DEFINITIONS as any[]).map(def => ({
      ...def,
      isUnlocked: false,
      progress: 0,
    }));

    // Unlock some badges based on mock stats
    const stats = this.getMockUserStats();

    badges.forEach(badge => {
      switch (badge.id) {
        case 'streak_3':
          badge.isUnlocked = stats.streak.currentStreak >= 3;
          badge.progress = Math.min(100, (stats.streak.currentStreak / 3) * 100);
          if (badge.isUnlocked) badge.earnedAt = new Date().toISOString();
          break;
        case 'streak_7':
          badge.progress = Math.min(100, (stats.streak.currentStreak / 7) * 100);
          break;
        case 'meditation_60':
          badge.isUnlocked = stats.totalMeditationMinutes >= 60;
          badge.progress = Math.min(100, (stats.totalMeditationMinutes / 60) * 100);
          if (badge.isUnlocked) badge.earnedAt = new Date().toISOString();
          break;
        case 'meditation_300':
          badge.progress = Math.min(100, (stats.totalMeditationMinutes / 300) * 100);
          break;
        case 'course_1':
          badge.isUnlocked = stats.coursesCompleted >= 1;
          badge.progress = Math.min(100, (stats.coursesCompleted / 1) * 100);
          if (badge.isUnlocked) badge.earnedAt = new Date().toISOString();
          break;
        case 'course_5':
          badge.progress = Math.min(100, (stats.coursesCompleted / 5) * 100);
          break;
        case 'first_session':
          badge.isUnlocked = stats.totalSessions >= 1;
          badge.progress = 100;
          if (badge.isUnlocked) badge.earnedAt = new Date().toISOString();
          break;
        case 'sessions_10':
          badge.isUnlocked = stats.totalSessions >= 10;
          badge.progress = Math.min(100, (stats.totalSessions / 10) * 100);
          if (badge.isUnlocked) badge.earnedAt = new Date().toISOString();
          break;
        case 'sessions_50':
          badge.progress = Math.min(100, (stats.totalSessions / 50) * 100);
          break;
      }
    });

    return badges;
  }

  private getMockGoals(): Goal[] {
    return [
      {
        id: '1',
        type: 'weekly_sessions',
        name: 'Weekly Practice Goal',
        description: 'Complete 5 meditation sessions this week',
        target: 5,
        current: 3,
        unit: 'sessions',
        isCompleted: false,
        createdAt: new Date().toISOString(),
        icon: '🎯',
        color: 'blue',
      },
      {
        id: '2',
        type: 'meditation_minutes',
        name: 'Meditation Marathon',
        description: 'Meditate for 60 minutes this week',
        target: 60,
        current: 42,
        unit: 'minutes',
        isCompleted: false,
        createdAt: new Date().toISOString(),
        icon: '⏱️',
        color: 'purple',
      },
      {
        id: '3',
        type: 'streak_days',
        name: 'Build Your Streak',
        description: 'Maintain a 7-day meditation streak',
        target: 7,
        current: 5,
        unit: 'days',
        isCompleted: false,
        createdAt: new Date().toISOString(),
        icon: '🔥',
        color: 'orange',
      },
    ];
  }

  private getMockWeeklyProgress(): WeeklyProgress {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const minutesMeditated = i === 0 ? 0 : Math.floor(Math.random() * 30);

      days.push({
        date: date.toISOString().split('T')[0],
        minutesMeditated,
        sessionsCompleted: minutesMeditated > 0 ? Math.floor(minutesMeditated / 10) : 0,
        hasActivity: minutesMeditated > 0,
      });
    }

    const totalMinutes = days.reduce((sum, day) => sum + day.minutesMeditated, 0);
    const totalSessions = days.reduce((sum, day) => sum + day.sessionsCompleted, 0);

    return {
      week: today.toISOString().split('T')[0],
      days,
      totalMinutes,
      totalSessions,
      goalProgress: Math.min(100, (totalMinutes / 60) * 100),
    };
  }

  private getMockCategoryStats(): CategoryStats[] {
    return [
      {
        categoryName: 'Meditation & Mindfulness',
        minutesWatched: 247,
        videosWatched: 15,
        percentage: 40,
      },
      {
        categoryName: 'Anxiety & Stress',
        minutesWatched: 185,
        videosWatched: 12,
        percentage: 30,
      },
      {
        categoryName: 'Sleep & Rest',
        minutesWatched: 123,
        videosWatched: 8,
        percentage: 20,
      },
      {
        categoryName: 'Personal Growth',
        minutesWatched: 62,
        videosWatched: 4,
        percentage: 10,
      },
    ];
  }

  private getMockExpertStats(): ExpertStats[] {
    return [
      {
        expertName: 'Dr. Sarah Chen',
        minutesWatched: 215,
        videosWatched: 12,
        percentage: 35,
      },
      {
        expertName: 'Michael Rodriguez',
        minutesWatched: 178,
        videosWatched: 10,
        percentage: 29,
      },
      {
        expertName: 'Dr. Emily Watson',
        minutesWatched: 142,
        videosWatched: 8,
        percentage: 23,
      },
      {
        expertName: 'James Kumar',
        minutesWatched: 82,
        videosWatched: 5,
        percentage: 13,
      },
    ];
  }

  private getMockActivity(): ActivityEntry[] {
    const now = new Date();
    return [
      {
        id: '1',
        userId: 'user-1',
        activityType: 'video_watched',
        contentId: 'v1',
        contentTitle: 'Introduction to Mindfulness Meditation',
        durationMinutes: 15,
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        userId: 'user-1',
        activityType: 'meditation_session',
        durationMinutes: 10,
        timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        userId: 'user-1',
        activityType: 'audio_completed',
        contentId: 'a1',
        contentTitle: 'Deep Sleep Meditation',
        durationMinutes: 20,
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        userId: 'user-1',
        activityType: 'badge_earned',
        metadata: { badgeId: 'streak_3', badgeName: '3-Day Warrior' },
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '5',
        userId: 'user-1',
        activityType: 'course_completed',
        contentId: 'c1',
        contentTitle: 'Anxiety Management Fundamentals',
        timestamp: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }

  private getMockProgressSummary(): ProgressSummary {
    return {
      stats: this.getMockUserStats(),
      badges: this.getMockBadges(),
      goals: this.getMockGoals(),
      recentActivity: this.getMockActivity(),
      weeklyProgress: this.getMockWeeklyProgress(),
    };
  }
}

export const progressService = new ProgressService();
