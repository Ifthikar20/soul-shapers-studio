import { useState, useEffect, useCallback } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { useVideoAccess } from '@/hooks/useVideoAccess';
import { useNavigationTracking } from '@/hooks/useNavigationTracking';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VideoContent } from '@/types/video.types';

import VideoCard from './VideoCard';
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

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.slice(0, visibleVideos).map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              videos={videos}
              onPlay={handleVideoPlay}
              onUpgrade={handleUpgradeClick}
            />
          ))}
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
            onOpenChange={handleModalClose}
          />
        )}
      </div>
    </section>
  );
};

export default VideoGrid;