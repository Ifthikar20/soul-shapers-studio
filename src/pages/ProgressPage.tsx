// ============================================
// FILE: src/pages/ProgressPage.tsx
// Progress Dashboard Page
// ============================================

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { progressService } from '@/services/progress.service';
import type { ProgressSummary } from '@/types/progress.types';
import { formatMinutes, getStreakEmoji } from '@/types/progress.types';
import {
  Trophy,
  Flame,
  Target,
  TrendingUp,
  Clock,
  BookOpen,
  Headphones,
  Brain,
  Award,
  Calendar,
  Activity,
  Zap,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import PageLayout from '@/components/layout/PageLayout';

const ProgressPage: React.FC = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      const data = await progressService.getProgressSummary();
      setProgress(data);
    } catch (err: any) {
      console.error('Failed to load progress:', err);
      setError(err.message || 'Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </PageLayout>
    );
  }

  if (error || !progress) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-500">Failed to load progress data</p>
            <button
              onClick={loadProgressData}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const { stats, badges, goals, recentActivity, weeklyProgress } = progress;
  const unlockedBadges = badges.filter(b => b.isUnlocked);
  const inProgressBadges = badges.filter(b => !b.isUnlocked && (b.progress || 0) > 0);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {user?.name ? `Welcome back, ${user.name.split(' ')[0]}! 👋` : 'Your Progress'}
          </h1>
          <p className="text-muted-foreground">
            {user?.name
              ? "Here's your wellness journey progress"
              : 'Track your meditation journey and celebrate your achievements'
            }
          </p>
        </div>

        {/* Level & XP Card */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold border-2 border-white/30">
                {stats.level}
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">Level {stats.level}</h2>
                <p className="text-white/90">
                  {stats.totalXP.toLocaleString()} Total XP
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80 mb-2">Next Level</p>
              <div className="flex items-center gap-2">
                <Progress
                  value={((500 - stats.xpToNextLevel) / 500) * 100}
                  className="h-2 w-32 bg-white/20"
                />
                <span className="text-sm font-semibold">{stats.xpToNextLevel} XP</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Streak Card */}
          <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-500" />
                <h3 className="font-semibold">Current Streak</h3>
              </div>
              <span className="text-3xl">{getStreakEmoji(stats.streak.currentStreak)}</span>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.streak.currentStreak} days</div>
            <p className="text-sm text-muted-foreground">
              Longest: {stats.streak.longestStreak} days
            </p>
          </Card>

          {/* Total Time Card */}
          <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-6 h-6 text-blue-500" />
              <h3 className="font-semibold">Total Practice Time</h3>
            </div>
            <div className="text-4xl font-bold mb-1">
              {formatMinutes(stats.totalMeditationMinutes)}
            </div>
            <p className="text-sm text-muted-foreground">
              Across {stats.totalSessions} sessions
            </p>
          </Card>

          {/* Achievements Card */}
          <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-6 h-6 text-purple-500" />
              <h3 className="font-semibold">Achievements</h3>
            </div>
            <div className="text-4xl font-bold mb-1">
              {unlockedBadges.length}/{badges.length}
            </div>
            <p className="text-sm text-muted-foreground">
              {inProgressBadges.length} in progress
            </p>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Weekly Progress */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5" />
                <h3 className="text-xl font-semibold">This Week's Activity</h3>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-6">
                {weeklyProgress.days.map((day, index) => {
                  const date = new Date(day.date);
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                  const isToday = date.toDateString() === new Date().toDateString();

                  return (
                    <div key={index} className="text-center">
                      <div className="text-xs text-muted-foreground mb-2">{dayName}</div>
                      <div
                        className={`
                          h-16 rounded-lg flex items-center justify-center
                          ${day.hasActivity ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                          ${isToday ? 'ring-2 ring-primary ring-offset-2' : ''}
                        `}
                      >
                        <div className="text-center">
                          <div className="text-lg font-bold">{day.minutesMeditated || '-'}</div>
                          <div className="text-[10px]">min</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Weekly Total:</span>
                <span className="font-semibold">
                  {formatMinutes(weeklyProgress.totalMinutes)} • {weeklyProgress.totalSessions}{' '}
                  sessions
                </span>
              </div>
            </Card>

            {/* Active Goals */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <h3 className="text-xl font-semibold">Active Goals</h3>
                </div>
                <button className="text-sm text-primary hover:underline">View All</button>
              </div>

              <div className="space-y-4">
                {goals.slice(0, 3).map(goal => {
                  const progressPercent = (goal.current / goal.target) * 100;

                  return (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{goal.icon}</span>
                          <span className="font-medium">{goal.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {goal.current}/{goal.target} {goal.unit}
                        </span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5" />
                <h3 className="text-xl font-semibold">Recent Activity</h3>
              </div>

              <div className="space-y-4">
                {recentActivity.slice(0, 5).map(activity => {
                  const timeAgo = getTimeAgo(activity.timestamp);
                  const icon = getActivityIcon(activity.activityType);

                  return (
                    <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
                      <div className="mt-1">{icon}</div>
                      <div className="flex-1">
                        <div className="font-medium">{getActivityText(activity)}</div>
                        <div className="text-sm text-muted-foreground">{timeAgo}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-6">
            {/* Unlocked Badges */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Unlocked Badges ({unlockedBadges.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {unlockedBadges.map(badge => (
                  <Card
                    key={badge.id}
                    className="p-4 text-center hover:shadow-lg transition-shadow"
                  >
                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <div className="font-semibold mb-1">{badge.name}</div>
                    <div className="text-xs text-muted-foreground mb-2">{badge.description}</div>
                    <Badge variant="secondary" className="text-xs">
                      {badge.tier}
                    </Badge>
                  </Card>
                ))}
              </div>
            </div>

            {/* In Progress Badges */}
            {inProgressBadges.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">In Progress</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {inProgressBadges.map(badge => (
                    <Card key={badge.id} className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{badge.icon}</div>
                        <div className="flex-1">
                          <div className="font-semibold mb-1">{badge.name}</div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {badge.description}
                          </div>
                          <Progress value={badge.progress || 0} className="h-2" />
                          <div className="text-xs text-muted-foreground mt-1">
                            {badge.progress?.toFixed(0)}% complete
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Locked Badges */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Locked</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {badges
                  .filter(b => !b.isUnlocked && (!b.progress || b.progress === 0))
                  .map(badge => (
                    <Card
                      key={badge.id}
                      className="p-4 text-center opacity-50 hover:opacity-70 transition-opacity"
                    >
                      <div className="text-4xl mb-2 grayscale">{badge.icon}</div>
                      <div className="font-semibold mb-1">{badge.name}</div>
                      <div className="text-xs text-muted-foreground">{badge.description}</div>
                    </Card>
                  ))}
              </div>
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Your Goals</h3>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                Create New Goal
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map(goal => {
                const progressPercent = (goal.current / goal.target) * 100;

                return (
                  <Card key={goal.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{goal.icon}</span>
                        <div>
                          <h4 className="font-semibold">{goal.name}</h4>
                          <p className="text-sm text-muted-foreground">{goal.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-semibold">
                          {goal.current}/{goal.target} {goal.unit}
                        </span>
                      </div>
                      <Progress value={progressPercent} className="h-3" />
                    </div>

                    {goal.deadline && (
                      <div className="text-xs text-muted-foreground">
                        Deadline: {new Date(goal.deadline).toLocaleDateString()}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            {/* Content Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-green-500" />
                  <h4 className="font-semibold">Videos</h4>
                </div>
                <div className="text-3xl font-bold mb-1">{stats.videosCompleted}</div>
                <div className="text-sm text-muted-foreground">
                  {formatMinutes(stats.totalVideoMinutes)} watched
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Headphones className="w-5 h-5 text-blue-500" />
                  <h4 className="font-semibold">Audio</h4>
                </div>
                <div className="text-3xl font-bold mb-1">{stats.audioCompleted}</div>
                <div className="text-sm text-muted-foreground">
                  {formatMinutes(stats.totalAudioMinutes)} listened
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-purple-500" />
                  <h4 className="font-semibold">Meditation</h4>
                </div>
                <div className="text-3xl font-bold mb-1">{stats.totalBreathingSessions}</div>
                <div className="text-sm text-muted-foreground">{stats.totalBreaths} breaths</div>
              </Card>
            </div>

            {/* Course Progress */}
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Course Completion</h4>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold">{stats.coursesCompleted}</div>
                <div className="text-sm text-muted-foreground">courses completed</div>
              </div>
            </Card>

            {/* Favorite Category */}
            {stats.favoriteCategory && (
              <Card className="p-6">
                <h4 className="font-semibold mb-4">Favorite Category</h4>
                <div className="text-2xl font-bold">{stats.favoriteCategory}</div>
              </Card>
            )}

            {/* Most Watched Expert */}
            {stats.mostWatchedExpert && (
              <Card className="p-6">
                <h4 className="font-semibold mb-4">Most Watched Expert</h4>
                <div className="text-2xl font-bold">{stats.mostWatchedExpert}</div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

// Helper functions
function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return then.toLocaleDateString();
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'video_watched':
      return <BookOpen className="w-5 h-5 text-green-500" />;
    case 'audio_completed':
      return <Headphones className="w-5 h-5 text-blue-500" />;
    case 'meditation_session':
      return <Brain className="w-5 h-5 text-purple-500" />;
    case 'course_completed':
      return <Trophy className="w-5 h-5 text-yellow-500" />;
    case 'badge_earned':
      return <Award className="w-5 h-5 text-orange-500" />;
    default:
      return <Activity className="w-5 h-5" />;
  }
}

function getActivityText(activity: any): string {
  switch (activity.activityType) {
    case 'video_watched':
      return `Watched "${activity.contentTitle}"`;
    case 'audio_completed':
      return `Completed "${activity.contentTitle}"`;
    case 'meditation_session':
      return `Meditated for ${activity.durationMinutes} minutes`;
    case 'course_completed':
      return `Completed course "${activity.contentTitle}"`;
    case 'badge_earned':
      return `Earned badge "${activity.metadata?.badgeName}"`;
    default:
      return 'Activity';
  }
}

export default ProgressPage;
