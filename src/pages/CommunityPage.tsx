// src/pages/CommunityPage.tsx
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { communityService } from '@/services/community.service';
import { useToast } from '@/hooks/use-toast';
import { useNavigationTracking } from '@/hooks/useNavigationTracking';
import {
  CommunityPost,
  CommunityHashtag,
  CommunityCategory,
  CommunityFilters,
  CommunityStats
} from '@/types/community.types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PostCard } from '@/components/Community/PostCard';
import { CreatePostModal } from '@/components/Community/CreatePostModal';
import { CommunityFiltersBar } from '@/components/Community/CommunityFiltersBar';
import { HashtagSidebar } from '@/components/Community/HashtagSidebar';
import { CommunityStats as StatsComponent } from '@/components/Community/CommunityStats';


import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  Plus,
  Search,
  TrendingUp,
  MessageCircle,
  Users,
  Hash,
  Filter,
  SortDesc,
  Sparkles,
  Crown,
  Shield
} from 'lucide-react';

const CommunityPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { trackNavigationEvent } = useNavigationTracking();
  const [searchParams, setSearchParams] = useSearchParams();

  // State management
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [hashtags, setHashtags] = useState<CommunityHashtag[]>([]);
  const [categories, setCategories] = useState<CommunityCategory[]>([]);
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');

  // Filters from URL params
  const filters: CommunityFilters = {
    hashtag: searchParams.get('hashtag') || undefined,
    category: searchParams.get('category') || undefined,
    sortBy: (searchParams.get('sort') as CommunityFilters['sortBy']) || 'hot',
    timeRange: (searchParams.get('time') as CommunityFilters['timeRange']) || 'day',
    showAnonymous: searchParams.get('anonymous') === 'true' || undefined,
  };

  // Load initial data
  useEffect(() => {
    loadCommunityData();
    trackNavigationEvent('Community Page Viewed', {
      hashtag: filters.hashtag,
      category: filters.category,
      source: 'navigation'
    });
  }, [filters.hashtag, filters.category, filters.sortBy, filters.timeRange]);

  const loadCommunityData = async () => {
    try {
      setLoading(true);
      const [postsData, hashtagsData, categoriesData, statsData] = await Promise.all([
        communityService.getPosts(filters),
        communityService.getTrendingHashtags(),
        communityService.getCategories(),
        communityService.getCommunityStats()
      ]);

      setPosts(postsData.posts);
      setHashtags(hashtagsData);
      setCategories(categoriesData);
      setStats(statsData);
      setHasMore(postsData.hasMore);
    } catch (error) {
      console.error('Failed to load community data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load community content',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const offset = posts.length;
      const { posts: newPosts, hasMore: moreAvailable } = await communityService.getPosts({
        ...filters,
        // Add offset parameter for pagination
      });
      
      setPosts(prev => [...prev, ...newPosts]);
      setHasMore(moreAvailable);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load more posts',
        variant: 'destructive'
      });
    } finally {
      setLoadingMore(false);
    }
  };

  const handleFilterChange = (key: keyof CommunityFilters, value: any) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    
    setSearchParams(newParams);
  };

  const handleHashtagClick = (hashtag: string) => {
    handleFilterChange('hashtag', hashtag);
    trackNavigationEvent('Hashtag Clicked', {
      feature: hashtag,
      source: 'hashtag_sidebar'
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search with query
      trackCommunityEvent('Community Search', {
        feature: searchQuery,
        source: 'search_bar'
      });
    }
  };

  const handleCreatePost = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to create posts',
        variant: 'destructive'
      });
      return;
    }
    setCreatePostOpen(true);
  };

  const handlePostCreated = (newPost: CommunityPost) => {
    setPosts(prev => [newPost, ...prev]);
    setCreatePostOpen(false);
    toast({
      title: 'Post created!',
      description: 'Your post has been shared with the community',
    });
  };

  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    if (!isAuthenticated) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to vote',
        variant: 'destructive'
      });
      return;
    }

    try {
      await communityService.vote({
        targetId: postId,
        targetType: 'post',
        voteType
      });

      // Optimistically update UI
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const currentVote = post.votes.userVote;
          let upvotes = post.votes.upvotes;
          let downvotes = post.votes.downvotes;
          let newUserVote: 'up' | 'down' | null = voteType;

          // Handle vote logic
          if (currentVote === voteType) {
            // Remove vote
            if (voteType === 'up') upvotes--;
            else downvotes--;
            newUserVote = null;
          } else {
            // Change or add vote
            if (currentVote === 'up') upvotes--;
            else if (currentVote === 'down') downvotes--;
            
            if (voteType === 'up') upvotes++;
            else downvotes++;
          }

          return {
            ...post,
            votes: {
              upvotes,
              downvotes,
              userVote: newUserVote
            }
          };
        }
        return post;
      }));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to vote on post',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-secondary">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-6">
              {[...Array(5)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Community Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Community
                <span className="bg-gradient-primary bg-clip-text text-transparent block">
                  Wellness Together
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Share your journey, connect with others, and find support in our mental health community
              </p>
            </div>
            <Button 
              onClick={handleCreatePost}
              className="rounded-full px-6 py-3 text-base font-medium"
              disabled={!isAuthenticated}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Post
            </Button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-6 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search posts, hashtags, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border-white/30"
              />
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filters Bar */}
            <CommunityFiltersBar
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categories}
            />

            {/* Active Filters */}
            {(filters.hashtag || filters.category) && (
              <div className="mb-6 flex flex-wrap gap-2">
                {filters.hashtag && (
                  <Badge 
                    variant="secondary" 
                    className="px-3 py-1 rounded-full cursor-pointer"
                    onClick={() => handleFilterChange('hashtag', null)}
                  >
                    #{filters.hashtag} ×
                  </Badge>
                )}
                {filters.category && (
                  <Badge 
                    variant="secondary" 
                    className="px-3 py-1 rounded-full cursor-pointer"
                    onClick={() => handleFilterChange('category', null)}
                  >
                    {filters.category} ×
                  </Badge>
                )}
              </div>
            )}

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Be the first to share something with the community!
                    </p>
                    <Button onClick={handleCreatePost} disabled={!isAuthenticated}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Post
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onVote={handleVote}
                      onHashtagClick={handleHashtagClick}
                    />
                  ))}
                  
                  {hasMore && (
                    <div className="text-center py-8">
                      <Button 
                        variant="outline" 
                        onClick={loadMorePosts}
                        disabled={loadingMore}
                        className="rounded-full"
                      >
                        {loadingMore ? 'Loading...' : 'Load More Posts'}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            {stats && <StatsComponent stats={stats} />}
            
            {/* Trending Hashtags */}
            <HashtagSidebar 
              hashtags={hashtags}
              onHashtagClick={handleHashtagClick}
              activeHashtag={filters.hashtag}
            />

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="w-5 h-5 text-primary" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categories.slice(0, 6).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleFilterChange('category', category.name)}
                    className={`w-full text-left p-3 rounded-xl transition-colors ${
                      filters.category === category.name
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.postCount}
                      </Badge>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Community Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>• Be respectful and supportive</p>
                <p>• Share your authentic experiences</p>
                <p>• Respect privacy and anonymity</p>
                <p>• No medical advice or crisis content</p>
                <p>• Report inappropriate content</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={createPostOpen}
        onClose={() => setCreatePostOpen(false)}
        onPostCreated={handlePostCreated}
        categories={categories}
      />

      <Footer />
    </div>
  );
};

export default CommunityPage;