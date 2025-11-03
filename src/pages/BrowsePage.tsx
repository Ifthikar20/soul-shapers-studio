// src/pages/BrowsePage.tsx - FINAL COMPLETE FIXED VERSION WITH SECURE SEARCH
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigationTracking } from '@/hooks/useNavigationTracking';
import { contentService } from '@/services/content.service';
import { Video, normalizeVideo } from '@/types/video.types'; // ✅ Use centralized types
import { decodeSearchQuery, sanitizeHTML } from '@/utils/search.security';
import { AlertCircle, X, Search, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/Browse/HeroSection';
import VideoRow from '@/components/Browse/VideoRow';

const BrowsePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { navigateToUpgrade, trackNavigationEvent } = useNavigationTracking();

  // Secure search query validation
  const rawSearchQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState('');
  const [searchErrors, setSearchErrors] = useState<string[]>([]);
  const [searchWarnings, setSearchWarnings] = useState<string[]>([]);

  const [allVideos, setAllVideos] = useState<Video[]>([]); // ✅ Use Video type
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]); // ✅ Use Video type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Validate and sanitize search query from URL
  useEffect(() => {
    if (rawSearchQuery) {
      const validation = decodeSearchQuery(rawSearchQuery);

      if (!validation.isValid) {
        console.warn('Invalid search query:', validation.errors);
        setSearchErrors(validation.errors);
        setSearchQuery('');
        setIsSearching(false);
      } else {
        setSearchQuery(validation.sanitized);
        setSearchErrors([]);
        setSearchWarnings(validation.warnings);
      }
    } else {
      setSearchQuery('');
      setSearchErrors([]);
      setSearchWarnings([]);
      setIsSearching(false);
    }
  }, [rawSearchQuery]);

  // Load content from API
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 Loading browse content...');

        // Load browse content
        const browseData = await contentService.getBrowseContent(undefined, 50);

        console.log('📦 Browse data received:', {
          contentCount: browseData.content?.length || 0,
          firstItem: browseData.content?.[0]
        });

        // ✅ Use normalizeVideo helper to convert backend format
        const videos: Video[] = browseData.content.map((item: any) => {
          console.log('🔄 Converting item:', {
            id: item.id,
            title: item.title,
            idType: typeof item.id
          });

          return normalizeVideo(item);
        });

        console.log('✅ Converted videos:', {
          count: videos.length,
          firstVideo: {
            id: videos[0]?.id,
            title: videos[0]?.title,
            idType: typeof videos[0]?.id
          }
        });

        setAllVideos(videos);
        console.log('✅ Content loaded successfully');
        
      } catch (err) {
        console.error('❌ Failed to load content:', err);
        setError('Failed to load content. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  // Filter videos based on search query with security
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredVideos(allVideos);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Sanitize query for searching (additional layer of security)
    const sanitizedQuery = sanitizeHTML(searchQuery.toLowerCase().trim());

    const filtered = allVideos.filter(video => {
      // Search across multiple fields with sanitized query
      const searchableText = [
        video.title,
        video.description,
        video.expert,
        video.category,
        video.expertCredentials || '',
      ].join(' ').toLowerCase();

      return searchableText.includes(sanitizedQuery);
    });

    setFilteredVideos(filtered);

    // ✅ FIXED: Proper NavigationContext with all required fields
    trackNavigationEvent('Search Performed', {
      query: searchQuery,
      resultCount: filtered.length, // ✅ Now valid field
      source: 'browse_page',
      from: location.pathname,
      timestamp: new Date().toISOString(),
    });

    // Track no results specifically
    if (filtered.length === 0) {
      trackNavigationEvent('Search No Results', {
        query: searchQuery,
        resultCount: 0,
        source: 'browse_page',
        from: location.pathname,
      });
    }
  }, [searchQuery, allVideos, trackNavigationEvent, location.pathname]);

  const handleClearSearch = () => {
    setSearchParams({});
    setIsSearching(false);
    
    trackNavigationEvent('Search Cleared', {
      source: 'browse_page',
      from: location.pathname,
    });
  };

  // ✅ Event handlers use Video type with UUID
  const handleUpgrade = (video: Video) => {
    navigateToUpgrade({
      source: 'browse_page',
      videoId: video.id, // ✅ UUID string
      videoTitle: video.title,
      seriesId: video.seriesId,
      episodeNumber: video.episodeNumber
    });
  };

  const handlePlay = (video: Video) => {
    console.log('▶️ Playing video:', {
      id: video.id,
      title: video.title,
      navigateTo: `/watch/${video.id}`
    });

    trackNavigationEvent('Video Play', {
      videoId: video.id, // ✅ UUID string
      videoTitle: video.title,
      source: 'browse_page',
      from: location.pathname,
      category: video.category,
    });

    navigate(`/watch/${video.id}`); // ✅ Navigate with UUID
  };

  const handleMoreInfo = (video: Video) => {
    trackNavigationEvent('Video Info Requested', {
      videoId: video.id,
      videoTitle: video.title,
      source: 'browse_page',
      from: location.pathname,
    });
    
    navigate(`/video/${video.id}`); // ✅ Navigate with UUID
  };

  // Featured videos carousel state
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const featuredVideos = !isSearching ? allVideos.filter(v => v.isTrending).slice(0, 5) : [];
  const featuredVideo = !isSearching && featuredVideos.length > 0 ? featuredVideos[currentFeaturedIndex] : null;

  // Auto-advance carousel every 10 seconds
  useEffect(() => {
    if (!isSearching && featuredVideos.length > 1) {
      const interval = setInterval(() => {
        setCurrentFeaturedIndex((prev) => (prev + 1) % featuredVideos.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isSearching, featuredVideos.length]);

  // Carousel navigation handlers
  const handlePrevFeatured = () => {
    setCurrentFeaturedIndex((prev) =>
      prev === 0 ? featuredVideos.length - 1 : prev - 1
    );
  };

  const handleNextFeatured = () => {
    setCurrentFeaturedIndex((prev) => (prev + 1) % featuredVideos.length);
  };

  // Data organization - Exclude featured carousel videos from trending row
  const videosToShow = isSearching ? filteredVideos : allVideos;
  const featuredVideoIds = featuredVideos.map(v => v.id);
  const trendingVideos = !isSearching
    ? allVideos.filter(v => v.isTrending && !featuredVideoIds.includes(v.id)).slice(0, 12)
    : [];
  const newVideos = !isSearching ? allVideos.filter(v => v.isNew).slice(0, 12) : [];
  const freeVideos = !isSearching ? allVideos.filter(v => v.accessTier === 'free').slice(0, 12) : [];
  const premiumVideos = !isSearching ? allVideos.filter(v => v.accessTier === 'premium').slice(0, 12) : [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black">
      <Header />

      {!isSearching && (
        <HeroSection
          featuredVideo={featuredVideo}
          loading={loading}
          onPlay={handlePlay}
          onMoreInfo={handleMoreInfo}
          onPrevSlide={handlePrevFeatured}
          onNextSlide={handleNextFeatured}
          currentIndex={currentFeaturedIndex}
          totalSlides={featuredVideos.length}
        />
      )}

      <main className="flex-1 container mx-auto py-10 dark:text-white">
        {/* Error State */}
        {error && (
          <div className="text-center text-red-600 mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <AlertCircle className="w-5 h-5 inline-block mr-2" />
            {error}
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="ml-4"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Search Security Errors */}
        {searchErrors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold mb-2">Search Security Error</p>
              {searchErrors.map((error, index) => (
                <p key={index} className="text-sm">{error}</p>
              ))}
              <Button
                onClick={handleClearSearch}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                Clear Search
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Search Warnings */}
        {searchWarnings.length > 0 && !searchErrors.length && (
          <Alert className="mb-6 bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription>
              {searchWarnings.map((warning, index) => (
                <p key={index} className="text-sm text-yellow-800">{warning}</p>
              ))}
            </AlertDescription>
          </Alert>
        )}

        {/* Search Results Header */}
        {isSearching && searchQuery && !searchErrors.length && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Search Results
                </h2>
                <p className="text-gray-600">
                  Found <strong>{filteredVideos.length}</strong> result{filteredVideos.length !== 1 ? 's' : ''} for "<strong>{searchQuery}</strong>"
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

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-sm">
                <Search className="w-3 h-3 mr-1" />
                "{searchQuery}"
              </Badge>
              <Badge variant="outline" className="text-sm">
                {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        )}

        {/* No Results State */}
        {isSearching && searchQuery && filteredVideos.length === 0 && !loading && !searchErrors.length && (
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

        {/* Search Results Row */}
        {isSearching && searchQuery && filteredVideos.length > 0 && !searchErrors.length && (
          <VideoRow
            title="Search Results"
            videos={filteredVideos}
            loading={loading}
            onPlay={handlePlay}
            onUpgrade={handleUpgrade}
          />
        )}

        {/* Browse Content Rows */}
        {!isSearching && (
          <>
            {trendingVideos.length > 0 && (
              <VideoRow
                title="Trending Now"
                videos={trendingVideos}
                loading={loading}
                onPlay={handlePlay}
                onUpgrade={handleUpgrade}
              />
            )}

            {newVideos.length > 0 && (
              <VideoRow
                title="New Releases"
                videos={newVideos}
                loading={loading}
                onPlay={handlePlay}
                onUpgrade={handleUpgrade}
              />
            )}

            {freeVideos.length > 0 && (
              <VideoRow
                title="Free to Watch"
                videos={freeVideos}
                loading={loading}
                onPlay={handlePlay}
                onUpgrade={handleUpgrade}
              />
            )}

            {premiumVideos.length > 0 && (
              <VideoRow
                title="Premium Exclusives"
                videos={premiumVideos}
                loading={loading}
                onPlay={handlePlay}
                onUpgrade={handleUpgrade}
              />
            )}

            {/* Empty State - No Content At All */}
            {!loading && allVideos.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No content available</h3>
                <p className="text-gray-600 mb-6">
                  We're working on adding great content. Check back soon!
                </p>
                <Button onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BrowsePage;