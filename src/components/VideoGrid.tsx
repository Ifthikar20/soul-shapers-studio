import { useState, useEffect, useCallback } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { useVideoAccess } from '@/hooks/useVideoAccess';
import { useNavigationTracking } from '@/hooks/useNavigationTracking';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VideoContent } from '@/types/video.types';
import { 
  Play, Clock, User, TrendingUp, 
  ArrowRight, Crown, Star 
} from 'lucide-react';

import VideoModal from './VideoModal/VideoModal';

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

// Fixed Size Video Card Component
const FixedVideoCard = ({ video, videos, onPlay, onUpgrade }: {
  video: VideoContent;
  videos: VideoContent[];
  onPlay: (video: VideoContent) => void;
  onUpgrade: (video: VideoContent) => void;
}) => {
  const { canWatchVideo } = useVideoAccess();
  
  const canWatch = canWatchVideo(video, videos);
  const isLocked = !canWatch;

  return (
    <Card className="cursor-pointer group overflow-hidden hover:shadow-md transition-all duration-200 w-72 h-80">
      <div className="relative">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-40 object-cover"
        />
        
        {/* Play Overlay */}
        <div 
          onClick={() => onPlay(video)}
          className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
        >
          <div className="rounded-full p-2 bg-white/90 shadow-lg">
            {isLocked ? (
              <Crown className="w-4 h-4 text-orange-500" />
            ) : (
              <Play className="w-4 h-4 text-primary" />
            )}
          </div>
        </div>
        
        {/* Compact Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {video.isNew && (
            <Badge className="bg-primary text-white text-xs px-2 py-0.5">
              New
            </Badge>
          )}
          {video.isTrending && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
              Hot
            </Badge>
          )}
          {video.accessTier === 'premium' && !video.isFirstEpisode && (
            <Badge className="bg-orange-500 text-white text-xs px-2 py-0.5">
              <Crown className="w-2.5 h-2.5 mr-0.5" />
              Pro
            </Badge>
          )}
        </div>
        
        {/* Duration */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-0.5 rounded text-xs">
          {video.duration}
        </div>
      </div>
      
      <CardContent className="p-5 h-56 flex flex-col">
        {/* Category */}
        <Badge variant="outline" className="text-xs mb-2 w-fit">
          {video.category}
        </Badge>
        
        {/* Title - Fixed height */}
        <h3 className="font-semibold text-base text-foreground mb-4 line-clamp-2 leading-tight h-12 overflow-hidden">
          {video.title}
        </h3>
        
        {/* Expert - Fixed height */}
        <div className="flex items-center text-muted-foreground text-sm mb-4 h-5">
          <User className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{video.expert}</span>
        </div>

        {/* Stats and Action - Fixed at bottom with proper spacing */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Star className="w-4 h-4 mr-1 text-yellow-500 flex-shrink-0" />
            <span>{video.rating}</span>
            <span className="mx-2">•</span>
            <span>{video.views}</span>
          </div>
          
          {isLocked ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onUpgrade(video)}
              className="text-orange-600 border-orange-200 hover:bg-orange-50 text-sm px-3 py-1.5 h-8 flex-shrink-0"
            >
              Upgrade
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onPlay(video)}
              className="text-primary hover:bg-primary/10 text-sm px-3 py-1.5 h-8 flex-shrink-0"
            >
              Watch
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
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
    <section className="py-12 relative">
      <div className="container mx-auto px-4 relative z-10">
        {/* Compact Section Header */}
        <div className="mb-8">
          {/* Top Section - Badge and Filters */}
          <div className="flex justify-between items-start mb-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              Featured Content
            </div>
            
            {/* Filter Badges - Right aligned */}
            <div className="hidden lg:flex space-x-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-all px-3 py-1 text-sm rounded-full">
                All Videos
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-all px-3 py-1 text-sm rounded-full">
                Popular
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-all px-3 py-1 text-sm rounded-full">
                New
              </Badge>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 leading-tight">
              Expert-Curated
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent block">
                Wellness Videos
              </span>
            </h2>
            <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Transform your mental health with guidance from leading professionals. 
              Access premium content designed to support your wellness journey.
            </p>
          </div>

          {/* Mobile Filter Badges */}
          <div className="flex lg:hidden justify-center space-x-2 mt-4">
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-all px-3 py-1 text-sm rounded-full">
              All Videos
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-all px-3 py-1 text-sm rounded-full">
              Popular
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-all px-3 py-1 text-sm rounded-full">
              New
            </Badge>
          </div>
        </div>

        {/* Fixed Size Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {videos.slice(0, visibleVideos).map((video) => (
            <FixedVideoCard
              key={video.id}
              video={video}
              videos={videos}
              onPlay={handleVideoPlay}
              onUpgrade={handleUpgradeClick}
            />
          ))}
        </div>
        
        {/* Compact Load More Button */}
        {visibleVideos < videos.length && (
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              size="default"
              onClick={handleLoadMore}
              className="rounded-full px-5 py-2 hover:bg-primary hover:text-white transition-all"
            >
              Load More Videos
              <ArrowRight className="w-3 h-3 ml-1" />
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