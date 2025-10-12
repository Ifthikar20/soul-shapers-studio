// src/components/VideoGrid.tsx - COMPLETE FIXED VERSION
import { useState, useEffect, useCallback } from "react";
import { useVideoAccess } from '@/hooks/useVideoAccess';
import { useNavigationTracking } from '@/hooks/useNavigationTracking';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { contentService } from '@/services/content.service';
import { 
  Play, User, TrendingUp, Crown, Star, Loader2, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import VideoModal from './VideoModal/VideoModal';
import { useNavigate } from 'react-router-dom';
import { Video, hasShortId } from '@/types/video.types';

// ✅ FIXED: Fixed Size Video Card Component with proper typing
const FixedVideoCard = ({ video, videos, onPlay, onUpgrade }: {
  video: Video; // ✅ Changed from 'any' to 'Video'
  videos: Video[]; // ✅ Changed from 'any[]' to 'Video[]'
  onPlay: (video: Video) => void;
  onUpgrade: (video: Video) => void;
}) => {
  const { canWatchVideo } = useVideoAccess();
  
  const canWatch = canWatchVideo(video, videos);
  const isLocked = !canWatch;

  // ✅ Add debug logging
  const handleCardClick = () => {
    console.log('🎯 Card clicked:', {
      id: video.id,
      short_id: video.short_id,
      title: video.title,
      hasShortId: hasShortId(video)
    });
    onPlay(video);
  };

  const handleUpgradeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    console.log('💳 Upgrade clicked for:', video.title);
    onUpgrade(video);
  };

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
          onClick={handleCardClick} // ✅ Use handleCardClick
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
              onClick={handleUpgradeClick} // ✅ Use handleUpgradeClick
              className="text-orange-600 border-orange-200 hover:bg-orange-50 text-sm px-3 py-1.5 h-8 flex-shrink-0"
            >
              Upgrade
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation(); // ✅ Prevent double click
                handleCardClick();
              }}
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
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null); // ✅ Changed from 'any' to 'Video'
  const [videos, setVideos] = useState<Video[]>([]); // ✅ Changed from 'any[]' to 'Video[]'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  
  // ✅ Use the hooks
  const { canWatchVideo } = useVideoAccess();
  const { 
    navigateToUpgrade, 
    trackNavigationEvent, 
    getNavigationContextFromUrl 
  } = useNavigationTracking();

  // Fetch videos from backend using existing content service
  const fetchVideos = useCallback(async (category?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('📹 Fetching videos...', { category });

      // Use your existing content service
      const videos = await contentService.getVideosForFrontend(category);

      console.log('✅ Videos loaded:', videos.length);
      console.log('📦 First video:', videos[0]);

      setVideos(videos);
      setIsLoading(false);
    } catch (error: any) {
      console.error('❌ Failed to fetch videos:', error);
      setError(error.message || 'Failed to load videos');
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchVideos(selectedCategory);
  }, [fetchVideos, selectedCategory]);

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

  // ✅ Memoized callback for handling video play with debug logging
// src/components/VideoGrid.tsx - Enhanced Debug Version

const handleVideoPlay = useCallback((video: Video) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎬 handleVideoPlay CALLED');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📦 Video object:', video);
  console.log('🔑 video.id:', video.id);
  console.log('🔑 video.short_id:', video.short_id);
  console.log('📝 video.title:', video.title);
  console.log('✅ hasShortId result:', hasShortId(video));
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // ✅ Ensure video has short_id before navigation
  if (!hasShortId(video)) {
    console.error('❌ FAILED: Video missing short_id');
    console.error('Video object:', JSON.stringify(video, null, 2));
    toast.error('Unable to play video - missing short_id');
    return;
  }

  console.log('✅ PASSED: Video has short_id');

  const canWatch = canWatchVideo(video, videos);
  console.log('🔐 Access check result:', canWatch);
  
  if (canWatch) {
    const navigateUrl = `/watch/${video.short_id}`;
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 NAVIGATING TO:', navigateUrl);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    trackNavigationEvent('Video Opened', {
      videoId: video.id.toString(),
      videoShortId: video.short_id,
      source: 'video_grid',
      feature: video.title,
      section: video.category
    });
    
    // ✅ Navigate using short_id
    navigate(navigateUrl);
    
    console.log('✅ Navigation command sent');
  } else {
    console.log('🔒 Video locked, showing upgrade prompt');
    navigateToUpgrade({
      source: 'video_locked',
      videoId: video.id,
      videoShortId: video.short_id,
      videoTitle: video.title,
      seriesId: video.seriesId,
      episode: video.episodeNumber?.toString(),
    });
  }
}, [canWatchVideo, trackNavigationEvent, navigateToUpgrade, videos, navigate]);



  // ✅ Memoized callback for upgrade navigation
  const handleUpgradeClick = useCallback((video: Video) => {
    console.log('💳 handleUpgradeClick called for:', video.title);
    navigateToUpgrade({
      source: 'upgrade_button',
      videoId: video.id,
      videoShortId: video.short_id,
      videoTitle: video.title,
      seriesId: video.seriesId,
      episode: video.episodeNumber?.toString(),
    });
  }, [navigateToUpgrade]);

  // Handle category filter change
  const handleCategoryFilter = useCallback((category: string | undefined) => {
    setSelectedCategory(category);
    trackNavigationEvent('Category Filter Changed', {
      source: 'video_grid',
      category: category || 'all'
    });
  }, [trackNavigationEvent]);

  const handleModalClose = useCallback(() => {
    setSelectedVideo(null);
  }, []);

  // Loading State
  if (isLoading && videos.length === 0) {
    return (
      <section className="py-12 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading videos...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error State
  if (error && videos.length === 0) {
    return (
      <section className="py-12 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-foreground font-semibold mb-2">Failed to load videos</p>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => fetchVideos(selectedCategory)}>
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Empty State
  if (!isLoading && videos.length === 0) {
    return (
      <section className="py-12 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <p className="text-foreground font-semibold mb-2">No videos available</p>
            <p className="text-muted-foreground">Check back soon for new content!</p>
          </div>
        </div>
      </section>
    );
  }

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
              <Badge 
                variant="outline" 
                className={`cursor-pointer hover:bg-primary hover:text-white transition-all px-3 py-1 text-sm rounded-full ${!selectedCategory ? 'bg-primary text-white' : ''}`}
                onClick={() => handleCategoryFilter(undefined)}
              >
                All Videos
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-primary hover:text-white transition-all px-3 py-1 text-sm rounded-full"
                onClick={() => handleCategoryFilter(undefined)}
              >
                Popular
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-primary hover:text-white transition-all px-3 py-1 text-sm rounded-full"
                onClick={() => handleCategoryFilter(undefined)}
              >
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
            <Badge 
              variant="outline" 
              className={`cursor-pointer hover:bg-primary hover:text-white transition-all px-3 py-1 text-sm rounded-full ${!selectedCategory ? 'bg-primary text-white' : ''}`}
              onClick={() => handleCategoryFilter(undefined)}
            >
              All Videos
            </Badge>
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-primary hover:text-white transition-all px-3 py-1 text-sm rounded-full"
              onClick={() => handleCategoryFilter(undefined)}
            >
              Popular
            </Badge>
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-primary hover:text-white transition-all px-3 py-1 text-sm rounded-full"
              onClick={() => handleCategoryFilter(undefined)}
            >
              New
            </Badge>
          </div>
        </div>

        {/* Fixed Size Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {videos.map((video) => (
            <FixedVideoCard
              key={video.id}
              video={video}
              videos={videos}
              onPlay={handleVideoPlay}
              onUpgrade={handleUpgradeClick}
            />
          ))}
        </div>

        {/* Video Modal - Only open if selectedVideo exists */}
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