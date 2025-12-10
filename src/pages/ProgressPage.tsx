// ============================================
// FILE: src/pages/ProgressPage.tsx
// Progress Dashboard Page
// ============================================

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { progressService } from '@/services/progress.service';
import type { ProgressSummary } from '@/types/progress.types';
import { formatMinutes } from '@/types/progress.types';
import {
  Clock,
  BookOpen,
  Headphones,
  Brain,
  Calendar,
  Award,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/Layout/PageLayout';
import DOMPurify from 'isomorphic-dompurify';
import GreatFeelPointsDisplay from '@/components/progress/GreatFeelPointsDisplay';

const ProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Security: Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // Only load data if user is authenticated
    if (user) {
      loadProgressData();
    }
  }, [user]);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      // Security: getProgressSummary uses authenticated session to fetch only current user's data
      // This prevents IDOR (Insecure Direct Object Reference) attacks
      const data = await progressService.getProgressSummary();
      setProgress(data);
    } catch (err: any) {
      console.error('Failed to load progress:', err);
      // Sanitize error message to prevent XSS
      const sanitizedError = DOMPurify.sanitize(err?.message || 'Failed to load progress data');
      setError(sanitizedError);
    } finally {
      setLoading(false);
    }
  };

  // Memoize computed values for performance and security
  const badgeData = useMemo(() => {
    if (!progress?.badges) return { completed: [] };

    const completed = progress.badges.filter(b => b.isUnlocked);

    return { completed };
  }, [progress?.badges]);

  // Sanitize user name to prevent XSS
  const sanitizedUserName = useMemo(() => {
    if (!user?.name) return null;
    return DOMPurify.sanitize(user.name.split(' ')[0]);
  }, [user?.name]);

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Skeleton className="h-12 w-64 mb-8 bg-neutral-200 dark:bg-neutral-800" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Skeleton className="h-32 bg-neutral-200 dark:bg-neutral-800" />
            <Skeleton className="h-32 bg-neutral-200 dark:bg-neutral-800" />
          </div>
          <Skeleton className="h-96 bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </PageLayout>
    );
  }

  if (error || !progress) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400">{error || 'Failed to load progress data'}</p>
            <button
              onClick={loadProgressData}
              className="mt-4 px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const { stats, goals, weeklyProgress } = progress;

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 -ml-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-light mb-2 text-neutral-900 dark:text-neutral-100">
            {sanitizedUserName ? `${sanitizedUserName}'s Progress` : 'Your Progress'}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Track your wellness journey
          </p>
        </div>

        {/* Great Feel Points Banner - Top of Dashboard */}
        <div className="mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-200 dark:border-purple-800 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">
                  Your Great Feel Points
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Keep watching wellness content to earn more points and unlock achievements
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <GreatFeelPointsDisplay className="scale-125" />
            </div>
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Streak Card */}
          <Card className="p-6 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
              </div>
              <h3 className="font-medium text-neutral-900 dark:text-neutral-100">Current Streak</h3>
            </div>
            <div className="text-4xl font-light mb-1 text-neutral-900 dark:text-neutral-100">
              {Math.max(0, stats.streak.currentStreak)} days
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Longest streak: {Math.max(0, stats.streak.longestStreak)} days
            </p>
          </Card>

          {/* Total Time Card */}
          <Card className="p-6 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <Clock className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
              </div>
              <h3 className="font-medium text-neutral-900 dark:text-neutral-100">Total Practice Time</h3>
            </div>
            <div className="text-4xl font-light mb-1 text-neutral-900 dark:text-neutral-100">
              {formatMinutes(Math.max(0, stats.totalMeditationMinutes))}
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Across {Math.max(0, stats.totalSessions)} sessions
            </p>
          </Card>
        </div>

        {/* Badges Section */}
        {badgeData.completed.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4 text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Achievements
            </h2>

            <Card className="p-6 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 backdrop-blur">
              <h3 className="text-sm font-medium mb-4 text-neutral-700 dark:text-neutral-300">
                Completed ({badgeData.completed.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {badgeData.completed.map(badge => (
                  <div
                    key={badge.id}
                    className="text-center p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50"
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <div className="font-medium text-sm text-neutral-900 dark:text-neutral-100 mb-1">
                      {DOMPurify.sanitize(badge.name)}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {DOMPurify.sanitize(badge.tier)}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-neutral-100 dark:bg-neutral-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Weekly Progress */}
            <Card className="p-6 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 backdrop-blur">
              <h3 className="text-lg font-medium mb-6 text-neutral-900 dark:text-neutral-100">This Week's Activity</h3>

              <div className="grid grid-cols-7 gap-2 mb-6">
                {weeklyProgress.days.map((day, index) => {
                  const date = new Date(day.date);
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                  const isToday = date.toDateString() === new Date().toDateString();

                  return (
                    <div key={`${day.date}-${index}`} className="text-center">
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">{dayName}</div>
                      <div
                        className={`
                          h-16 rounded-lg flex items-center justify-center transition-all
                          ${day.hasActivity ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500'}
                          ${isToday ? 'ring-2 ring-neutral-400 dark:ring-neutral-500 ring-offset-2 dark:ring-offset-neutral-950' : ''}
                        `}
                      >
                        <div className="text-center">
                          <div className="text-lg font-medium">
                            {day.minutesMeditated ? Math.max(0, day.minutesMeditated) : '-'}
                          </div>
                          <div className="text-[10px]">min</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-sm pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-500 dark:text-neutral-400">Weekly Total</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {formatMinutes(Math.max(0, weeklyProgress.totalMinutes))} • {Math.max(0, weeklyProgress.totalSessions)}{' '}
                  sessions
                </span>
              </div>
            </Card>

          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {goals.map(goal => {
                const safeProgress = Math.min(100, Math.max(0, (goal.current / goal.target) * 100));

                return (
                  <Card key={goal.id} className="p-6 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 backdrop-blur">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                          {DOMPurify.sanitize(goal.name)}
                        </h4>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {DOMPurify.sanitize(goal.description)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500 dark:text-neutral-400">Progress</span>
                        <span className="font-medium text-neutral-900 dark:text-neutral-100">
                          {Math.max(0, goal.current)}/{Math.max(0, goal.target)} {DOMPurify.sanitize(goal.unit)}
                        </span>
                      </div>
                      <Progress value={safeProgress} className="h-2 bg-neutral-100 dark:bg-neutral-800" />
                    </div>

                    {goal.deadline && (
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
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
              <Card className="p-6 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 backdrop-blur">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                  </div>
                  <h4 className="font-medium text-neutral-900 dark:text-neutral-100">Videos</h4>
                </div>
                <div className="text-3xl font-light mb-1 text-neutral-900 dark:text-neutral-100">
                  {Math.max(0, stats.videosCompleted)}
                </div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  {formatMinutes(Math.max(0, stats.totalVideoMinutes))} watched
                </div>
              </Card>

              <Card className="p-6 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 backdrop-blur">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                  </div>
                  <h4 className="font-medium text-neutral-900 dark:text-neutral-100">Audio</h4>
                </div>
                <div className="text-3xl font-light mb-1 text-neutral-900 dark:text-neutral-100">
                  {Math.max(0, stats.audioCompleted)}
                </div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  {formatMinutes(Math.max(0, stats.totalAudioMinutes))} listened
                </div>
              </Card>

              <Card className="p-6 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 backdrop-blur">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                  </div>
                  <h4 className="font-medium text-neutral-900 dark:text-neutral-100">Meditation</h4>
                </div>
                <div className="text-3xl font-light mb-1 text-neutral-900 dark:text-neutral-100">
                  {Math.max(0, stats.totalBreathingSessions)}
                </div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  {Math.max(0, stats.totalBreaths)} breaths
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default ProgressPage;
