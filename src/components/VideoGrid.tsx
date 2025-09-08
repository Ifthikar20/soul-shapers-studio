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

// Futuristic Video Card Component with curved edges
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
      {/* Futuristic Card Container with organic curves */}
      <div className="relative bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-xl border border-white/40 overflow-hidden shadow-lg" 
           style={{
             borderRadius: '30px 10px 30px 10px',
             clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
           }}>
        
        {/* Futuristic Thumbnail with curved clipping */}
        <div className="relative overflow-hidden h-40"
             style={{
               borderRadius: '25px 5px 0 5px',
               clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)'
             }}>
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          
          {/* Gradient Overlay with sci-fi feel */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-black/60" />
          
          {/* Futuristic Play Button */}
          <div 
            onClick={() => onPlay(video)}
            className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center cursor-pointer"
          >
            <div className={`w-14 h-14 flex items-center justify-center shadow-2xl ${
              isLocked 
                ? 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-500' 
                : 'bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-sm'
            }`}
                 style={{
                   borderRadius: '50% 20% 50% 20%',
                   clipPath: 'polygon(20% 0%, 80% 10%, 90% 80%, 10% 90%)'
                 }}>
              {isLocked ? (
                <Crown className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-primary ml-0.5" />
              )}
            </div>
          </div>
          
          {/* Futuristic Badges with curved edges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {video.isNew && (
              <div className="bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 text-white text-xs font-bold px-3 py-1"
                   style={{ borderRadius: '15px 5px 15px 5px' }}>
                NEW
              </div>
            )}
            {video.isTrending && (
              <div className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-white text-xs font-medium px-3 py-1 flex items-center gap-1"
                   style={{ borderRadius: '20px 8px 20px 8px' }}>
                <TrendingUp className="w-3 h-3" />
                Trending
              </div>
            )}
            {video.accessTier === 'premium' && !video.isFirstEpisode && (
              <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-500 text-white text-xs font-medium px-3 py-1 flex items-center gap-1"
                   style={{ borderRadius: '18px 6px 18px 6px' }}>
                <Crown className="w-3 h-3" />
                Premium
              </div>
            )}
          </div>
          
          {/* Duration Badge with asymmetric curves */}
          <div className="absolute bottom-3 right-3 bg-gradient-to-r from-black/80 to-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 flex items-center gap-1"
               style={{ borderRadius: '12px 4px 12px 4px' }}>
            <Clock className="w-3 h-3" />
            {video.duration}
          </div>
        </div>
        
        {/* Content with curved internal design */}
        <div className="p-4 space-y-3 relative">
          {/* Subtle internal accent line */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          
          {/* Category Badge with futuristic shape */}
          <div>
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-primary/15 to-purple-500/10 text-primary text-xs font-medium px-3 py-1"
                  style={{ borderRadius: '10px 3px 10px 3px' }}>
              <div className="w-1 h-1 bg-primary rounded-full" />
              {video.category}
            </span>
          </div>
          
          {/* Title */}
          <h3 className="font-bold text-base text-gray-900 line-clamp-2 leading-tight">
            {video.title}
          </h3>
          
          {/* Expert with curved avatar */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-primary/20 to-purple-500/15 flex items-center justify-center"
                 style={{ borderRadius: '50% 20% 50% 20%' }}>
              <User className="w-3 h-3 text-primary" />
            </div>
            <span className="text-sm text-gray-700">{video.expert}</span>
          </div>
          
          {/* Stats Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs font-medium text-gray-700">{video.rating}</span>
              </div>
              <div className="text-xs text-gray-500">{video.views} views</div>
            </div>
            
            {isLocked ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onUpgrade(video)}
                className="text-orange-600 border-orange-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 text-xs px-3 py-1"
                style={{ borderRadius: '12px 4px 12px 4px' }}
              >
                <Crown className="w-3 h-3 mr-1" />
                Upgrade
              </Button>
            ) : (
              <button 
                onClick={() => onPlay(video)}
                className="opacity-0 group-hover:opacity-100 text-primary hover:text-primary/80 text-xs flex items-center gap-1 px-3 py-1 hover:bg-primary/5 transition-all"
                style={{ borderRadius: '10px 3px 10px 3px' }}
              >
                Watch
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        
        {/* Futuristic corner accents */}
        <div className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-bl from-primary/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 bg-gradient-to-tr from-purple-500/20 to-transparent"></div>
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
    <section className="py-16 relative overflow-hidden">
      {/* Simpler Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-[200px] h-[150px] bg-primary/3 rounded-[60%_40%_50%_50%] opacity-50"></div>
        <div className="absolute bottom-40 right-20 w-[250px] h-[180px] bg-purple-500/3 rounded-[40%_60%_70%_30%] opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Well-structured Section Header */}
        <div className="mb-12">
          {/* Top Section - Badge and Filters */}
          <div className="flex justify-between items-start mb-6">
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

          {/* Main Content Section - Centered and structured */}
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Expert-Curated
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent block">
                Wellness Videos
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Transform your mental health with guidance from leading professionals. 
              Access premium content designed to support your wellness journey.
            </p>
          </div>

          {/* Mobile Filter Badges */}
          <div className="flex lg:hidden justify-center space-x-2 mt-6">
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

        {/* Video Grid with smaller gaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        
        {/* Smaller Load More Button */}
        {visibleVideos < videos.length && (
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="default"
              onClick={handleLoadMore}
              className="rounded-full px-6 py-2 hover:bg-primary hover:text-white transition-all"
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