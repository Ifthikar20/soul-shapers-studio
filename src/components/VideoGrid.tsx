import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Play, Clock, User, Star, TrendingUp, Bookmark, X, 
  Calendar, BookOpen, ChevronRight, Filter, Search, 
  Heart, Share2, MoreVertical, Eye, Users, Award, 
  Target, Zap, Pause, Volume2, Settings, Plus, 
  ThumbsUp, Check, Lock, Crown
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Enhanced Video Content Interface with Access Control
interface VideoContent {
  id: number;
  title: string;
  expert: string;
  expertCredentials?: string;
  duration: string;
  category: string;
  rating: number;
  views: string;
  thumbnail: string;
  videoUrl?: string;
  isNew: boolean;
  isTrending: boolean;
  description: string;
  fullDescription?: string;
  relatedTopics?: string[];
  learningObjectives?: string[];
  expertAvatar?: string;
  
  // Access control fields
  accessTier: 'free' | 'basic' | 'premium';
  isFirstEpisode?: boolean;
  seriesId?: string;
  episodeNumber?: number;
}

// Video Access Hook
const useVideoAccess = () => {
  const { user, canAccessContent } = useAuth();

  const canWatchVideo = (video: VideoContent, allVideosInSeries?: VideoContent[]): boolean => {
    // Free tier access rules
    if (!user || user.subscription_tier === 'free') {
      // Always allow access to free content
      if (video.accessTier === 'free') return true;
      
      // Allow first episode of any series for free users
      if (video.isFirstEpisode || video.episodeNumber === 1) return true;
      
      // If it's part of a series, check if it's the first video
      if (allVideosInSeries && video.seriesId) {
        const sortedVideos = allVideosInSeries
          .filter(v => v.seriesId === video.seriesId)
          .sort((a, b) => (a.episodeNumber || 0) - (b.episodeNumber || 0));
        
        return sortedVideos[0]?.id === video.id;
      }
      
      return false;
    }

    // Premium/Basic users can access content based on their tier
    return canAccessContent(video.accessTier);
  };

  const getAccessMessage = (video: VideoContent): string => {
    if (!user) {
      return "Sign in to watch this content";
    }

    if (user.subscription_tier === 'free') {
      if (video.episodeNumber && video.episodeNumber > 1) {
        return "Upgrade to Premium to watch full series";
      }
      return "Upgrade to Premium to access this content";
    }

    if (!canAccessContent(video.accessTier)) {
      return `Upgrade to ${video.accessTier} to watch this content`;
    }

    return "";
  };

  return {
    canWatchVideo,
    getAccessMessage
  };
};

const videos: VideoContent[] = [
  {
    id: 1,
    title: "Understanding Anxiety: A Complete Guide - Episode 1",
    expert: "Dr. Sarah Johnson",
    expertCredentials: "Clinical Psychologist, PhD in Mental Health",
    expertAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
    duration: "18:30",
    category: "Mental Health",
    rating: 4.9,
    views: "12.5k",
    thumbnail: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=250&fit=crop",
    isNew: true,
    isTrending: true,
    description: "A comprehensive guide to understanding anxiety disorders.",
    fullDescription: "Dive deep into the complexities of anxiety, exploring its psychological and physiological impacts. Learn evidence-based strategies for managing and overcoming anxiety in your daily life.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    relatedTopics: ["Stress Management", "Cognitive Behavioral Techniques", "Mindfulness"],
    learningObjectives: [
      "Understand the different types of anxiety disorders",
      "Identify personal anxiety triggers",
      "Learn practical coping mechanisms"
    ],
    accessTier: 'free',
    isFirstEpisode: true,
    seriesId: "anxiety-series-1",
    episodeNumber: 1
  },
  {
    id: 2,
    title: "Advanced Anxiety Management - Episode 2",
    expert: "Dr. Sarah Johnson",
    expertCredentials: "Clinical Psychologist, PhD in Mental Health",
    expertAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
    duration: "22:15",
    category: "Mental Health",
    rating: 4.8,
    views: "8.3k",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    isNew: false,
    isTrending: true,
    description: "Learn advanced techniques for managing anxiety.",
    fullDescription: "Discover proven methods to reduce anxiety and improve your overall well-being through advanced techniques.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    relatedTopics: ["Advanced CBT", "Exposure Therapy", "Mindfulness"],
    learningObjectives: [
      "Master advanced breathing techniques",
      "Develop a personal anxiety toolkit",
      "Create healthy coping strategies"
    ],
    accessTier: 'premium',
    isFirstEpisode: false,
    seriesId: "anxiety-series-1",
    episodeNumber: 2
  },
  {
    id: 3,
    title: "Building Healthy Relationships",
    expert: "Dr. Emily Rodriguez",
    expertCredentials: "Relationship Therapist, LMFT",
    expertAvatar: "https://images.unsplash.com/photo-1594824388853-d0b8ccbfbb3d?w=100&h=100&fit=crop&crop=face",
    duration: "25:40",
    category: "Relationships",
    rating: 4.7,
    views: "15.2k",
    thumbnail: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=250&fit=crop",
    isNew: true,
    isTrending: false,
    description: "Essential skills for maintaining healthy relationships.",
    fullDescription: "Explore the fundamentals of building and maintaining strong, healthy relationships in all areas of your life.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    relatedTopics: ["Communication", "Emotional Intelligence", "Conflict Resolution"],
    learningObjectives: [
      "Improve communication skills",
      "Set healthy boundaries",
      "Resolve conflicts constructively"
    ],
    accessTier: 'free',
  },
  {
    id: 4,
    title: "Mindfulness for Beginners - Episode 1",
    expert: "Dr. James Park",
    expertCredentials: "Mindfulness Instructor, PhD in Neuroscience",
    expertAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    duration: "16:20",
    category: "Mindfulness",
    rating: 4.9,
    views: "20.1k",
    thumbnail: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=250&fit=crop",
    isNew: false,
    isTrending: true,
    description: "Start your mindfulness journey with simple practices.",
    fullDescription: "Begin your mindfulness practice with gentle, accessible techniques designed for complete beginners.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    relatedTopics: ["Meditation", "Present Moment Awareness", "Breathing Exercises"],
    learningObjectives: [
      "Learn basic mindfulness techniques",
      "Establish a daily practice",
      "Reduce mental chatter and increase focus"
    ],
    accessTier: 'free',
    isFirstEpisode: true,
    seriesId: "mindfulness-series-1",
    episodeNumber: 1
  },
  {
    id: 5,
    title: "Advanced Mindfulness Techniques - Episode 2",
    expert: "Dr. James Park",
    expertCredentials: "Mindfulness Instructor, PhD in Neuroscience",
    expertAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    duration: "19:45",
    category: "Mindfulness",
    rating: 4.8,
    views: "11.7k",
    thumbnail: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=250&fit=crop",
    isNew: true,
    isTrending: false,
    description: "Deepen your mindfulness practice with advanced techniques.",
    fullDescription: "Transform your mindfulness practice using advanced strategies for deeper awareness and presence.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    relatedTopics: ["Deep Meditation", "Body Scanning", "Loving Kindness"],
    learningObjectives: [
      "Master advanced meditation techniques",
      "Develop deeper self-awareness",
      "Cultivate compassion and loving-kindness"
    ],
    accessTier: 'premium',
    isFirstEpisode: false,
    seriesId: "mindfulness-series-1",
    episodeNumber: 2
  },
  {
    id: 6,
    title: "Nutrition for Mental Health",
    expert: "Dr. Maria Garcia",
    expertCredentials: "Nutritional Psychiatrist, MD, PhD",
    expertAvatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face",
    duration: "21:30",
    category: "Nutrition",
    rating: 4.6,
    views: "9.8k",
    thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=250&fit=crop",
    isNew: false,
    isTrending: false,
    description: "How food choices impact your mental wellbeing.",
    fullDescription: "Discover the powerful connection between nutrition and mental health, learning which foods support optimal brain function.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    relatedTopics: ["Brain Health", "Mood Foods", "Nutritional Psychology"],
    learningObjectives: [
      "Understand the gut-brain connection",
      "Identify mood-supporting nutrients",
      "Plan meals for mental wellness"
    ],
    accessTier: 'premium',
  }
];

// Video Modal Component remains the same
const VideoModal = ({ 
  video, 
  open, 
  onOpenChange 
}: { 
  video: VideoContent, 
  open: boolean, 
  onOpenChange: (open: boolean) => void 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentLesson, setCurrentLesson] = useState(1);
  const { user } = useAuth();
  const { canWatchVideo, getAccessMessage } = useVideoAccess();
  
  const canWatch = canWatchVideo(video, videos);
  const accessMessage = getAccessMessage(video);
  
  // Mock lessons data
  const lessons = [
    {
      id: 1,
      title: "Understanding Your Triggers",
      description: "Identify what causes your cravings and learn to recognize patterns",
      duration: "12:30",
      thumbnail: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=250&fit=crop",
      accessTier: 'free' as const,
      isFirstEpisode: true
    },
    {
      id: 2,
      title: "Breaking the Sugar Cycle",
      description: "Learn the science behind sugar addiction and how to break free",
      duration: "15:45",
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
      accessTier: 'premium' as const,
      isFirstEpisode: false
    },
    {
      id: 3,
      title: "Mindful Eating Techniques",
      description: "Develop awareness around your eating habits and food choices",
      duration: "18:20",
      thumbnail: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=250&fit=crop",
      accessTier: 'premium' as const,
      isFirstEpisode: false
    },
    {
      id: 4,
      title: "Healthy Alternatives",
      description: "Discover satisfying alternatives to sugary foods and drinks",
      duration: "14:15",
      thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=250&fit=crop",
      accessTier: 'premium' as const,
      isFirstEpisode: false
    },
    {
      id: 5,
      title: "Managing Withdrawal",
      description: "Navigate the challenges of sugar withdrawal with proven strategies",
      duration: "16:40",
      thumbnail: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=250&fit=crop",
      accessTier: 'premium' as const,
      isFirstEpisode: false
    },
    {
      id: 6,
      title: "Building New Habits",
      description: "Create sustainable habits that support your sugar-free lifestyle",
      duration: "20:10",
      thumbnail: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=250&fit=crop",
      accessTier: 'premium' as const,
      isFirstEpisode: false
    },
    {
      id: 7,
      title: "Long-term Success Strategies",
      description: "Maintain your progress and prevent relapse with these techniques",
      duration: "22:55",
      thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      accessTier: 'premium' as const,
      isFirstEpisode: false
    }
  ];

  // Mock community posts
  const communityPosts = [
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
  ];

  // Mock practice questions
  const practiceQuestions = [
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
  ];

  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [showResults, setShowResults] = useState(false);
  
  // Show access denied modal if user can't watch
  if (!canWatch) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <div className="text-center p-6">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Premium Content
            </h2>
            
            <p className="text-muted-foreground mb-6">
              {accessMessage}
            </p>
            
            <div className="space-y-3">
              <Button 
                className="w-full bg-gradient-primary hover:opacity-90"
                onClick={() => {
                  onOpenChange(false);
                  window.location.href = '/upgrade';
                }}
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
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[100vw] w-full h-[100vh] m-0 p-0 bg-black border-0 rounded-none overflow-hidden">
        {/* Make this container scrollable */}
        <div className="relative w-full h-full overflow-y-auto overflow-x-hidden bg-gradient-to-b from-zinc-900 to-black">
          
          {/* Close button - now fixed position */}
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
                        {/* Current Lesson Indicator */}
                        <div className="mb-4">
                          <p className="text-white/80 text-sm">Lesson {currentLesson} of {lessons.length}</p>
                          <h2 className="text-white text-2xl font-bold">{lessons[currentLesson - 1].title}</h2>
                        </div>
                        {/* Playback controls */}
                        <div className="flex items-center gap-3">
                          <Button 
                            size="icon" 
                            className="rounded-full bg-white/20 backdrop-blur hover:bg-white/30 text-white"
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            className="rounded-full bg-white/20 backdrop-blur hover:bg-white/30 text-white"
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            className="rounded-full bg-white/20 backdrop-blur hover:bg-white/30 text-white"
                          >
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
              
              {/* Title and Actions Row */}
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
                  <span className="px-2 py-0.5 border border-zinc-600 rounded text-xs">
                    HD
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {video.views}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <Button 
                    size="lg"
                    className="bg-white hover:bg-white/90 text-black font-bold rounded px-8"
                  >
                    <Play className="w-5 h-5 mr-2 fill-black" />
                    Play
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="bg-zinc-800/80 hover:bg-zinc-700 text-white border-zinc-700 rounded px-8"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    My List
                  </Button>
                  <Button 
                    size="icon"
                    variant="outline"
                    className="rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white border-zinc-700 w-12 h-12"
                  >
                    <ThumbsUp className="w-5 h-5" />
                  </Button>
                  <Button 
                    size="icon"
                    variant="outline"
                    className="rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white border-zinc-700 w-12 h-12"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              {/* Expert/Instructor Info */}
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
                      onClick={() => setActiveTab(tab.toLowerCase())}
                      className={`pb-4 px-1 text-lg font-semibold transition-all relative whitespace-nowrap ${
                        activeTab === tab.toLowerCase()
                          ? 'text-white'
                          : 'text-zinc-500 hover:text-zinc-300'
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
              
              {/* Tab Content - keeping the existing tabs structure */}
              <div className="pb-12">
                {activeTab === 'overview' && (
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Stats Cards */}
                    <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                      <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-6 border border-zinc-800">
                        <div className="flex items-center gap-3 mb-2">
                          <BookOpen className="w-5 h-5 text-purple-400" />
                          <span className="text-2xl font-bold text-white">{lessons.length} Lessons</span>
                        </div>
                        <p className="text-zinc-500 text-sm">Interactive content</p>
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
                      <h2 className="text-3xl font-bold text-white mb-4">
                        Transform your wellness journey!
                      </h2>
                      <p className="text-zinc-300 text-lg leading-relaxed mb-6">
                        {video.fullDescription || video.description}
                      </p>
                      
                      {/* Learning Points */}
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
                        <h3 className="text-lg font-bold text-white mb-4">Course Details</h3>
                        <div className="space-y-4">
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
                  <div className="space-y-4">
                    {lessons.map((lesson, index) => {
                      const canWatchLesson = canWatchVideo(lesson as any, []);
                      return (
                        <div 
                          key={lesson.id}
                          onClick={() => canWatchLesson && setCurrentLesson(lesson.id)}
                          className={`flex gap-4 p-4 rounded-lg transition-all ${
                            currentLesson === lesson.id 
                              ? 'bg-zinc-800/80 border border-purple-500/50' 
                              : canWatchLesson
                              ? 'bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800/50 cursor-pointer'
                              : 'bg-zinc-900/30 border border-zinc-800 opacity-60'
                          }`}
                        >
                          <div className="text-2xl font-bold text-zinc-600 w-12">{index + 1}</div>
                          <div className="relative flex-shrink-0">
                            <img 
                              src={lesson.thumbnail} 
                              alt={lesson.title}
                              className="w-32 h-20 object-cover rounded"
                            />
                            <div className="absolute inset-0 bg-black/40 rounded flex items-center justify-center">
                              {canWatchLesson ? (
                                <Play className="w-8 h-8 text-white/80" />
                              ) : (
                                <Lock className="w-6 h-6 text-white/60" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-semibold mb-1">{lesson.title}</h3>
                            <p className="text-zinc-400 text-sm mb-2">{lesson.description}</p>
                            <div className="flex items-center gap-3">
                              <span className="text-zinc-500 text-xs">{lesson.duration}</span>
                              {lesson.accessTier === 'premium' && !lesson.isFirstEpisode && (
                                <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                                  <Crown className="w-3 h-3 mr-1" />
                                  Premium
                                </Badge>
                              )}
                              {lesson.isFirstEpisode && (
                                <Badge className="bg-green-500/20 text-green-400 text-xs">
                                  Free
                                </Badge>
                              )}
                            </div>
                          </div>
                          {currentLesson === lesson.id && canWatchLesson && (
                            <div className="text-purple-400 text-sm self-center">
                              Currently Playing
                            </div>
                          )}
                          {!canWatchLesson && (
                            <div className="text-orange-400 text-sm self-center">
                              <Crown className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {/* Keep existing Practice and Community tabs */}
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
                                  onChange={() => setSelectedAnswers({...selectedAnswers, [q.id]: optionIndex})}
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
                            onClick={() => {
                              setSelectedAnswers({});
                              setShowResults(false);
                            }}
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
              
              {/* Episodes/Lessons Section with Access Control */}
              <div className="mt-16 border-t border-zinc-800 pt-12">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-white">Episodes</h2>
                  <span className="text-zinc-400">{lessons.length} lessons</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {lessons.map((lesson, index) => {
                    const canWatchLesson = canWatchVideo(lesson as any, []);
                    return (
                      <div 
                        key={lesson.id}
                        onClick={() => canWatchLesson && setCurrentLesson(lesson.id)}
                        className={`group ${canWatchLesson ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                      >
                        <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                          <img 
                            src={lesson.thumbnail} 
                            alt={lesson.title}
                            className={`w-full h-full object-cover transition-transform duration-300 ${
                              canWatchLesson ? 'group-hover:scale-105' : 'opacity-60'
                            }`}
                          />
                          
                          {/* Lock overlay for premium content */}
                          {!canWatchLesson && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <div className="text-center text-white">
                                <Lock className="w-6 h-6 mx-auto mb-2" />
                                <p className="text-xs font-medium">Premium</p>
                              </div>
                            </div>
                          )}
                          
                          {/* Play overlay */}
                          {canWatchLesson && (
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="bg-white/90 rounded-full p-3">
                                  <Play className="w-6 h-6 text-black fill-black" />
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Duration badge */}
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                            {lesson.duration}
                          </div>
                          
                          {/* Episode number */}
                          <div className="absolute top-2 left-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">
                            {index + 1}
                          </div>
                          
                          {/* Access badges */}
                          <div className="absolute top-2 right-2">
                            {lesson.isFirstEpisode ? (
                              <Badge className="bg-green-500 text-white text-xs">
                                Free
                              </Badge>
                            ) : lesson.accessTier === 'premium' ? (
                              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                                <Crown className="w-3 h-3 mr-1" />
                                Premium
                              </Badge>
                            ) : null}
                          </div>
                          
                          {/* Progress bar */}
                          {currentLesson > lesson.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-700">
                              <div className="h-full bg-purple-500 w-full"></div>
                            </div>
                          )}
                          {currentLesson === lesson.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-700">
                              <div className="h-full bg-purple-500 w-1/3"></div>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <h3 className={`font-semibold mb-1 transition-colors line-clamp-1 ${
                            canWatchLesson 
                              ? 'text-white group-hover:text-purple-400' 
                              : 'text-zinc-500'
                          }`}>
                            {index + 1}. {lesson.title}
                          </h3>
                          <p className="text-zinc-500 text-sm line-clamp-2">
                            {lesson.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* More Like This Section */}
              <div className="mt-16 border-t border-zinc-800 pt-12">
                <h2 className="text-2xl font-bold text-white mb-8">More Like This</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {videos.slice(0, 4).map((relatedVideo) => (
                    <div key={relatedVideo.id} className="group cursor-pointer">
                      <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                        <img 
                          src={relatedVideo.thumbnail} 
                          alt={relatedVideo.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-sm font-semibold line-clamp-1">{relatedVideo.title}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const VideoGrid = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoContent | null>(null);
  const [visibleVideos, setVisibleVideos] = useState(6);
  
  // Add access control hooks
  const navigate = useNavigate();
  const { user } = useAuth();
  const { canWatchVideo, getAccessMessage } = useVideoAccess();

  const handleVideoPlay = (video: VideoContent) => {
    const canWatch = canWatchVideo(video, videos);
    
    if (canWatch) {
      setSelectedVideo(video);
    } else {
      // Show upgrade prompt or redirect to upgrade page
      navigate('/upgrade');
    }
  };

  const handleLoadMore = () => {
    setVisibleVideos(prev => prev + 3);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-16">
          <div className="text-center md:text-left">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Featured
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent block">
                Content
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl">
              Expert-curated videos for your wellness needs
            </p>
          </div>
          
          {/* Filter Badges */}
          <div className="hidden lg:flex space-x-3">
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-all duration-300 px-4 py-2 rounded-full">
              All
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-all duration-300 px-4 py-2 rounded-full">
              Most Popular
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-all duration-300 px-4 py-2 rounded-full">
              New Releases
            </Badge>
          </div>
        </div>

        {/* Video Grid with Access Control */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.slice(0, visibleVideos).map((video) => {
            const canWatch = canWatchVideo(video, videos);
            const accessMessage = getAccessMessage(video);
            const isLocked = !canWatch;

            return (
              <Card 
                key={video.id} 
                className="cursor-pointer group overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-52 object-cover group-hover:scale-110 transition-all duration-500"
                  />
                  
                  {/* Lock Overlay for Premium Content */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Lock className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm font-medium">Premium Content</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Hover Play Overlay */}
                  <div 
                    onClick={() => handleVideoPlay(video)}
                    className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer"
                  >
                    <div className={`rounded-full p-4 backdrop-blur-sm shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300 ${
                      isLocked ? 'bg-orange-500/90' : 'bg-white/20'
                    }`}>
                      {isLocked ? (
                        <Crown className="w-8 h-8 text-white" />
                      ) : (
                        <Play className="w-8 h-8 text-white" />
                      )}
                    </div>
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {video.isNew && (
                      <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white border-0 rounded-full px-3 py-1 text-xs font-medium">
                        New
                      </Badge>
                    )}
                    {video.isTrending && (
                      <Badge className="bg-white/90 text-primary border-0 rounded-full px-3 py-1 text-xs font-medium">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                    {video.isFirstEpisode && (
                      <Badge className="bg-green-500 text-white border-0 rounded-full px-3 py-1 text-xs font-medium">
                        Free Episode
                      </Badge>
                    )}
                    {video.accessTier === 'premium' && !video.isFirstEpisode && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 rounded-full px-3 py-1 text-xs font-medium">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center backdrop-blur-sm">
                    <Clock className="w-3 h-3 mr-1" />
                    {video.duration}
                  </div>

                  <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white transform translate-y-2 group-hover:translate-y-0">
                    <Bookmark className="w-4 h-4 text-primary" />
                  </button>
                </div>
                
                <CardContent className="p-6">
                  <div className="mb-3">
                    <Badge variant="secondary" className="text-xs rounded-full px-3 py-1">
                      {video.category}
                    </Badge>
                  </div>
                  
                  <h3 className="font-bold text-lg text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
                    {video.title}
                  </h3>
                  
                  <div className="flex items-center text-muted-foreground text-sm mb-4">
                    <User className="w-4 h-4 mr-2" />
                    <span className="font-medium">{video.expert}</span>
                  </div>

                  {/* Access Message for Locked Content */}
                  {isLocked && (
                    <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-orange-700 text-sm font-medium">{accessMessage}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      <span className="font-medium">{video.rating}</span>
                      <span className="mx-2">•</span>
                      <span>{video.views} views</span>
                    </div>
                    
                    {isLocked ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate('/upgrade')}
                        className="text-orange-600 border-orange-200 hover:bg-orange-50 rounded-full"
                      >
                        <Crown className="w-4 h-4 mr-1" />
                        Upgrade
                      </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleVideoPlay(video)}
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-primary hover:bg-primary/10 rounded-full"
                      >
                        Watch
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Load More Button */}
        {visibleVideos < videos.length && (
          <div className="text-center mt-16">
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleLoadMore}
              className="rounded-full px-8 py-3 text-base hover:bg-primary hover:text-white transition-all duration-300"
            >
              Load More Videos
            </Button>
          </div>
        )}

        {/* Video Modal */}
        {selectedVideo && (
          <VideoModal 
            video={selectedVideo} 
            open={!!selectedVideo} 
            onOpenChange={() => setSelectedVideo(null)} 
          />
        )}
      </div>
    </section>
  );
};

export default VideoGrid;