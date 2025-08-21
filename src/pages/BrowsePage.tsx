import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useVideoAccess } from '@/hooks/useVideoAccess';
import { useNavigationTracking } from '@/hooks/useNavigationTracking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, Play, Star, Clock, User, Crown, 
  TrendingUp, ArrowRight, Bookmark, ChevronLeft, ChevronRight,
  Brain, Heart, Leaf, Target, Users as UsersIcon, Zap,
  Sparkles, Info, Plus, CheckCircle, Award, Volume2, VolumeX,
  Gamepad2, Headphones, FileText, Video
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Updated VideoContent interface with missing properties
export interface VideoContent {
  id: number;
  title: string;
  expert: string;
  expertCredentials: string;
  expertAvatar: string;
  duration: string;
  category: string;
  contentType?: 'video' | 'audio' | 'game' | 'exercise' | 'toolkit';
  hashtags?: string[];
  rating: number;
  views: string;
  thumbnail: string;
  isNew: boolean;
  isTrending: boolean;
  description: string;
  fullDescription: string;
  videoUrl: string;
  relatedTopics: string[];
  learningObjectives: string[];
  accessTier: 'free' | 'premium';
  isFirstEpisode?: boolean;
  seriesId?: string;
  episodeNumber?: number;
}

// Content type helper function
const getContentTypeIcon = (contentType: string) => {
  const iconClass = "w-3 h-3 text-gray-500";
  switch (contentType) {
    case 'video':
      return <Video className={iconClass} />;
    case 'audio':
      return <Headphones className={iconClass} />;
    case 'game':
      return <Gamepad2 className={iconClass} />;
    case 'exercise':
      return <Target className={iconClass} />;
    case 'toolkit':
      return <FileText className={iconClass} />;
    default:
      return <Video className={iconClass} />;
  }
};

const getContentTypeBadge = (contentType: string) => {
  const badges = {
    'video': { text: 'Video', color: 'bg-blue-500' },
    'audio': { text: 'Audio', color: 'bg-green-500' },
    'game': { text: 'Interactive', color: 'bg-purple-500' },
    'exercise': { text: 'Exercise', color: 'bg-orange-500' },
    'toolkit': { text: 'Toolkit', color: 'bg-teal-500' }
  };
  
  const badge = badges[contentType as keyof typeof badges] || badges.video;
  return (
    <Badge className={`${badge.color} text-white text-xs font-medium px-2 py-1`}>
      {badge.text}
    </Badge>
  );
};

const mockVideos: VideoContent[] = [
  {
    id: 1,
    title: "Understanding Anxiety: Complete Expert Guide",
    expert: "Dr. Sarah Johnson",
    expertCredentials: "Clinical Psychologist, PhD",
    expertAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
    duration: "18:30",
    category: "Mental Health",
    contentType: "video",
    hashtags: ["#AnxietyRelief", "#MentalHealth", "#ExpertGuidance"],
    rating: 4.9,
    views: "12.5k",
    thumbnail: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=250&fit=crop",
    isNew: true,
    isTrending: true,
    description: "Master anxiety management with evidence-based techniques from leading mental health experts.",
    fullDescription: "Comprehensive guide combining clinical expertise with practical strategies for lasting anxiety relief and emotional resilience.",
    videoUrl: "https://www.youtube.com/watch?v=pcxuXfq118I",
    relatedTopics: ["CBT", "Mindfulness", "Stress Management"],
    learningObjectives: ["Understand anxiety science", "Learn coping strategies", "Build resilience"],
    accessTier: 'free',
    isFirstEpisode: true,
    seriesId: "anxiety-mastery",
    episodeNumber: 1
  },
  {
    id: 2,
    title: "5-Minute Breathing Exercise for Instant Calm",
    expert: "Wellness Team",
    expertCredentials: "Certified Wellness Coaches",
    expertAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    duration: "5:00",
    category: "Quick Relief",
    contentType: "exercise",
    hashtags: ["#QuickRelief", "#Breathing", "#StressRelief"],
    rating: 4.8,
    views: "28.3k",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=250&fit=crop",
    isNew: false,
    isTrending: true,
    description: "Interactive breathing exercise to reduce stress and anxiety in just 5 minutes.",
    fullDescription: "Guided breathing technique with visual cues and calming sounds for immediate stress relief.",
    videoUrl: "https://www.youtube.com/watch?v=d9YM_9CVmtc",
    relatedTopics: ["Breathing", "Quick Relief", "Stress Management"],
    learningObjectives: ["Learn 4-7-8 breathing", "Activate relaxation response", "Build daily practice"],
    accessTier: 'free'
  },
  {
    id: 3,
    title: "Mindful Mood Tracker Game",
    expert: "Better & Bliss Games",
    expertCredentials: "Therapeutic Game Designers",
    expertAvatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop&crop=face",
    duration: "Interactive",
    category: "Wellness Games",
    contentType: "game",
    hashtags: ["#MoodTracking", "#Mindfulness", "#Interactive"],
    rating: 4.7,
    views: "15.7k",
    thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop",
    isNew: true,
    isTrending: true,
    description: "Gamified mood tracking to build emotional awareness and mindfulness habits.",
    fullDescription: "Interactive game that helps you identify patterns, triggers, and build emotional intelligence through play.",
    videoUrl: "https://www.youtube.com/watch?v=example",
    relatedTopics: ["Emotional Intelligence", "Self-Awareness", "Habit Building"],
    learningObjectives: ["Track emotional patterns", "Identify triggers", "Build mindfulness"],
    accessTier: 'free'
  },
  {
    id: 4,
    title: "Cognitive Restructuring Masterclass",
    expert: "Dr. Sarah Johnson",
    expertCredentials: "Clinical Psychologist, PhD",
    expertAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
    duration: "24:15",
    category: "Mental Health",
    contentType: "video",
    hashtags: ["#CBT", "#ThoughtPatterns", "#CognitiveHealth"],
    rating: 4.8,
    views: "8.3k",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    isNew: false,
    isTrending: true,
    description: "Advanced cognitive behavioral techniques for challenging negative thought patterns.",
    fullDescription: "Deep dive into sophisticated CBT protocols used by leading practitioners worldwide.",
    videoUrl: "https://www.youtube.com/watch?v=d9YM_9CVmtc",
    relatedTopics: ["Advanced CBT", "Therapy", "Clinical Skills"],
    learningObjectives: ["Master CBT protocols", "Challenge thoughts", "Improve outcomes"],
    accessTier: 'premium',
    seriesId: "anxiety-mastery",
    episodeNumber: 2
  },
  {
    id: 5,
    title: "Daily Affirmations for Self-Compassion",
    expert: "Mindfulness Collective",
    expertCredentials: "Meditation Teachers",
    expertAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    duration: "10:00",
    category: "Daily Practice",
    contentType: "audio",
    hashtags: ["#SelfCompassion", "#Affirmations", "#DailyPractice"],
    rating: 4.9,
    views: "22.4k",
    thumbnail: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=250&fit=crop",
    isNew: true,
    isTrending: false,
    description: "Guided affirmations to cultivate self-compassion and inner kindness.",
    fullDescription: "Daily practice of positive affirmations designed to build self-acceptance and emotional resilience.",
    videoUrl: "https://www.youtube.com/watch?v=example",
    relatedTopics: ["Self-Compassion", "Positive Psychology", "Daily Rituals"],
    learningObjectives: ["Build self-kindness", "Reduce self-criticism", "Create daily ritual"],
    accessTier: 'free'
  },
  {
    id: 6,
    title: "Stress-Relief Memory Game",
    expert: "Cognitive Wellness Lab",
    expertCredentials: "Neuropsychology Research Team",
    expertAvatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face",
    duration: "Interactive",
    category: "Wellness Games",
    contentType: "game",
    hashtags: ["#MemoryBoost", "#StressRelief", "#CognitiveHealth"],
    rating: 4.6,
    views: "18.9k",
    thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=250&fit=crop",
    isNew: false,
    isTrending: false,
    description: "Cognitive training game that reduces stress while improving memory and focus.",
    fullDescription: "Scientifically-designed memory game that activates the prefrontal cortex to reduce anxiety and improve cognitive function.",
    videoUrl: "https://www.youtube.com/watch?v=example3",
    relatedTopics: ["Cognitive Training", "Memory", "Stress Reduction"],
    learningObjectives: ["Improve working memory", "Reduce mental fatigue", "Enhance focus"],
    accessTier: 'premium'
  },
  {
    id: 7,
    title: "Sleep Stories: Forest Rain Meditation",
    expert: "Sleep Wellness Collective",
    expertCredentials: "Sleep Therapy Specialists",
    expertAvatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop&crop=face",
    duration: "45:00",
    category: "Sleep & Recovery",
    contentType: "audio",
    hashtags: ["#SleepStories", "#Meditation", "#Recovery"],
    rating: 4.9,
    views: "35.2k",
    thumbnail: "https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=400&h=250&fit=crop",
    isNew: false,
    isTrending: true,
    description: "Calming forest soundscape with guided meditation for deep, restorative sleep.",
    fullDescription: "Immersive audio experience combining nature sounds with sleep meditation for optimal rest and recovery.",
    videoUrl: "https://www.youtube.com/watch?v=example4",
    relatedTopics: ["Sleep Hygiene", "Nature Sounds", "Relaxation"],
    learningObjectives: ["Improve sleep quality", "Reduce bedtime anxiety", "Create sleep ritual"],
    accessTier: 'free'
  },
  {
    id: 8,
    title: "Relationship Communication Toolkit",
    expert: "Dr. Emily Rodriguez",
    expertCredentials: "Relationship Therapist, LMFT",
    expertAvatar: "https://images.unsplash.com/photo-1594824388853-d0b8ccbfbb3d?w=100&h=100&fit=crop&crop=face",
    duration: "32:10",
    category: "Relationships",
    contentType: "toolkit",
    hashtags: ["#Communication", "#Relationships", "#Toolkit"],
    rating: 4.8,
    views: "11.2k",
    thumbnail: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=250&fit=crop",
    isNew: true,
    isTrending: false,
    description: "Comprehensive toolkit with exercises, scripts, and strategies for better communication.",
    fullDescription: "Interactive resource pack including conversation templates, conflict resolution guides, and practice exercises.",
    videoUrl: "https://www.youtube.com/watch?v=example2",
    relatedTopics: ["Communication Skills", "Conflict Resolution", "Emotional Intelligence"],
    learningObjectives: ["Master active listening", "Navigate difficult conversations", "Build deeper connections"],
    accessTier: 'premium'
  }
];

// Netflix-inspired Hero Section
const HeroSection = ({ featuredVideo }: { featuredVideo: VideoContent }) => {
  const [isMuted, setIsMuted] = useState(true);
  const { canWatchVideo } = useVideoAccess();
  const canWatch = canWatchVideo(featuredVideo, mockVideos);

  return (
    <div className="relative h-[65vh] w-full overflow-hidden rounded-b-3xl">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={featuredVideo.thumbnail}
          alt={featuredVideo.title}
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-end pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl">
            {/* Expert Badge */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30">
                <img 
                  src={featuredVideo.expertAvatar} 
                  alt={featuredVideo.expert}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 mb-1">
                  <Award className="w-3 h-3 mr-1" />
                  Featured Expert
                </Badge>
                <div className="text-white/90 text-sm font-medium">{featuredVideo.expert}</div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {featuredVideo.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-4 mb-6 text-white/80">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-medium">{featuredVideo.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{featuredVideo.duration}</span>
              </div>
              <Badge variant="outline" className="text-white border-white/30 bg-white/10 backdrop-blur-sm">
                {featuredVideo.category}
              </Badge>
            </div>

            {/* Description */}
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              {featuredVideo.description}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button className="bg-white text-black hover:bg-white/90 font-semibold px-8 py-3 text-base h-12 rounded-lg">
                <Play className="w-5 h-5 mr-2 fill-current" />
                {canWatch ? 'Watch Now' : 'Preview'}
              </Button>
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-3 text-base h-12 rounded-lg">
                <Info className="w-5 h-5 mr-2" />
                More Info
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:bg-white/10 w-12 h-12 rounded-full border-2 border-white/30 backdrop-blur-sm"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hybrid Video Card
const HybridVideoCard = ({ video, onPlay, onUpgrade }: {
  video: VideoContent;
  onPlay: (video: VideoContent) => void;
  onUpgrade: (video: VideoContent) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { canWatchVideo } = useVideoAccess();
  const canWatch = canWatchVideo(video, mockVideos);

  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-0 bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => canWatch ? onPlay(video) : onUpgrade(video)}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden h-44">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Netflix-style overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300 ${
            canWatch ? 'bg-white' : 'bg-gradient-to-r from-orange-500 to-amber-500'
          }`}>
            {canWatch ? (
              <Play className="w-5 h-5 text-black ml-0.5 fill-current" />
            ) : (
              <Crown className="w-5 h-5 text-white" />
            )}
          </div>
        </div>

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {video.isNew && (
            <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-semibold px-2 py-1">
              NEW
            </Badge>
          )}
          {video.isTrending && (
            <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-semibold px-2 py-1 flex items-center gap-1">
              <TrendingUp className="w-2 h-2" />
              Trending
            </Badge>
          )}
          {getContentTypeBadge(video.contentType || 'video')}
        </div>

        {/* Duration & Access */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="bg-black/80 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
            {video.contentType === 'game' || video.contentType === 'exercise' ? (
              <>
                {getContentTypeIcon(video.contentType)}
                <span>{video.duration}</span>
              </>
            ) : (
              <>
                <Clock className="w-2 h-2" />
                {video.duration}
              </>
            )}
          </div>
          {!canWatch && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-semibold px-2 py-1">
              <Crown className="w-2 h-2 mr-1" />
              Premium
            </Badge>
          )}
        </div>

        {/* Bookmark */}
        <button className="absolute top-3 right-3 w-7 h-7 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/80">
          <Bookmark className="w-3 h-3 text-white" />
        </button>
      </div>

      {/* Content */}
      <CardContent className="p-5 space-y-4">
        {/* Category & Hashtags */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 text-xs font-medium">
            {video.category}
          </Badge>
          <div className="flex items-center gap-1">
            {getContentTypeIcon(video.contentType || 'video')}
          </div>
        </div>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {video.hashtags?.slice(0, 2).map((hashtag, index) => (
            <span 
              key={index}
              className="text-xs text-primary/70 bg-primary/5 px-2 py-1 rounded-full font-medium hover:bg-primary/10 transition-colors cursor-pointer"
            >
              {hashtag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="font-bold text-base text-gray-900 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
          {video.title}
        </h3>

        {/* Expert info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
            <img 
              src={video.expertAvatar} 
              alt={video.expert}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-gray-900 truncate">{video.expert}</div>
            <div className="text-xs text-gray-600 truncate">{video.expertCredentials}</div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {video.description}
        </p>

        {/* Stats & Action */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-current" />
              <span className="font-medium">{video.rating}</span>
            </div>
            <span className="text-xs">{video.views} views</span>
          </div>

          <div className="flex items-center gap-2">
            {!canWatch ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  onUpgrade(video);
                }}
                className="text-amber-600 border-amber-300 hover:bg-amber-50 text-xs h-7 px-3"
              >
                <Crown className="w-2 h-2 mr-1" />
                Upgrade
              </Button>
            ) : (
              <Button 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay(video);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary hover:bg-primary/90 text-xs h-7 px-3"
              >
                <Play className="w-2 h-2 mr-1" />
                Watch
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Horizontal scrolling row
const VideoRow = ({ title, videos, onPlay, onUpgrade }: {
  title: string;
  videos: VideoContent[];
  onPlay: (video: VideoContent) => void;
  onUpgrade: (video: VideoContent) => void;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      const newScrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons();
      return () => scrollElement.removeEventListener('scroll', updateScrollButtons);
    }
  }, []);

  return (
    <div className="relative group/row mb-10">
      <h2 className="text-xl font-bold text-gray-900 mb-6 px-6">{title}</h2>
      
      <div className="relative">
        {/* Scroll buttons */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Scrollable content */}
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-6 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {videos.map((video) => (
            <div key={video.id} className="flex-none w-72">
              <HybridVideoCard
                video={video}
                onPlay={onPlay}
                onUpgrade={onUpgrade}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Browse Page
const BrowsePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { navigateToUpgrade, trackNavigationEvent } = useNavigationTracking();
  const [searchQuery, setSearchQuery] = useState('');

  // Organize content into sections
  const featuredVideo = mockVideos.find(v => v.isTrending && v.isNew) || mockVideos[0];
  const trendingVideos = mockVideos.filter(v => v.isTrending);
  const newReleases = mockVideos.filter(v => v.isNew);
  const mentalHealthVideos = mockVideos.filter(v => v.category === 'Mental Health');
  const mindfulnessVideos = mockVideos.filter(v => v.category === 'Mindfulness');
  const expertPicks = mockVideos.filter(v => v.rating >= 4.8);
  const freeContent = mockVideos.filter(v => v.accessTier === 'free');

  const handleVideoPlay = (video: VideoContent) => {
    trackNavigationEvent('Video Opened', {
      videoId: video.id.toString(),
      source: 'hybrid_browse',
      feature: video.title,
      section: video.category
    });
    console.log('Playing video:', video.title);
  };

  const handleUpgradeClick = (video: VideoContent) => {
    navigateToUpgrade({
      source: 'hybrid_browse_locked',
      videoId: video.id,
      videoTitle: video.title,
      seriesId: video.seriesId,
      episodeNumber: video.episodeNumber,
    });
  };

  // Filtered videos for search
  const filteredVideos = useMemo(() => {
    if (!searchQuery) return [];
    return mockVideos.filter(video =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.expert.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-primary/4 to-purple-500/4 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-32 w-80 h-80 bg-gradient-to-tr from-blue-500/4 to-teal-500/4 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 pt-20">
        {/* Hero Section */}
        <HeroSection featuredVideo={featuredVideo} />

        {/* Search Bar */}
        <div className="container mx-auto px-6 -mt-8 mb-12 relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search expert content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 h-12 rounded-xl bg-white/90 backdrop-blur-sm border border-white/30 focus:border-primary/50 text-base shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="container mx-auto px-6 mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Search Results for "{searchQuery}" ({filteredVideos.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideos.map((video) => (
                <HybridVideoCard
                  key={video.id}
                  video={video}
                  onPlay={handleVideoPlay}
                  onUpgrade={handleUpgradeClick}
                />
              ))}
            </div>
          </div>
        )}

        {/* Content Rows */}
        {!searchQuery && (
          <div className="space-y-8 pb-20">
            <VideoRow title="#Trending" videos={trendingVideos} onPlay={handleVideoPlay} onUpgrade={handleUpgradeClick} />
            <VideoRow title="#JustDropped" videos={newReleases} onPlay={handleVideoPlay} onUpgrade={handleUpgradeClick} />
            <VideoRow title="#QuickRelief" videos={mockVideos.filter(v => v.category === 'Quick Relief')} onPlay={handleVideoPlay} onUpgrade={handleUpgradeClick} />
            <VideoRow title="#MentalHealth" videos={mentalHealthVideos} onPlay={handleVideoPlay} onUpgrade={handleUpgradeClick} />
            <VideoRow title="#WellnessGames" videos={mockVideos.filter(v => v.category === 'Wellness Games')} onPlay={handleVideoPlay} onUpgrade={handleUpgradeClick} />
            <VideoRow title="#DailyPractice" videos={mockVideos.filter(v => v.category === 'Daily Practice')} onPlay={handleVideoPlay} onUpgrade={handleUpgradeClick} />
            <VideoRow title="#SleepAndRecovery" videos={mockVideos.filter(v => v.category === 'Sleep & Recovery')} onPlay={handleVideoPlay} onUpgrade={handleUpgradeClick} />
            <VideoRow title="#ExpertPicks" videos={expertPicks} onPlay={handleVideoPlay} onUpgrade={handleUpgradeClick} />
            <VideoRow title="#FreeForEveryone" videos={freeContent} onPlay={handleVideoPlay} onUpgrade={handleUpgradeClick} />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BrowsePage;