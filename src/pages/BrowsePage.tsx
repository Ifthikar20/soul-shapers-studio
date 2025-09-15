// src/pages/BrowsePage.tsx - Modularized version
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigationTracking } from '@/hooks/useNavigationTracking';
import { contentService } from '@/services/content.service';
import { AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/Browse/HeroSection';
import VideoRow from '@/components/Browse/VideoRow';

interface VideoContent {
  id: number;
  title: string;
  expert: string;
  expertCredentials: string;
  expertAvatar: string;
  duration: string;
  category: string;
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

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
}

const BrowsePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { navigateToUpgrade, trackNavigationEvent } = useNavigationTracking();

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
          contentService.getBrowseContent(undefined, 50),
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

  // Event handlers
  const handleUpgrade = (video: VideoContent) => {
    navigateToUpgrade({
      source: 'browse_page',
      videoId: video.id,
      videoTitle: video.title,
      seriesId: video.seriesId,
      episodeNumber: video.episodeNumber
    });
  };

  const handlePlay = (video: VideoContent) => {
    trackNavigationEvent('Video Play', {
      videoId: video.id.toString(),
      source: 'browse_page'
    });
    navigate(`/watch/${video.id}`);
  };

  const handleMoreInfo = (video: VideoContent) => {
    navigate(`/video/${video.id}`);
  };

  // Data organization
  const featuredVideo = allVideos.find(v => v.isTrending) || allVideos[0] || null;
  const trendingVideos = allVideos.filter(v => v.isTrending);
  const newVideos = allVideos.filter(v => v.isNew);
  const freeVideos = allVideos.filter(v => v.accessTier === 'free');
  const premiumVideos = allVideos.filter(v => v.accessTier === 'premium');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <HeroSection 
        featuredVideo={featuredVideo} 
        loading={loading}
        onPlay={handlePlay}
        onMoreInfo={handleMoreInfo}
      />

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
      </main>

      <Footer />
    </div>
  );
};

export default BrowsePage;