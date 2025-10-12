// src/pages/BrowsePage.tsx - With integrated search functionality
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigationTracking } from '@/hooks/useNavigationTracking';
import { contentService } from '@/services/content.service';
import { AlertCircle, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { navigateToUpgrade, trackNavigationEvent } = useNavigationTracking();

  // Get search query from URL
  const searchQuery = searchParams.get('q') || '';

  // State for API data
  const [allVideos, setAllVideos] = useState<VideoContent[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoContent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

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
          rating: 4.8,
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

  // Filter videos based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredVideos(allVideos);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const query = searchQuery.toLowerCase().trim();

    const filtered = allVideos.filter(video => 
      video.title.toLowerCase().includes(query) ||
      video.description.toLowerCase().includes(query) ||
      video.expert.toLowerCase().includes(query) ||
      video.category.toLowerCase().includes(query) ||
      video.expertCredentials.toLowerCase().includes(query)
    );

    setFilteredVideos(filtered);

    // Track search event
    trackNavigationEvent('Search Performed', {
      query: searchQuery,
      resultCount: filtered.length,
      source: 'browse_page'
    });
  }, [searchQuery, allVideos, trackNavigationEvent]);

  // Clear search
  const handleClearSearch = () => {
    setSearchParams({});
    setIsSearching(false);
  };

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

  // Data organization for non-search view
  const videosToShow = isSearching ? filteredVideos : allVideos;
  const featuredVideo = !isSearching ? (allVideos.find(v => v.isTrending) || allVideos[0] || null) : null;
  const trendingVideos = !isSearching ? allVideos.filter(v => v.isTrending) : [];
  const newVideos = !isSearching ? allVideos.filter(v => v.isNew) : [];
  const freeVideos = !isSearching ? allVideos.filter(v => v.accessTier === 'free') : [];
  const premiumVideos = !isSearching ? allVideos.filter(v => v.accessTier === 'premium') : [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Show Hero only when not searching */}
      {!isSearching && (
        <HeroSection 
          featuredVideo={featuredVideo} 
          loading={loading}
          onPlay={handlePlay}
          onMoreInfo={handleMoreInfo}
        />
      )}

      <main className="flex-1 container mx-auto py-10">
        {error && (
          <div className="text-center text-red-600 mb-6">
            <AlertCircle className="w-5 h-5 inline-block mr-2" />
            {error}
          </div>
        )}

        {/* Search Results Header */}
        {isSearching && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Search Results
                </h2>
                <p className="text-gray-600">
                  Found <strong>{filteredVideos.length}</strong> results for "<strong>{searchQuery}</strong>"
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleClearSearch}
                className="rounded-full"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Search
              </Button>
            </div>

            {/* Search results badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-sm">
                <Search className="w-3 h-3 mr-1" />
                "{searchQuery}"
              </Badge>
              <Badge variant="outline" className="text-sm">
                {filteredVideos.length} videos
              </Badge>
            </div>
          </div>
        )}

        {/* No Search Results */}
        {isSearching && filteredVideos.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No results found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any content matching "<strong>{searchQuery}</strong>"
            </p>
            <div className="space-x-4">
              <Button onClick={handleClearSearch} variant="outline">
                Clear Search
              </Button>
              <Button onClick={() => window.location.reload()}>
                Browse All Content
              </Button>
            </div>
          </div>
        )}

        {/* Search Results Grid */}
        {isSearching && filteredVideos.length > 0 && (
          <VideoRow
            title="Search Results"
            videos={filteredVideos}
            loading={loading}
            onPlay={handlePlay}
            onUpgrade={handleUpgrade}
          />
        )}

        {/* Regular Browse Content (shown when not searching) */}
        {!isSearching && (
          <>
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
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BrowsePage;