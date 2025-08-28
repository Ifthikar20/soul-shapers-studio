import { useState, useEffect, useCallback } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { useVideoAccess } from '@/hooks/useVideoAccess';
import { useNavigationTracking } from '@/hooks/useNavigationTracking';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VideoContent } from '@/types/video.types';
import { 
  Play, Clock, User, TrendingUp, 
  ArrowRight, Crown, Bookmark, Star 
} from 'lucide-react';

import VideoModal from './VideoModal';

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
    videoUrl: "https://www.youtube.com/watch?v=pcxuXfq118I",
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
    videoUrl: "https://www.youtube.com/watch?v=d9YM_9CVmtc",
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
    videoUrl: "https://www.youtube.com/watch?v=AznRJvAPtwM",
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
    videoUrl: "https://www.youtube.com/watch?v=d9YM_9CVmtc",
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
    videoUrl: "https://www.youtube.com/watch?v=D-ya6U-pbWo",
    relatedTopics: ["Brain Health", "Mood Foods", "Nutritional Psychology"],
    learningObjectives: [
      "Understand the gut-brain connection",
      "Identify mood-supporting nutrients",
      "Plan meals for mental wellness"
    ],
    accessTier: 'premium',
  }
];

// Enhanced Video Card Component
const EnhancedVideoCard = ({ video, videos, onPlay, onUpgrade }: {
  video: VideoContent;
  videos: VideoContent[];
  onPlay: (video: VideoContent) => void;
  onUpgrade: (video: VideoContent) => void;
}) => {
  const { canWatchVideo, getAccessMessage } = useVideoAccess();
  
  const canWatch = canWatchVideo(video, videos);
  const accessMessage = getAccessMessage(video);
  const isLocked = !canWatch;

  return (
    <div className="group cursor-pointer">
      {/* Card Container */}
      <div className="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl overflow-hidden shadow-lg">
        
        {/* Thumbnail Container */}
        <div className="relative overflow-hidden h-52">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Play Button Overlay */}
          <div 
            onClick={() => onPlay(video)}
            className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl ${
              isLocked ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-white/90 backdrop-blur-sm'
            }`}>
              {isLocked ? (
                <Crown className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-primary ml-0.5" />
              )}
            </div>
          </div>
          
          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {video.isNew && (
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                NEW
              </div>
            )}
            {video.isTrending && (
              <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Trending
              </div>
            )}
            {video.isFirstEpisode && (
              <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg">
                Free Episode
              </div>
            )}
            {video.accessTier === 'premium' && !video.isFirstEpisode && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <Crown className="w-3 h-3" />
                Premium
              </div>
            )}
          </div>
          
          {/* Duration Badge */}
          <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {video.duration}
          </div>
          
          {/* Bookmark Button */}
          <button className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
            <Bookmark className="w-4 h-4 text-gray-700" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Category Badge */}
          <div>
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full border border-primary/20">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              {video.category}
            </span>
          </div>
          
          {/* Title */}
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2 leading-tight">
            {video.title}
          </h3>
          
          {/* Expert */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-gray-700">{video.expert}</span>
          </div>
          
          {/* Stats Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-700">{video.rating}</span>
              </div>
              <div className="text-sm text-gray-500">{video.views} views</div>
            </div>
            
            {isLocked ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onUpgrade(video)}
                className="text-orange-600 border-orange-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 rounded-full px-4 py-2 font-medium transition-all duration-300"
              >
                <Crown className="w-3 h-3 mr-1" />
                Upgrade
              </Button>
            ) : (
              <button 
                onClick={() => onPlay(video)}
                className="opacity-0 group-hover:opacity-100 text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1 px-3 py-1 rounded-full hover:bg-primary/5"
              >
                Watch
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        
        {/* Bottom Shine Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
};

const VideoGrid = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoContent | null>(null);
  const [visibleVideos, setVisibleVideos] = useState(6);
  
  // Use the hooks
  const { canWatchVideo } = useVideoAccess();
  const { 
    navigateToUpgrade, 
    trackNavigationEvent, 
    getNavigationContextFromUrl 
  } = useNavigationTracking();

  // Track page view with context when component mounts
  useEffect(() => {
    const context = getNavigationContextFromUrl();
    if (context.trackingId) {
      trackNavigationEvent('Video Grid Viewed', {
        ...context,
        from: context.from || 'direct',
        section: 'featured_content'
      });
    } else {
      trackNavigationEvent('Video Grid Viewed', {
        source: 'direct',
        section: 'featured_content'
      });
    }
  }, [trackNavigationEvent, getNavigationContextFromUrl]);

  // Memoized callback for handling video play to prevent unnecessary re-renders
  const handleVideoPlay = useCallback((video: VideoContent) => {
    const canWatch = canWatchVideo(video, videos);
    
    if (canWatch) {
      trackNavigationEvent('Video Opened', {
        videoId: video.id.toString(),
        source: 'video_grid',
        feature: video.title,
        section: video.category
      });
      setSelectedVideo(video);
    } else {
      navigateToUpgrade({
        source: 'video_locked',
        videoId: video.id,
        videoTitle: video.title,
        seriesId: video.seriesId,
        episodeNumber: video.episodeNumber,
      });
    }
  }, [canWatchVideo, trackNavigationEvent, navigateToUpgrade]);

  // Memoized callback for upgrade navigation
  const handleUpgradeClick = useCallback((video: VideoContent) => {
    navigateToUpgrade({
      source: 'upgrade_button',
      videoId: video.id,
      videoTitle: video.title,
      seriesId: video.seriesId,
      episodeNumber: video.episodeNumber,
    });
  }, [navigateToUpgrade]);

  const handleLoadMore = useCallback(() => {
    setVisibleVideos(prev => prev + 3);
    trackNavigationEvent('Load More Videos', {
      source: 'pagination',
      feature: 'load_more',
      section: 'video_grid'
    });
  }, [trackNavigationEvent]);

  const handleModalClose = useCallback(() => {
    setSelectedVideo(null);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Simplified Background Elements - Static, no animations or heavy blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-[300px] h-[200px] bg-gradient-to-br from-primary/4 to-purple-400/2 rounded-[60%_40%_50%_50%] opacity-60"></div>
        <div className="absolute bottom-40 right-20 w-[400px] h-[250px] bg-gradient-to-tl from-purple-500/4 to-primary/2 rounded-[40%_60%_70%_30%] opacity-60"></div>
        <div className="absolute top-1/2 left-1/4 w-[200px] h-[150px] bg-gradient-to-r from-primary/3 to-transparent rounded-[50%_30%_70%_50%] opacity-60"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Section Header */}
        <div className="flex justify-between items-center mb-16">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary text-sm font-medium px-4 py-2 rounded-full border border-primary/20 mb-6">
              <div className="w-2 h-2 bg-primary rounded-full" />
              Featured Content
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Expert-Curated
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent block">
                Wellness Videos
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl">
              Transform your mental health with guidance from leading professionals
            </p>
          </div>
          
          {/* Enhanced Filter Badges */}
          <div className="hidden lg:flex space-x-3">
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-all duration-300 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border-white/30">
              All Videos
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-all duration-300 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border-white/30">
              Most Popular
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-all duration-300 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border-white/30">
              New Releases
            </Badge>
          </div>
        </div>

        {/* Enhanced Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.slice(0, visibleVideos).map((video) => (
            <EnhancedVideoCard
              key={video.id}
              video={video}
              videos={videos}
              onPlay={handleVideoPlay}
              onUpgrade={handleUpgradeClick}
            />
          ))}
        </div>
        
        {/* Enhanced Load More Button */}
        {visibleVideos < videos.length && (
          <div className="text-center mt-16">
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleLoadMore}
              className="rounded-full px-8 py-3 text-base hover:bg-primary hover:text-white transition-all duration-300 bg-white/80 backdrop-blur-sm border-white/30 shadow-lg hover:shadow-xl"
            >
              Load More Videos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Video Modal */}
        {selectedVideo && (
          <VideoModal 
            video={selectedVideo}
            open={!!selectedVideo} 
            onOpenChange={handleModalClose}
          />
        )}
      </div>
    </section>
  );
};

export default VideoGrid;