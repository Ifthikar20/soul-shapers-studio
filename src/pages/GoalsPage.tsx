import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/Layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Target, TrendingUp, Calendar, CheckCircle2, Circle } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'wellness' | 'meditation' | 'learning' | 'personal';
  completed: boolean;
  createdAt: Date;
}

const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Practice Daily Meditation',
      description: 'Meditate for 10 minutes every morning',
      category: 'meditation',
      completed: false,
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Complete Wellness Program',
      description: 'Finish the 30-day wellness challenge',
      category: 'wellness',
      completed: false,
      createdAt: new Date(),
    },
    {
      id: '3',
      title: 'Learn Mindfulness Techniques',
      description: 'Complete the mindfulness course',
      category: 'learning',
      completed: true,
      createdAt: new Date(),
    },
  ]);

  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'wellness' as Goal['category'],
  });

  const handleAddGoal = () => {
    if (newGoal.title.trim()) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description,
        category: newGoal.category,
        completed: false,
        createdAt: new Date(),
      };
      setGoals([goal, ...goals]);
      setNewGoal({ title: '', description: '', category: 'wellness' });
      setShowNewGoalForm(false);
    }
  };

  const toggleGoalComplete = (id: string) => {
    setGoals(goals.map(goal =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const getCategoryColor = (category: Goal['category']) => {
    const colors = {
      wellness: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      meditation: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      learning: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      personal: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    };
    return colors[category];
  };

  const completedGoals = goals.filter(g => g.completed).length;
  const totalGoals = goals.length;
  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <>
      <Header />
      <PageLayout hasHero={false}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Target className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                Your Goals
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Set, track, and achieve your wellness and personal development goals
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-indigo-200 dark:border-indigo-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {completionRate}%
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {completedGoals}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 border-orange-200 dark:border-orange-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Circle className="w-4 h-4" />
                  Active Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {totalGoals - completedGoals}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add New Goal Button */}
          <div className="mb-8">
            {!showNewGoalForm && (
              <Button
                onClick={() => setShowNewGoalForm(true)}
                size="lg"
                className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Goal
              </Button>
            )}

            {/* New Goal Form */}
            {showNewGoalForm && (
              <Card className="border-indigo-200 dark:border-indigo-800">
                <CardHeader>
                  <CardTitle>Create New Goal</CardTitle>
                  <CardDescription>Define your goal and start tracking your progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Goal Title
                    </label>
                    <Input
                      placeholder="e.g., Practice daily meditation"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <Textarea
                      placeholder="Describe your goal in detail..."
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                      className="w-full"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as Goal['category'] })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="wellness">Wellness</option>
                      <option value="meditation">Meditation</option>
                      <option value="learning">Learning</option>
                      <option value="personal">Personal</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button onClick={handleAddGoal} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                      Create Goal
                    </Button>
                    <Button
                      onClick={() => setShowNewGoalForm(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Goals List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Your Goals
            </h2>

            {goals.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No goals yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Start by creating your first goal to track your progress
                  </p>
                  <Button onClick={() => setShowNewGoalForm(true)} className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Goal
                  </Button>
                </CardContent>
              </Card>
            ) : (
              goals.map((goal) => (
                <Card
                  key={goal.id}
                  className={`transition-all duration-300 hover:shadow-lg ${
                    goal.completed ? 'opacity-60' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => toggleGoalComplete(goal.id)}
                        className="mt-1 flex-shrink-0"
                      >
                        {goal.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-400 hover:text-indigo-600 transition-colors" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className={`text-lg font-semibold ${
                            goal.completed
                              ? 'text-gray-500 dark:text-gray-400 line-through'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {goal.title}
                          </h3>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getCategoryColor(goal.category)}`}>
                            {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
                          </span>
                        </div>
                        {goal.description && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                            {goal.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                          <Calendar className="w-3 h-3" />
                          Created {goal.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </PageLayout>
      <Footer />
    </>
  );
};

export default GoalsPage;
