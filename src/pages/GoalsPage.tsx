import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/Layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Target, Calendar, CheckCircle2, Circle, Sparkles, MessageCircle, X } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/useWindowSize';

// Import character SVG
import characterSvg from '@/assets/preview.svg';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'wellness' | 'meditation' | 'learning' | 'personal';
  completed: boolean;
  createdAt: Date;
}

interface CharacterMessage {
  id: string;
  text: string;
  isQuestion: boolean;
  timestamp: Date;
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
  ]);

  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'wellness' as Goal['category'],
  });

  const [showCelebration, setShowCelebration] = useState(false);
  const [characterMessages, setCharacterMessages] = useState<CharacterMessage[]>([
    {
      id: '1',
      text: "Welcome! I'm here to support you on your journey. What would you like to achieve today?",
      isQuestion: true,
      timestamp: new Date(),
    },
  ]);
  const [showCharacterChat, setShowCharacterChat] = useState(true);
  const { width, height } = useWindowSize();

  // Character questions based on user's journey
  const journeyQuestions = [
    "What's one small step you can take today toward your wellness?",
    "How are you feeling about your progress this week?",
    "What motivated you to start this journey?",
    "Is there something holding you back from your goals?",
    "What would completing this goal mean to you?",
    "How can I support you better on this journey?",
  ];

  const encouragingMessages = [
    "That's amazing progress! Keep going!",
    "I'm so proud of how far you've come!",
    "Every small step counts. You're doing great!",
    "Your dedication is inspiring!",
    "Remember, progress isn't always linear. You've got this!",
  ];

  useEffect(() => {
    // Add a new encouraging message periodically
    const messageInterval = setInterval(() => {
      const randomQuestion = journeyQuestions[Math.floor(Math.random() * journeyQuestions.length)];
      const newMessage: CharacterMessage = {
        id: Date.now().toString(),
        text: randomQuestion,
        isQuestion: true,
        timestamp: new Date(),
      };
      setCharacterMessages(prev => [...prev, newMessage]);
    }, 120000); // Every 2 minutes

    return () => clearInterval(messageInterval);
  }, []);

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

      // Character responds
      const encouragement = "Great! I love that you're setting this goal. Remember, I'm here to help you every step of the way.";
      setCharacterMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: encouragement,
        isQuestion: false,
        timestamp: new Date(),
      }]);
    }
  };

  const toggleGoalComplete = (id: string) => {
    const goal = goals.find(g => g.id === id);
    const wasCompleted = goal?.completed;

    setGoals(goals.map(goal =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));

    // If goal was just completed, celebrate!
    if (!wasCompleted) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);

      const celebration = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
      setCharacterMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: celebration,
        isQuestion: false,
        timestamp: new Date(),
      }]);
    }
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
        {/* Celebration Confetti */}
        {showCelebration && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.3}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header with Character */}
          <div className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left: Header Text */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Your Journey
                  </h1>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  Every step forward is progress. I'm here to walk this path with you.
                </p>

                {/* Quick Stats */}
                <div className="flex gap-4 flex-wrap">
                  <div className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-full border border-indigo-200 dark:border-indigo-800">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress: </span>
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{completionRate}%</span>
                  </div>
                  <div className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-full border border-green-200 dark:border-green-800">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed: </span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">{completedGoals}/{totalGoals}</span>
                  </div>
                </div>
              </div>

              {/* Right: Character Guide */}
              <div className="relative">
                <Card className="border-2 border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/50 dark:to-purple-950/50 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Character Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 p-1 animate-pulse">
                          <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                            <img
                              src={characterSvg}
                              alt="Your Guide"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback if SVG not found
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML = '<div class="text-4xl">🌟</div>';
                              }}
                            />
                          </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-bounce">
                          <Sparkles className="w-4 h-4 text-white m-auto" />
                        </div>
                      </div>

                      {/* Latest Character Message */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Your Guide</h3>
                          <MessageCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-none p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {characterMessages[characterMessages.length - 1]?.text}
                          </p>
                        </div>
                        <button
                          onClick={() => setShowCharacterChat(!showCharacterChat)}
                          className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" />
                          {showCharacterChat ? 'Hide conversation' : 'Show full conversation'}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Character Chat History - Expandable */}
          {showCharacterChat && characterMessages.length > 1 && (
            <Card className="mb-8 border-indigo-200 dark:border-indigo-800 animate-in slide-in-from-top duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-indigo-600" />
                    Journey Conversation
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCharacterChat(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="max-h-64 overflow-y-auto space-y-3">
                {characterMessages.slice(0, -1).reverse().map((message) => (
                  <div key={message.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex-shrink-0 flex items-center justify-center text-white text-xs">
                      🌟
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none p-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300">{message.text}</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Add New Goal Section */}
          <div className="mb-8">
            {!showNewGoalForm && (
              <Button
                onClick={() => setShowNewGoalForm(true)}
                size="lg"
                className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Set a New Goal
              </Button>
            )}

            {/* New Goal Form */}
            {showNewGoalForm && (
              <Card className="border-2 border-indigo-200 dark:border-indigo-800 shadow-xl animate-in slide-in-from-top duration-300">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    What do you want to achieve?
                  </CardTitle>
                  <CardDescription>
                    Let's work together to make this goal a reality
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Goal
                    </label>
                    <Input
                      placeholder="e.g., Meditate every morning for 10 minutes"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                      className="w-full text-lg"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Why is this important to you?
                    </label>
                    <Textarea
                      placeholder="Share your reason... This helps keep you motivated!"
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
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="wellness">🌿 Wellness</option>
                      <option value="meditation">🧘 Meditation</option>
                      <option value="learning">📚 Learning</option>
                      <option value="personal">✨ Personal Growth</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={handleAddGoal}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Target className="w-6 h-6 text-indigo-600" />
                Active Goals
              </h2>
              {goals.filter(g => !g.completed).length > 0 && (
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                  {goals.filter(g => !g.completed).length} in progress
                </span>
              )}
            </div>

            {goals.length === 0 ? (
              <Card className="border-dashed border-2 bg-gradient-to-br from-gray-50 to-indigo-50/30 dark:from-gray-900 dark:to-indigo-950/30">
                <CardContent className="py-16 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center animate-bounce">
                    <span className="text-4xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Let's start your journey!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    Setting goals is the first step toward making positive changes. What would you like to work on?
                  </p>
                  <Button
                    onClick={() => setShowNewGoalForm(true)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Set Your First Goal
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Active Goals */}
                {goals.filter(g => !g.completed).map((goal) => (
                  <Card
                    key={goal.id}
                    className="transition-all duration-300 hover:shadow-xl border-2 hover:border-indigo-300 dark:hover:border-indigo-700 group animate-in slide-in-from-left"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => toggleGoalComplete(goal.id)}
                          className="mt-1 flex-shrink-0 group/checkbox"
                        >
                          <Circle className="w-7 h-7 text-gray-300 group-hover/checkbox:text-indigo-600 group-hover/checkbox:scale-110 transition-all" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {goal.title}
                            </h3>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getCategoryColor(goal.category)}`}>
                              {goal.category === 'wellness' && '🌿'}
                              {goal.category === 'meditation' && '🧘'}
                              {goal.category === 'learning' && '📚'}
                              {goal.category === 'personal' && '✨'}
                              {' '}
                              {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
                            </span>
                          </div>
                          {goal.description && (
                            <p className="text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                              {goal.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                            <Calendar className="w-3 h-3" />
                            Started {goal.createdAt.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Completed Goals */}
                {goals.filter(g => g.completed).length > 0 && (
                  <>
                    <div className="flex items-center gap-2 mt-8 mb-4">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Completed Goals
                      </h3>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                        {goals.filter(g => g.completed).length}
                      </span>
                    </div>
                    {goals.filter(g => g.completed).map((goal) => (
                      <Card
                        key={goal.id}
                        className="opacity-70 hover:opacity-100 transition-all duration-300 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/30"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <button
                              onClick={() => toggleGoalComplete(goal.id)}
                              className="mt-1 flex-shrink-0"
                            >
                              <CheckCircle2 className="w-7 h-7 text-green-500 animate-pulse" />
                            </button>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 line-through">
                                  {goal.title}
                                </h3>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap opacity-60 ${getCategoryColor(goal.category)}`}>
                                  {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
                                </span>
                              </div>
                              {goal.description && (
                                <p className="text-gray-500 dark:text-gray-500 text-sm mb-2">
                                  {goal.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </PageLayout>
      <Footer />
    </>
  );
};

export default GoalsPage;
