// ============================================
// FILE: src/pages/ProgressPage.tsx
// Progress Dashboard Page
// ============================================

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { progressService } from '@/services/progress.service';
import type { ProgressSummary } from '@/types/progress.types';
import { formatMinutes } from '@/types/progress.types';
import {
  Target,
  Clock,
  BookOpen,
  Headphones,
  Brain,
  Calendar,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import PageLayout from '@/components/Layout/PageLayout';

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
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
        <div className="container mx-auto px-4 py-8 max-w-6xl">
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

  const { stats, goals, weeklyProgress } = progress;

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light mb-2">
            {user?.name ? `${user.name.split(' ')[0]}'s Progress` : 'Your Progress'}
          </h1>
          <p className="text-muted-foreground">
            Track your wellness journey
          </p>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Streak Card */}
          <Card className="p-6 border-neutral-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-neutral-700" />
              </div>
              <h3 className="font-medium text-neutral-900">Current Streak</h3>
            </div>
            <div className="text-4xl font-light mb-1 text-neutral-900">{stats.streak.currentStreak} days</div>
            <p className="text-sm text-neutral-500">
              Longest streak: {stats.streak.longestStreak} days
            </p>
          </Card>

          {/* Total Time Card */}
          <Card className="p-6 border-neutral-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-neutral-700" />
              </div>
              <h3 className="font-medium text-neutral-900">Total Practice Time</h3>
            </div>
            <div className="text-4xl font-light mb-1 text-neutral-900">
              {formatMinutes(stats.totalMeditationMinutes)}
            </div>
            <p className="text-sm text-neutral-500">
              Across {stats.totalSessions} sessions
            </p>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-neutral-100">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Weekly Progress */}
            <Card className="p-6 border-neutral-200">
              <h3 className="text-lg font-medium mb-6 text-neutral-900">This Week's Activity</h3>

              <div className="grid grid-cols-7 gap-2 mb-6">
                {weeklyProgress.days.map((day, index) => {
                  const date = new Date(day.date);
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                  const isToday = date.toDateString() === new Date().toDateString();

                  return (
                    <div key={index} className="text-center">
                      <div className="text-xs text-neutral-500 mb-2">{dayName}</div>
                      <div
                        className={`
                          h-16 rounded-lg flex items-center justify-center transition-all
                          ${day.hasActivity ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-400'}
                          ${isToday ? 'ring-2 ring-neutral-400 ring-offset-2' : ''}
                        `}
                      >
                        <div className="text-center">
                          <div className="text-lg font-medium">{day.minutesMeditated || '-'}</div>
                          <div className="text-[10px]">min</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-sm pt-4 border-t border-neutral-200">
                <span className="text-neutral-500">Weekly Total</span>
                <span className="font-medium text-neutral-900">
                  {formatMinutes(weeklyProgress.totalMinutes)} • {weeklyProgress.totalSessions}{' '}
                  sessions
                </span>
              </div>
            </Card>

            {/* Active Goals */}
            <Card className="p-6 border-neutral-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-neutral-900">Active Goals</h3>
              </div>

              <div className="space-y-6">
                {goals.slice(0, 3).map(goal => {
                  const progressPercent = (goal.current / goal.target) * 100;

                  return (
                    <div key={goal.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-neutral-900">{goal.name}</span>
                        <span className="text-sm text-neutral-500">
                          {goal.current}/{goal.target} {goal.unit}
                        </span>
                      </div>
                      <Progress value={progressPercent} className="h-2 bg-neutral-100" />
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {goals.map(goal => {
                const progressPercent = (goal.current / goal.target) * 100;

                return (
                  <Card key={goal.id} className="p-6 border-neutral-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-neutral-900 mb-1">{goal.name}</h4>
                        <p className="text-sm text-neutral-500">{goal.description}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">Progress</span>
                        <span className="font-medium text-neutral-900">
                          {goal.current}/{goal.target} {goal.unit}
                        </span>
                      </div>
                      <Progress value={progressPercent} className="h-2 bg-neutral-100" />
                    </div>

                    {goal.deadline && (
                      <div className="text-xs text-neutral-500">
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
              <Card className="p-6 border-neutral-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-neutral-700" />
                  </div>
                  <h4 className="font-medium text-neutral-900">Videos</h4>
                </div>
                <div className="text-3xl font-light mb-1 text-neutral-900">{stats.videosCompleted}</div>
                <div className="text-sm text-neutral-500">
                  {formatMinutes(stats.totalVideoMinutes)} watched
                </div>
              </Card>

              <Card className="p-6 border-neutral-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-neutral-700" />
                  </div>
                  <h4 className="font-medium text-neutral-900">Audio</h4>
                </div>
                <div className="text-3xl font-light mb-1 text-neutral-900">{stats.audioCompleted}</div>
                <div className="text-sm text-neutral-500">
                  {formatMinutes(stats.totalAudioMinutes)} listened
                </div>
              </Card>

              <Card className="p-6 border-neutral-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-neutral-700" />
                  </div>
                  <h4 className="font-medium text-neutral-900">Meditation</h4>
                </div>
                <div className="text-3xl font-light mb-1 text-neutral-900">{stats.totalBreathingSessions}</div>
                <div className="text-sm text-neutral-500">{stats.totalBreaths} breaths</div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default ProgressPage;
