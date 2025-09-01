// src/pages/BrowsePage.tsx - Updated with API integration (fixed onUpgrade typing)
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useVideoAccess } from '@/hooks/useVideoAccess';
import { useNavigationTracking } from '@/hooks/useNavigationTracking';
import { contentService } from '@/services/content.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search, Play, Star, Clock, User, Crown,
  TrendingUp, ArrowRight, Bookmark, ChevronLeft, ChevronRight,
  Brain, Heart, Leaf, Target, Users as UsersIcon, Zap,
  Sparkles, Info, Plus, CheckCircle, Award, Volume2, VolumeX,
  Gamepad2, Headphones, FileText, Video, AlertCircle
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Updated VideoContent interface to match backend
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
  accessible: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
}

// Loading skeleton for video cards
const VideoCardSkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="h-44 w-full" />
    <CardContent className="p-5 space-y-3">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-6 w-full" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
    </CardContent>
  </Card>
);

// Content type helper functions
const getContentTypeIcon = (contentType: string) => {
  const iconClass = "w-3 h-3 text-gray-500";
  switch (contentType) {
    case 'video': return <Video className={iconClass} />;
    case 'audio': return <Headphones className={iconClass} />;
    case 'game': return <Gamepad2 className={iconClass} />;
    case 'exercise': return <Target className={iconClass} />;
    case 'toolkit': return <FileText className={iconClass} />;
    default: return <Video className={iconClass} />;
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

// Hero Section Component
const HeroSection = ({ featuredVideo, loading }: {
  featuredVideo: VideoContent | null;
  loading: boolean;
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const { canWatchVideo } = useVideoAccess();

  if (loading) {
    return (
      <div className="relative h-[65vh] w-full overflow-hidden rounded-b-3xl bg-gradient-to-r from-slate-200 to-slate-100">
        <div className="absolute inset-0 flex items-end pb-12">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl space-y-4">
              <Skeleton className="h-16 w-12 rounded-full" />
              <Skeleton className="h-12 w-96" />
              <Skeleton className="h-6 w-80" />
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!featuredVideo) return null;

  const canWatch = canWatchVideo(featuredVideo, []);

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Video Card Component
const HybridVideoCard = ({ video, onPlay, onUpgrade }: {
  video: VideoContent;
  onPlay: (video: VideoContent) => void;
  onUpgrade: (video: VideoContent) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { canWatchVideo } = useVideoAccess();
  const canWatch = video.accessible; // Use backend's access determination

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

        {/* Overlay */}
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
            <Clock className="w-2 h-2" />
            {video.duration}
          </div>
          {!canWatch && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-semibold px-2 py-1">
              <Crown className="w-2 h-2 mr-1" />
              Premium
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-5 space-y-4">
        {/* Category */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 text-xs font-medium">
            {video.category}
          </Badge>
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

// Video Row Component with loading state
const VideoRow = ({ title, videos, loading, onPlay, onUpgrade }: {
  title: string;
  videos: VideoContent[];
  loading: boolean;
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
  }, [videos]);

  if (videos.length === 0 && !loading) return null;

  return (
    <div className="relative group/row mb-10">
      <h2 className="text-xl font-bold text-gray-900 mb-6 px-6">{title}</h2>

      <div className="relative">
        {/* Scroll buttons */}
        {canScrollLeft && !loading && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        )}

        {canScrollRight && !loading && (
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
          {loading ? (
            // Loading skeletons
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex-none w-72">
                <VideoCardSkeleton />
              </div>
            ))
          ) : (
            // Actual content
            videos.map((video) => (
              <div key={video.id} className="flex-none w-72">
                <HybridVideoCard
                  video={video}
                  onPlay={onPlay}
                  onUpgrade={onUpgrade}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Main Browse Page Component
const BrowsePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { navigateToUpgrade, trackNavigationEvent } = useNavigationTracking();
  const [searchQuery, setSearchQuery] = useState('');

  // State for API data
  const [allVideos, setAllVideos] = useState<VideoContent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load content from API
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load browse content and categories in parallel
        const [browseData, categoriesData] = await Promise.all([
          contentService.getBrowseContent(undefined, 50), // Get more content for filtering
          contentService.getCategories()
        ]);

        // Helper: format views
        const formatViews = (count: number): string => {
          if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
          } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}k`;
          }
          return count.toString();
        };

        // Convert to frontend format
        const videos: VideoContent[] = browseData.content.map((item: any) => ({
          id: parseInt(item.id),
          title: item.title,
          expert: item.expert?.name || 'Unknown',
          expertCredentials: item.expert?.title || '',
          expertAvatar: item.expert?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${item.expert?.name || 'unknown'}`,
          duration: item.duration_formatted,
          category: item.category?.name || 'General',
          contentType: item.content_type,
          rating: 4.8, // Default rating
          views: formatViews(item.view_count || 0),
          thumbnail: item.thumbnail_url || "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=250&fit=crop",
          isNew: !!item.is_new,
          isTrending: !!item.trending,
          description: item.description || '',
          fullDescription: item.description || '',
          videoUrl: item.video_url || "#",
          relatedTopics: [],
          learningObjectives: [],
          accessTier: item.access_tier || 'free',
          isFirstEpisode: item.access_tier === 'free',
          accessible: !!item.accessible,
          seriesId: item.series_id,
          episodeNumber: item.episode_number,
          hashtags: [`#${(item.category?.name || 'General').replace(/\s+/g, '')}`, `#${(item.expert?.name || 'Expert').split(' ')[0]}`]
        }));

        setAllVideos(videos);
        setCategories(categoriesData.categories || []);
      } catch (err) {
        console.error('Failed to load content:', err);
        setError('Failed to load content. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  // Helper function to open upgrade flow with required context
  const handleUpgrade = (video: VideoContent) => {
    // adapt VideoContent -> expected context shape for navigateToUpgrade
    navigateToUpgrade({
      source: 'browse_page',
      videoId: video.id,
      videoTitle: video.title,
      seriesId: video.seriesId,
      episodeNumber: video.episodeNumber
    });
  };

  // Helper function to navigate to watch
  const handlePlay = (video: VideoContent) => {
    navigate(`/watch/${video.id}`);
  };

  // Pick a featured video (prioritize trending, then first available)
  const featuredVideo = allVideos.find(v => v.isTrending) || allVideos[0] || null;

  // Organize into sections
  const trendingVideos = allVideos.filter(v => v.isTrending);
  const newVideos = allVideos.filter(v => v.isNew);
  const freeVideos = allVideos.filter(v => v.accessTier === 'free');
  const premiumVideos = allVideos.filter(v => v.accessTier === 'premium');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <HeroSection featuredVideo={featuredVideo} loading={loading} />

      <main className="flex-1 container mx-auto py-10">
        {error && (
          <div className="text-center text-red-600 mb-6">
            <AlertCircle className="w-5 h-5 inline-block mr-2" />
            {error}
          </div>
        )}

        <VideoRow
          title="Trending Now"
          videos={trendingVideos}
          loading={loading}
          onPlay={handlePlay}
          onUpgrade={handleUpgrade}
        />

        <VideoRow
          title="New Releases"
          videos={newVideos}
          loading={loading}
          onPlay={handlePlay}
          onUpgrade={handleUpgrade}
        />

        <VideoRow
          title="Free to Watch"
          videos={freeVideos}
          loading={loading}
          onPlay={handlePlay}
          onUpgrade={handleUpgrade}
        />

        <VideoRow
          title="Premium Exclusives"
          videos={premiumVideos}
          loading={loading}
          onPlay={handlePlay}
          onUpgrade={handleUpgrade}
        />

        {/* OPTIONAL: generate category rows dynamically:
            categories.map(cat => (
              <VideoRow
                key={cat.id}
                title={cat.name}
                videos={allVideos.filter(v => v.category === cat.name)}
                loading={loading}
                onPlay={handlePlay}
                onUpgrade={handleUpgrade}
              />
            ))
        */}
      </main>

      <Footer />
    </div>
  );
};

export default BrowsePage;
