import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/Layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Target,
  CheckCircle2,
  Circle,
  Sparkles,
  Play,
  User,
  TrendingUp,
  Award,
  Calendar,
  ChevronRight,
  Zap,
  Heart,
  Brain,
  Dumbbell,
  Book,
  Coffee,
  Moon,
  Sun,
  Plus,
  X
} from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useNavigate } from 'react-router-dom';

// Import Cudly character
import cudlyCharacter from '@/assets/preview.svg';

interface DailyGoal {
  id: string;
  title: string;
  icon: React.ReactNode;
  completed: boolean;
  category: 'morning' | 'anytime' | 'evening';
  points: number;
}

interface Journey {
  type: string;
  goals: string[];
  suggestedContent: SuggestedContent[];
}

interface SuggestedContent {
  id: string;
  title: string;
  type: 'video' | 'audio' | 'expert' | 'meditation';
  thumbnail: string;
  description: string;
  link: string;
}

const GoalsPage: React.FC = () => {
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const [showCelebration, setShowCelebration] = useState(false);
  const [showJourneySetup, setShowJourneySetup] = useState(false);
  const [journeyInput, setJourneyInput] = useState('');
  const [currentStreak, setCurrentStreak] = useState(3);
  const [totalPoints, setTotalPoints] = useState(245);
  const [level, setLevel] = useState(4);

  const [userJourney, setUserJourney] = useState<Journey>({
    type: 'Wellness & Mindfulness',
    goals: ['Practice daily meditation', 'Improve sleep quality', 'Reduce stress'],
    suggestedContent: []
  });

  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([
    { id: '1', title: 'Morning meditation', icon: <Sparkles className="w-5 h-5" />, completed: true, category: 'morning', points: 10 },
    { id: '2', title: 'Drink water', icon: <Coffee className="w-5 h-5" />, completed: true, category: 'morning', points: 5 },
    { id: '3', title: 'Practice gratitude', icon: <Heart className="w-5 h-5" />, completed: false, category: 'morning', points: 10 },
    { id: '4', title: 'Take a mindful break', icon: <Brain className="w-5 h-5" />, completed: false, category: 'anytime', points: 10 },
    { id: '5', title: 'Listen to wellness audio', icon: <Play className="w-5 h-5" />, completed: false, category: 'anytime', points: 15 },
    { id: '6', title: 'Evening reflection', icon: <Moon className="w-5 h-5" />, completed: false, category: 'evening', points: 10 },
    { id: '7', title: 'Wind down meditation', icon: <Moon className="w-5 h-5" />, completed: false, category: 'evening', points: 15 },
  ]);

  const [cudlyMessage, setCudlyMessage] = useState(
    "Good morning! Ready to make today amazing? I've prepared your daily challenges based on your wellness journey. Let's start! ✨"
  );

  const completedToday = dailyGoals.filter(g => g.completed).length;
  const totalGoals = dailyGoals.length;
  const goalsLeft = totalGoals - completedToday;
  const progressPercentage = Math.round((completedToday / totalGoals) * 100);

  // Suggested content based on user's journey
  const getSuggestedContent = (journeyType: string): SuggestedContent[] => {
    const contentMap: Record<string, SuggestedContent[]> = {
      'weight loss': [
        { id: '1', title: 'Mindful Eating Meditation', type: 'meditation', thumbnail: '', description: '15-min guided meditation', link: '/meditate' },
        { id: '2', title: 'Nutrition Expert: Dr. Sarah', type: 'expert', thumbnail: '', description: 'Weight management specialist', link: '/experts/1' },
        { id: '3', title: 'Healthy Habits Audio', type: 'audio', thumbnail: '', description: '20-min wellness session', link: '/audio' },
      ],
      'stress reduction': [
        { id: '1', title: 'Stress Relief Meditation', type: 'meditation', thumbnail: '', description: '10-min calming session', link: '/meditate' },
        { id: '2', title: 'Anxiety Management Expert', type: 'expert', thumbnail: '', description: 'Licensed therapist', link: '/experts/2' },
        { id: '3', title: 'Deep Breathing Exercises', type: 'audio', thumbnail: '', description: 'Guided breathing', link: '/audio' },
      ],
      'wellness': [
        { id: '1', title: 'Morning Energy Meditation', type: 'meditation', thumbnail: '', description: 'Start your day right', link: '/meditate' },
        { id: '2', title: 'Wellness Coach Session', type: 'audio', thumbnail: '', description: 'Daily wellness tips', link: '/audio' },
        { id: '3', title: 'Sleep Better Tonight', type: 'meditation', thumbnail: '', description: 'Evening wind-down', link: '/meditate' },
      ],
    };

    return contentMap[journeyType.toLowerCase()] || contentMap['wellness'];
  };

  const toggleGoalComplete = (id: string) => {
    const goal = dailyGoals.find(g => g.id === id);
    if (!goal) return;

    setDailyGoals(dailyGoals.map(g =>
      g.id === id ? { ...g, completed: !g.completed } : g
    ));

    if (!goal.completed) {
      setTotalPoints(totalPoints + goal.points);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);

      const encouragements = [
        "Amazing! You're doing great! 🌟",
        "Keep it up! Every small step counts! 💪",
        "Wonderful progress! I'm proud of you! ✨",
        "You're on fire today! 🔥",
        "That's the spirit! Keep going! 🎯"
      ];
      setCudlyMessage(encouragements[Math.floor(Math.random() * encouragements.length)]);
    }
  };

  const handleJourneySetup = () => {
    if (journeyInput.trim()) {
      const newJourney: Journey = {
        type: journeyInput,
        goals: [],
        suggestedContent: getSuggestedContent(journeyInput)
      };
      setUserJourney(newJourney);
      setCudlyMessage(`Perfect! I'll help you with your ${journeyInput} journey. I've found some great content for you! 🎯`);
      setShowJourneySetup(false);
      setJourneyInput('');
    }
  };

  const getCategoryGoals = (category: 'morning' | 'anytime' | 'evening') => {
    return dailyGoals.filter(g => g.category === category);
  };

  const categoryIcons = {
    morning: <Sun className="w-5 h-5" />,
    anytime: <Zap className="w-5 h-5" />,
    evening: <Moon className="w-5 h-5" />
  };

  const categoryTitles = {
    morning: 'Start the Day',
    anytime: 'Anytime',
    evening: 'Wind Down'
  };

  return (
    <>
      <Header />
      <PageLayout hasHero={false}>
        {showCelebration && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
          />
        )}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Cudly Character Scene */}
          <div className="relative h-72 mb-6 rounded-3xl overflow-hidden bg-gradient-to-b from-sky-200 via-green-100 to-green-200 dark:from-sky-900 dark:via-green-900 dark:to-green-800">
            {/* Decorative elements */}
            <div className="absolute top-8 right-8 w-16 h-16 bg-yellow-300 rounded-full opacity-90"></div>
            <div className="absolute top-20 left-10 w-24 h-32 bg-green-600 rounded-full opacity-60"></div>
            <div className="absolute bottom-10 right-16 w-20 h-28 bg-green-700 rounded-full opacity-50"></div>

            {/* Cudly Character */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-2xl animate-bounce">
                  <img
                    src={cudlyCharacter}
                    alt="Cudly"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<div class="text-6xl">🌟</div>';
                    }}
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
              <div className="flex gap-3">
                <div className="px-4 py-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="font-bold text-gray-900 dark:text-white">Level {level}</span>
                </div>
                <div className="px-4 py-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500" />
                  <span className="font-bold text-gray-900 dark:text-white">{totalPoints} pts</span>
                </div>
              </div>
              <div className="px-4 py-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <span className="font-bold text-gray-900 dark:text-white">{currentStreak} day streak</span>
              </div>
            </div>
          </div>

          {/* Cudly's Message */}
          <Card className="mb-6 border-2 border-indigo-200 dark:border-indigo-800 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🌟</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Cudly</h3>
                  <p className="text-gray-700 dark:text-gray-300">{cudlyMessage}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Journey Progress */}
          <Card className="mb-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-indigo-200 dark:border-indigo-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {userJourney.type} Journey
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {goalsLeft} goals left for today!
                  </p>
                </div>
                <button
                  onClick={() => setShowJourneySetup(true)}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
                >
                  Change Journey
                </button>
              </div>
              <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">{completedToday}/{totalGoals} completed</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{progressPercentage}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Daily Goals by Category */}
          {(['morning', 'anytime', 'evening'] as const).map((category) => {
            const categoryGoals = getCategoryGoals(category);
            if (categoryGoals.length === 0) return null;

            return (
              <div key={category} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  {categoryIcons[category]}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {categoryTitles[category]}
                  </h3>
                </div>
                <div className="space-y-2">
                  {categoryGoals.map((goal) => (
                    <Card
                      key={goal.id}
                      className={`transition-all duration-300 cursor-pointer hover:shadow-lg ${
                        goal.completed
                          ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                          : 'hover:border-indigo-300 dark:hover:border-indigo-700'
                      }`}
                      onClick={() => toggleGoalComplete(goal.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            goal.completed
                              ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                          }`}>
                            {goal.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-semibold ${
                              goal.completed
                                ? 'text-gray-600 dark:text-gray-400 line-through'
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {goal.title}
                            </h4>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-orange-600 dark:text-orange-400 flex items-center gap-1">
                              <Zap className="w-4 h-4" />
                              {goal.points}
                            </span>
                            {goal.completed ? (
                              <CheckCircle2 className="w-6 h-6 text-green-500 animate-pulse" />
                            ) : (
                              <Circle className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Suggested Content */}
          {userJourney.suggestedContent.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Target className="w-6 h-6 text-indigo-600" />
                  Recommended for You
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getSuggestedContent(userJourney.type).map((content) => (
                  <Card
                    key={content.id}
                    className="cursor-pointer hover:shadow-xl transition-all duration-300 group"
                    onClick={() => navigate(content.link)}
                  >
                    <CardContent className="p-4">
                      <div className="w-full h-32 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-lg mb-3 flex items-center justify-center group-hover:scale-105 transition-transform">
                        {content.type === 'meditation' && <Sparkles className="w-12 h-12 text-indigo-600" />}
                        {content.type === 'audio' && <Play className="w-12 h-12 text-purple-600" />}
                        {content.type === 'expert' && <User className="w-12 h-12 text-blue-600" />}
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                        {content.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {content.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          content.type === 'meditation' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
                          content.type === 'audio' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                          'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        }`}>
                          {content.type}
                        </span>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Add Custom Goal Button */}
          <Button
            onClick={() => {/* Add custom goal logic */}}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg py-6 text-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Custom Goal
          </Button>
        </div>

        {/* Journey Setup Modal */}
        {showJourneySetup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    What's your journey about?
                  </h3>
                  <button onClick={() => setShowJourneySetup(false)}>
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Tell me what you want to work on, and I'll suggest personalized content!
                </p>
                <Input
                  placeholder="e.g., weight loss, stress reduction, better sleep..."
                  value={journeyInput}
                  onChange={(e) => setJourneyInput(e.target.value)}
                  className="mb-4"
                  autoFocus
                />
                <div className="flex gap-2 flex-wrap mb-4">
                  {['Weight Loss', 'Stress Reduction', 'Better Sleep', 'Fitness', 'Mindfulness'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setJourneyInput(suggestion)}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
                <Button
                  onClick={handleJourneySetup}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  Start My Journey
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </PageLayout>
      <Footer />
    </>
  );
};

export default GoalsPage;
