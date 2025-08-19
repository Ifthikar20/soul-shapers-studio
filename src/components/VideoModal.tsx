import { useState, useCallback, useMemo } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { useVideoAccess } from '@/hooks/useVideoAccess';
import { 
  Play, Clock, User, Star, Users, Crown, Lock, X, 
  Pause, Volume2, Settings, Plus, ThumbsUp, Share2, 
  Check, BookOpen, ChevronRight, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VideoContent } from '@/types/video.types';

interface VideoModalProps {
  video: VideoContent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Episode {
  id: number;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  accessTier: 'free' | 'premium';
  isFirstEpisode: boolean;
  seriesId?: string;
  episodeNumber: number;
  isCompleted?: boolean;
  progress?: number; // 0-100
  videoUrl?: string; // Added video URL for different courses
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  accessTier: 'free' | 'premium';
  isFirstEpisode: boolean;
}

interface CommunityPost {
  id: number;
  author: string;
  avatar: string;
  timeAgo: string;
  content: string;
  likes: number;
  replies: number;
}

interface PracticeQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const VideoModal = ({ video, open, onOpenChange }: VideoModalProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentLesson, setCurrentLesson] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [showResults, setShowResults] = useState(false);
  
  const { user } = useAuth();
  const { canWatchVideo, getAccessMessage } = useVideoAccess();
  
  const canWatch = canWatchVideo(video, []);
  const accessMessage = getAccessMessage(video);

  // Mock episodes data - in real app, this would come from props or API
  const upcomingEpisodes = useMemo<Episode[]>(() => {
    // Different video content based on the current video category
    const getEpisodesForCategory = (category: string): Episode[] => {
      switch (category.toLowerCase()) {
        case 'mental health':
        case 'anxiety':
          return [
            {
              id: 2,
              title: "Advanced Anxiety Management Techniques",
              description: "Deep dive into cognitive behavioral therapy and advanced coping strategies",
              duration: "24:15",
              thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
              accessTier: 'premium' as const,
              isFirstEpisode: false,
              seriesId: video.seriesId,
              episodeNumber: 2,
              isCompleted: false,
              progress: 0,
              videoUrl: "https://www.youtube.com/embed/ZidGozDhOjg" // Anxiety management techniques
            },
            {
              id: 3,
              title: "Building Resilience in Daily Life",
              description: "Practical exercises for developing emotional resilience and mental strength",
              duration: "19:45",
              thumbnail: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=250&fit=crop",
              accessTier: 'premium' as const,
              isFirstEpisode: false,
              seriesId: video.seriesId,
              episodeNumber: 3,
              isCompleted: false,
              progress: 0,
              videoUrl: "https://www.youtube.com/embed/DxIDKZHW3-E" // Building resilience
            },
            {
              id: 4,
              title: "Mindful Breathing Masterclass",
              description: "Master advanced breathing techniques for immediate anxiety relief",
              duration: "16:30",
              thumbnail: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=250&fit=crop",
              accessTier: 'premium' as const,
              isFirstEpisode: false,
              seriesId: video.seriesId,
              episodeNumber: 4,
              isCompleted: false,
              progress: 0,
              videoUrl: "https://www.youtube.com/embed/inpok4MKVLM" // Breathing techniques
            }
          ];
        
        case 'mindfulness':
        case 'meditation':
          return [
            {
              id: 2,
              title: "Body Scan Meditation Practice",
              description: "Learn to systematically relax your body and mind through guided body scanning",
              duration: "22:10",
              thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
              accessTier: 'premium' as const,
              isFirstEpisode: false,
              seriesId: video.seriesId,
              episodeNumber: 2,
              isCompleted: false,
              progress: 0,
              videoUrl: "https://www.youtube.com/embed/15q-N-_kkrU" // Body scan meditation
            },
            {
              id: 3,
              title: "Walking Meditation in Nature",
              description: "Discover how to practice mindfulness while moving and connecting with nature",
              duration: "18:30",
              thumbnail: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=250&fit=crop",
              accessTier: 'premium' as const,
              isFirstEpisode: false,
              seriesId: video.seriesId,
              episodeNumber: 3,
              isCompleted: false,
              progress: 0,
              videoUrl: "https://www.youtube.com/embed/vmx0TXtWwRc" // Walking meditation
            },
            {
              id: 4,
              title: "Loving-Kindness Meditation",
              description: "Cultivate compassion and love for yourself and others through this powerful practice",
              duration: "20:45",
              thumbnail: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=250&fit=crop",
              accessTier: 'premium' as const,
              isFirstEpisode: false,
              seriesId: video.seriesId,
              episodeNumber: 4,
              isCompleted: false,
              progress: 0,
              videoUrl: "https://www.youtube.com/embed/sz7cpV7ERsM" // Loving-kindness meditation
            }
          ];
        
        case 'relationships':
        case 'emotional wellness':
          return [
            {
              id: 2,
              title: "Effective Communication Skills",
              description: "Master the art of expressing yourself clearly and listening with empathy",
              duration: "26:20",
              thumbnail: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=250&fit=crop",
              accessTier: 'premium' as const,
              isFirstEpisode: false,
              seriesId: video.seriesId,
              episodeNumber: 2,
              isCompleted: false,
              progress: 0,
              videoUrl: "https://www.youtube.com/embed/HAnw168huqA" // Communication skills
            },
            {
              id: 3,
              title: "Setting Healthy Boundaries",
              description: "Learn to protect your energy and maintain healthy relationships through boundaries",
              duration: "21:15",
              thumbnail: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=250&fit=crop",
              accessTier: 'premium' as const,
              isFirstEpisode: false,
              seriesId: video.seriesId,
              episodeNumber: 3,
              isCompleted: false,
              progress: 0,
              videoUrl: "https://www.youtube.com/embed/6_N_uvq41Pg" // Setting boundaries
            },
            {
              id: 4,
              title: "Conflict Resolution Strategies",
              description: "Transform conflicts into opportunities for deeper understanding and connection",
              duration: "23:50",
              thumbnail: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=250&fit=crop",
              accessTier: 'premium' as const,
              isFirstEpisode: false,
              seriesId: video.seriesId,
              episodeNumber: 4,
              isCompleted: false,
              progress: 0,
              videoUrl: "https://www.youtube.com/embed/Yq5pJ0q3xuc" // Conflict resolution
            }
          ];
        
        case 'nutrition':
        case 'wellness':
          return [
            {
              id: 2,
              title: "Meal Planning for Mental Clarity",
              description: "Design meal plans that support cognitive function and emotional stability",
              duration: "19:30",
              thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=250&fit=crop",
              accessTier: 'premium' as const,
              isFirstEpisode: false,
              seriesId: video.seriesId,
              episodeNumber: 2,
              isCompleted: false,
              progress: 0,
              videoUrl: "https://www.youtube.com/embed/TvQViPBAvPk" // Nutrition for mental health
            },
            {
              id: 3,
              title: "Understanding Gut-Brain Connection",
              description: "Explore how your digestive health directly impacts your mental wellbeing",
              duration: "24:40",
              thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=250&fit=crop",
              accessTier: 'premium' as const,
              isFirstEpisode: false,
              seriesId: video.seriesId,
              episodeNumber: 3,
              isCompleted: false,
              progress: 0,
              videoUrl: "https://www.youtube.com/embed/awtmTJW9ic8" // Gut-brain connection
            },
            {
              id: 4,
              title: "Anti-Inflammatory Foods for Mood",
              description: "Discover foods that reduce inflammation and naturally boost your mood",
              duration: "17:25",
              thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=250&fit=crop",
              accessTier: 'premium' as const,
              isFirstEpisode: false,
              seriesId: video.seriesId,
              episodeNumber: 4,
              isCompleted: false,
              progress: 0,
              videoUrl: "https://www.youtube.com/embed/jastdRMNDP8" // Anti-inflammatory foods
            }
          ];
        
        default:
          // Personal Growth / General content
          return [
            {
              id: 2,
              title: "Morning Routines for Success",
              description: "Build powerful morning rituals that set you up for productive, fulfilling days",
              duration: "20:15",
              thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
              accessTier: 'premium' as const,
              isFirstEpisode: false,
              seriesId: video.seriesId,
              episodeNumber: 2,
              isCompleted: false,
              progress: 0,
              videoUrl: "https://www.youtube.com/embed/gA8xki3eFs4" // Morning routines
            },
            {
              id: 3,
              title: "Goal Setting That Actually Works",
              description: "Learn science-backed strategies for setting and achieving meaningful goals",
              duration: "25:30",
              thumbnail: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=250&fit=crop",
              accessTier: 'premium' as const,
              isFirstEpisode: false,
              seriesId: video.seriesId,
              episodeNumber: 3,
              isCompleted: false,
              progress: 0,
              videoUrl: "https://www.youtube.com/embed/7bB_fVDlvhc" // Goal setting
            },
            {
              id: 4,
              title: "Building Unshakeable Confidence",
              description: "Develop deep, lasting confidence that isn't dependent on external validation",
              duration: "22:20",
              thumbnail: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=250&fit=crop",
              accessTier: 'premium' as const,
              isFirstEpisode: false,
              seriesId: video.seriesId,
              episodeNumber: 4,
              isCompleted: false,
              progress: 0,
              videoUrl: "https://www.youtube.com/embed/w-HYZv6HzAs" // Building confidence
            }
          ];
      }
    };

    return getEpisodesForCategory(video.category);
  }, [video.category, video.seriesId]);

  // Memoized mock data for lessons
  const lessons = useMemo<Lesson[]>(() => [
    {
      id: 1,
      title: "Understanding Your Triggers",
      description: "Identify what causes your cravings and learn to recognize patterns",
      duration: "12:30",
      thumbnail: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=250&fit=crop",
      accessTier: 'free',
      isFirstEpisode: true
    },
    {
      id: 2,
      title: "Breaking the Sugar Cycle",
      description: "Learn the science behind sugar addiction and how to break free",
      duration: "15:45",
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
      accessTier: 'premium',
      isFirstEpisode: false
    },
    {
      id: 3,
      title: "Mindful Eating Techniques",
      description: "Develop awareness around your eating habits and food choices",
      duration: "18:20",
      thumbnail: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=250&fit=crop",
      accessTier: 'premium',
      isFirstEpisode: false
    },
  ], []);

  const communityPosts = useMemo<CommunityPost[]>(() => [
    {
      id: 1,
      author: "Sarah M.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      timeAgo: "2 hours ago",
      content: "Day 30 sugar-free! This course changed my life. The withdrawal was tough but the strategies in lesson 5 really helped.",
      likes: 124,
      replies: 18
    },
    {
      id: 2,
      author: "John D.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      timeAgo: "5 hours ago",
      content: "Just finished lesson 3 about mindful eating. Never realized how much I was eating on autopilot. Anyone else have this revelation?",
      likes: 89,
      replies: 12
    },
    {
      id: 3,
      author: "Emily R.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      timeAgo: "1 day ago",
      content: "Success story: Lost 15 pounds in 2 months after breaking my sugar addiction. Energy levels are through the roof! 🚀",
      likes: 256,
      replies: 34
    }
  ], []);

  const practiceQuestions = useMemo<PracticeQuestion[]>(() => [
    {
      id: 1,
      question: "What is the primary hormone responsible for sugar cravings?",
      options: ["Insulin", "Ghrelin", "Dopamine", "Cortisol"],
      correctAnswer: 2
    },
    {
      id: 2,
      question: "How long does it typically take to break a sugar addiction?",
      options: ["3-5 days", "1 week", "21-30 days", "6 months"],
      correctAnswer: 2
    },
    {
      id: 3,
      question: "Which strategy is most effective for managing sugar withdrawal symptoms?",
      options: ["Cold turkey approach", "Gradual reduction", "Substitution with artificial sweeteners", "Increased protein intake"],
      correctAnswer: 1
    }
  ], []);

  // Optimized handlers
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const handleLessonSelect = useCallback((lessonId: number) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson && canWatchVideo(lesson as any, [])) {
      setCurrentLesson(lessonId);
    }
  }, [lessons, canWatchVideo]);

  const handleEpisodeSelect = useCallback((episode: Episode) => {
    if (canWatchVideo(episode as any, [])) {
      // Navigate to the new episode
      console.log('Playing episode:', episode);
      // In real app, this would update the current video and reload the modal
    } else {
      // Show upgrade prompt
      console.log('Episode locked, show upgrade prompt');
    }
  }, [canWatchVideo]);

  const handleAnswerSelect = useCallback((questionId: number, optionIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  }, []);

  const handleQuizReset = useCallback(() => {
    setSelectedAnswers({});
    setShowResults(false);
  }, []);

  const handleUpgradeClick = useCallback(() => {
    onOpenChange(false);
    window.location.href = '/upgrade';
  }, [onOpenChange]);

  // Access denied modal
  if (!canWatch) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <div className="text-center p-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Premium Content
            </h2>
            
            <p className="text-gray-600 mb-6">
              {accessMessage}
            </p>
            
            <div className="space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
                onClick={handleUpgradeClick}
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => onOpenChange(false)}
              >
                Back to Videos
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const currentLessonData = lessons[currentLesson - 1];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[100vw] w-full h-[100vh] m-0 p-0 bg-black border-0 rounded-none overflow-hidden">
        <div className="relative w-full h-full overflow-y-auto overflow-x-hidden bg-gradient-to-b from-zinc-900 to-black">
          
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="fixed top-4 right-4 z-50 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white w-10 h-10"
          >
            <X className="h-5 w-5" />
          </Button>
          
          {/* Video Player Section */}
          <div className="relative w-full">
            {video.videoUrl ? (
              <div className="relative w-full bg-black">
                <div className="relative mx-auto" style={{ maxWidth: '1400px' }}>
                  <div className="relative aspect-video w-full">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={video.videoUrl} 
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      allowFullScreen
                      className="w-full h-full"
                    />
                    
                    {/* Video Controls Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-8 pb-12">
                      <div className="max-w-[1400px] mx-auto">
                        <div className="mb-4">
                          <p className="text-white/80 text-sm">Episode {video.episodeNumber || 1} of {upcomingEpisodes.length + 1}</p>
                          <h2 className="text-white text-2xl font-bold">{video.title}</h2>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button size="icon" className="rounded-full bg-white/20 backdrop-blur hover:bg-white/30 text-white">
                            <Pause className="h-4 w-4" />
                          </Button>
                          <Button size="icon" className="rounded-full bg-white/20 backdrop-blur hover:bg-white/30 text-white">
                            <Volume2 className="h-4 w-4" />
                          </Button>
                          <Button size="icon" className="rounded-full bg-white/20 backdrop-blur hover:bg-white/30 text-white">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-[50vh] bg-gradient-to-b from-zinc-800 to-zinc-900 flex items-center justify-center">
                <Play className="w-20 h-20 text-white/50" />
              </div>
            )}
          </div>
          
          {/* Content Section */}
          <div className="relative px-8 lg:px-12 pb-20">
            <div className="max-w-[1400px] mx-auto">
              
              {/* Title and Actions */}
              <div className="mb-8">
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  {video.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400 mb-6">
                  <span className="text-green-500 font-semibold">95% Match</span>
                  <span>{new Date().getFullYear()}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {video.duration}
                  </span>
                  <span className="px-2 py-0.5 border border-zinc-600 rounded text-xs">HD</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {video.views}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="lg" className="bg-white hover:bg-white/90 text-black font-bold rounded px-8">
                    <Play className="w-5 h-5 mr-2 fill-black" />
                    Play
                  </Button>
                  <Button size="lg" variant="outline" className="bg-zinc-800/80 hover:bg-zinc-700 text-white border-zinc-700 rounded px-8">
                    <Plus className="w-5 h-5 mr-2" />
                    My List
                  </Button>
                  <Button size="icon" variant="outline" className="rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white border-zinc-700 w-12 h-12">
                    <ThumbsUp className="w-5 h-5" />
                  </Button>
                  <Button size="icon" variant="outline" className="rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white border-zinc-700 w-12 h-12">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              {/* Expert Info */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">{video.expert}</p>
                  <p className="text-zinc-400 text-sm">Wellness Expert</p>
                </div>
              </div>
              
              {/* Tabs Navigation */}
              <div className="border-b border-zinc-800 mb-8">
                <div className="flex gap-8 overflow-x-auto">
                  {['Overview', 'Lessons', 'Practice', 'Community'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => handleTabChange(tab.toLowerCase())}
                      className={`pb-4 px-1 text-lg font-semibold transition-all relative whitespace-nowrap ${
                        activeTab === tab.toLowerCase() ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {tab}
                      {activeTab === tab.toLowerCase() && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500 rounded-t" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Tab Content */}
              <div className="pb-12">
                {activeTab === 'overview' && (
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Stats Cards */}
                    <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                      <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-6 border border-zinc-800">
                        <div className="flex items-center gap-3 mb-2">
                          <BookOpen className="w-5 h-5 text-purple-400" />
                          <span className="text-2xl font-bold text-white">{upcomingEpisodes.length + 1} Episodes</span>
                        </div>
                        <p className="text-zinc-500 text-sm">Complete series</p>
                      </div>
                      <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-6 border border-zinc-800">
                        <div className="flex items-center gap-3 mb-2">
                          <ThumbsUp className="w-5 h-5 text-blue-400" />
                          <span className="text-2xl font-bold text-white">80K Liked</span>
                        </div>
                        <p className="text-zinc-500 text-sm">Community approved</p>
                      </div>
                      <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-6 border border-zinc-800">
                        <div className="flex items-center gap-3 mb-2">
                          <Users className="w-5 h-5 text-green-400" />
                          <span className="text-2xl font-bold text-white">88,800 Enrolled</span>
                        </div>
                        <p className="text-zinc-500 text-sm">Active learners</p>
                      </div>
                    </div>
                    
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                      <h2 className="text-3xl font-bold text-white mb-4">Transform your wellness journey!</h2>
                      <p className="text-zinc-300 text-lg leading-relaxed mb-6">
                        {video.fullDescription || video.description}
                      </p>
                      
                      {video.learningObjectives && (
                        <div className="mt-8">
                          <h3 className="text-xl font-bold text-white mb-4">What you'll learn</h3>
                          <div className="space-y-3">
                            {video.learningObjectives.map((objective, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Check className="w-3 h-3 text-purple-400" />
                                </div>
                                <span className="text-zinc-300">{objective}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                      <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-6 border border-zinc-800">
                        <h3 className="text-lg font-bold text-white mb-4">Series Details</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Episodes</span>
                            <span className="text-white">{upcomingEpisodes.length + 1}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Category</span>
                            <span className="text-white">{video.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Level</span>
                            <span className="text-white">All Levels</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Rating</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-white">{video.rating}</span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Access</span>
                            <span className="text-white capitalize">{video.accessTier}</span>
                          </div>
                        </div>
                        
                        <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white">
                          Continue Learning
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'lessons' && (
                  <div className="space-y-8">
                    <div className="bg-zinc-900/50 rounded-lg p-8 border border-zinc-800">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">Expert Notes from {video.expert}</h3>
                          <p className="text-zinc-400 text-sm">Key insights and takeaways</p>
                        </div>
                      </div>

                      <div className="space-y-8">
                        {/* Main Lesson */}
                        <div>
                          <h4 className="text-2xl font-bold text-white mb-4">
                            The Core Truth: <span className="bg-gradient-primary bg-clip-text text-transparent">Simple. Beats. Complex.</span>
                          </h4>
                          <p className="text-zinc-300 text-lg leading-relaxed mb-6">
                            It sounds backwards, right? We're taught to believe the best solutions are big, complex, and full of features. 
                            The more you build, the more valuable it should be. But the reality is almost the opposite.
                          </p>
                          
                          <div className="bg-zinc-800/50 rounded-lg p-6 border-l-4 border-purple-500">
                            <div className="space-y-3 text-zinc-300">
                              <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span>The simpler the approach, the faster people "get it."</span>
                              </div>
                              <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span>The simpler the process, the easier it is to follow.</span>
                              </div>
                              <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span>And the simpler the idea, the bigger the transformation.</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Key Insights */}
                        <div>
                          <h4 className="text-xl font-bold text-white mb-6">Key Insights for Your Journey</h4>
                          <div className="grid gap-6">
                            
                            <div className="bg-zinc-800/30 rounded-lg p-6">
                              <h5 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                <span className="text-2xl">🧠</span>
                                Start with Self-Awareness
                              </h5>
                              <p className="text-zinc-300 leading-relaxed">
                                Most people overcomplicate their healing journey. But some of the most profound breakthroughs 
                                come from shockingly simple realizations about yourself.
                              </p>
                            </div>

                            <div className="bg-zinc-800/30 rounded-lg p-6">
                              <h5 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                <span className="text-2xl">⚡</span>
                                One Change at a Time
                              </h5>
                              <p className="text-zinc-300 leading-relaxed">
                                A solo practitioner built lasting change with what? One simple habit shift. 
                                When they launched their transformation, progress was slow. So they went all-in on one approach.
                              </p>
                            </div>

                            <div className="bg-zinc-800/30 rounded-lg p-6">
                              <h5 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                <span className="text-2xl">🎯</span>
                                Focus on What Works
                              </h5>
                              <p className="text-zinc-300 leading-relaxed">
                                There are tons of complex strategies out there, but this approach wins for different reasons. 
                                It grows steadily, appealing to people willing to commit to genuine change.
                              </p>
                            </div>

                            <div className="bg-zinc-800/30 rounded-lg p-6">
                              <h5 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                <span className="text-2xl">🌱</span>
                                Small Steps, Big Results
                              </h5>
                              <p className="text-zinc-300 leading-relaxed">
                                You don't need fancy techniques or complicated systems. Just consistent action on the fundamentals. 
                                That's the power of keeping it simple.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Call to Action */}
                        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-6 border border-purple-500/20">
                          <h4 className="text-xl font-bold text-white mb-4">Your Next Step</h4>
                          <p className="text-zinc-300 leading-relaxed mb-4">
                            I hope you take these insights and apply them to your wellness journey. 
                            Remember: progress over perfection, simple over complex.
                          </p>
                          <p className="text-purple-400 font-semibold">
                            Start where you are. Use what you have. Do what you can.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'practice' && (
                  <div className="space-y-6">
                    <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
                      <h3 className="text-xl font-bold text-white mb-4">Test Your Knowledge</h3>
                      <p className="text-zinc-400 mb-6">Answer these questions to reinforce your learning</p>
                      
                      {practiceQuestions.map((q, index) => (
                        <div key={q.id} className="mb-8 pb-8 border-b border-zinc-800 last:border-0">
                          <h4 className="text-white font-semibold mb-4">
                            Question {index + 1}: {q.question}
                          </h4>
                          <div className="space-y-3">
                            {q.options.map((option, optionIndex) => (
                              <label
                                key={optionIndex}
                                className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                                  selectedAnswers[q.id] === optionIndex
                                    ? 'bg-purple-900/30 border-purple-500'
                                    : 'bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${q.id}`}
                                  className="mr-3"
                                  checked={selectedAnswers[q.id] === optionIndex}
                                  onChange={() => handleAnswerSelect(q.id, optionIndex)}
                                />
                                <span className="text-white">{option}</span>
                                {showResults && q.correctAnswer === optionIndex && (
                                  <Check className="w-5 h-5 text-green-500 ml-auto" />
                                )}
                                {showResults && selectedAnswers[q.id] === optionIndex && q.correctAnswer !== optionIndex && (
                                  <X className="w-5 h-5 text-red-500 ml-auto" />
                                )}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      <div className="flex gap-4">
                        <Button 
                          onClick={() => setShowResults(!showResults)}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          {showResults ? 'Hide Results' : 'Check Answers'}
                        </Button>
                        {showResults && (
                          <Button 
                            onClick={handleQuizReset}
                            variant="outline"
                            className="border-zinc-700 text-white hover:bg-zinc-800"
                          >
                            Reset Quiz
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'community' && (
                  <div className="space-y-6">
                    {/* Post Input */}
                    <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500"></div>
                        <div className="flex-1">
                          <textarea 
                            placeholder="Share your thoughts, experiences, or success story..."
                            className="w-full bg-zinc-800 text-white placeholder-zinc-500 rounded-lg p-3 border border-zinc-700 focus:border-purple-500 focus:outline-none resize-none"
                            rows={3}
                          />
                          <div className="flex justify-end mt-3">
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Community Posts */}
                    {communityPosts.map((post) => (
                      <div key={post.id} className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
                        <div className="flex gap-4">
                          <img 
                            src={post.avatar} 
                            alt={post.author}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <span className="text-white font-semibold">{post.author}</span>
                                <span className="text-zinc-500 text-sm ml-2">{post.timeAgo}</span>
                              </div>
                            </div>
                            <p className="text-zinc-300 mb-4">{post.content}</p>
                            <div className="flex items-center gap-6 text-sm">
                              <button className="flex items-center gap-2 text-zinc-400 hover:text-purple-400 transition-colors">
                                <ThumbsUp className="w-4 h-4" />
                                <span>{post.likes}</span>
                              </button>
                              <button className="flex items-center gap-2 text-zinc-400 hover:text-purple-400 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span>{post.replies} replies</span>
                              </button>
                              <button className="flex items-center gap-2 text-zinc-400 hover:text-purple-400 transition-colors ml-auto">
                                <Share2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="text-center">
                      <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                        Load More Posts
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Up Next Episodes Section - Netflix Style */}
              {upcomingEpisodes.length > 0 && (
                <div className="mt-12 pt-8 border-t border-zinc-800">
                  <h3 className="text-2xl font-bold text-white mb-8">More Episodes</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {upcomingEpisodes.map((episode) => {
                      const canWatchEpisode = canWatchVideo(episode as any, []);
                      return (
                        <div 
                          key={episode.id}
                          onClick={() => canWatchEpisode && handleEpisodeSelect(episode)}
                          className={`group relative transition-all duration-300 ${
                            canWatchEpisode 
                              ? 'cursor-pointer' 
                              : 'cursor-pointer'
                          }`}
                        >
                          {/* Main Thumbnail */}
                          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-zinc-800">
                            <img 
                              src={episode.thumbnail} 
                              alt={episode.title}
                              className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-50"
                            />
                            
                            {/* Episode Number Badge */}
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-black/70 text-white text-sm px-2 py-1">
                                {episode.episodeNumber}
                              </Badge>
                            </div>
                            
                            {/* Duration */}
                            <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
                              {episode.duration}
                            </div>
                            
                            {/* Premium Badge */}
                            {episode.accessTier === 'premium' && (
                              <div className="absolute top-3 right-3">
                                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm">
                                  <Crown className="w-4 h-4" />
                                </Badge>
                              </div>
                            )}

                            {/* Hover Overlay Content */}
                            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4">
                              {/* Lock Icon for Premium Content */}
                              {!canWatchEpisode && (
                                <div className="absolute top-4 left-4">
                                  <Lock className="w-6 h-6 text-white" />
                                </div>
                              )}
                              
                              {/* Play Icon */}
                              <div className="mb-4">
                                {canWatchEpisode ? (
                                  <div className="rounded-full p-4 bg-white/20 backdrop-blur-sm">
                                    <Play className="w-8 h-8 text-white" />
                                  </div>
                                ) : (
                                  <div className="rounded-full p-4 bg-orange-500/20 backdrop-blur-sm">
                                    <Crown className="w-8 h-8 text-orange-400" />
                                  </div>
                                )}
                              </div>
                              
                              {/* Episode Info */}
                              <div className="text-center text-white">
                                <h4 className="font-bold text-xl mb-2 line-clamp-2">
                                  {episode.title}
                                </h4>
                                <p className="text-sm text-zinc-300 mb-4 line-clamp-3">
                                  {episode.description}
                                </p>
                                
                                {/* Action Button */}
                                {canWatchEpisode && (
                                  <Button 
                                    size="sm" 
                                    className="bg-white text-black hover:bg-white/90 font-medium"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEpisodeSelect(episode);
                                    }}
                                  >
                                    <Play className="w-4 h-4 mr-2" />
                                    Watch Now
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Episode Title Below */}
                          <div className="mt-3">
                            <h4 className="text-white font-semibold text-base line-clamp-2">
                              {episode.episodeNumber}. {episode.title}
                            </h4>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;