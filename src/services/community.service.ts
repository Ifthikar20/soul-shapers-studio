// src/services/community.service.ts - Mock Version with Dummy Data
import {
    CommunityPost,
    CommunityComment,
    CommunityHashtag,
    CommunityCategory,
    CreatePostRequest,
    CreateCommentRequest,
    VoteRequest,
    ReportRequest,
    CommunityFilters,
    CommunityStats
  } from '@/types/community.types';
  
  // Mock data for testing
  const mockPosts: CommunityPost[] = [
    {
      id: '1',
      title: 'My Journey with Anxiety - Finding Hope Again',
      content: `After struggling with anxiety for years, I finally found some techniques that really work for me. I wanted to share them in case they help someone else.
  
  1. Daily meditation - even just 5 minutes helps
  2. Journaling my thoughts and feelings
  3. Regular exercise, especially walking in nature
  4. Connecting with supportive friends and family
  5. Working with a therapist who specializes in anxiety
  
  The journey isn't linear, and there are still difficult days, but I'm learning to be patient with myself. Recovery takes time, and that's okay.`,
      author: {
        id: '1',
        name: 'Sarah M.',
        tier: 'premium'
      },
      hashtags: ['anxiety', 'recovery', 'mentalhealth', 'hope'],
      category: 'Mental Health',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      votes: {
        upvotes: 47,
        downvotes: 2,
        userVote: null
      },
      commentCount: 12,
      isAnonymous: false,
      moderationStatus: 'approved'
    },
    {
      id: '2',
      title: 'Meditation for Beginners - Simple 5-Minute Practice',
      content: `I've been meditating for 3 years now and wanted to share a simple practice for anyone just starting out:
  
  Find a quiet spot and sit comfortably
  Close your eyes and take 3 deep breaths
  Focus on your natural breathing
  When your mind wanders (it will!), gently return to your breath
  Start with just 5 minutes
  
  Remember: there's no "perfect" meditation. The goal isn't to stop thinking, but to notice when you're thinking and gently come back to the present moment.`,
      author: {
        id: '2',
        name: 'Anonymous',
        tier: 'free'
      },
      hashtags: ['meditation', 'mindfulness', 'beginners', 'breathing'],
      category: 'Mindfulness & Meditation',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      votes: {
        upvotes: 23,
        downvotes: 1,
        userVote: null
      },
      commentCount: 8,
      isAnonymous: true,
      moderationStatus: 'approved'
    },
    {
      id: '3',
      title: 'Breaking the Cycle of Negative Self-Talk',
      content: `One thing that's really helped me is catching myself when I start the negative self-talk spiral. Here's what I've learned:
  
  The old pattern:
  "I messed up" → "I always mess up" → "I'm a failure" → feeling worse
  
  The new pattern:
  "I messed up" → "That was a mistake, but it doesn't define me" → "What can I learn from this?" → moving forward
  
  It takes practice, but being aware of these thoughts is the first step to changing them.`,
      author: {
        id: '3',
        name: 'Alex Chen',
        tier: 'basic'
      },
      hashtags: ['selftalk', 'mindset', 'selfcompassion', 'growth'],
      category: 'Personal Growth',
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      votes: {
        upvotes: 31,
        downvotes: 0,
        userVote: null
      },
      commentCount: 15,
      isAnonymous: false,
      moderationStatus: 'approved'
    },
    {
      id: '4',
      title: 'Finding Support During Difficult Times',
      content: `Going through a really tough period right now and wanted to remind everyone (and myself) that it's okay to ask for help.
  
  Sometimes we feel like we should handle everything alone, but reaching out is actually a sign of strength, not weakness.
  
  If you're struggling:
  - Talk to someone you trust
  - Consider professional support
  - Remember that feelings are temporary
  - You're not alone in this
  
  Sending love to anyone who needs it today.`,
      author: {
        id: '4',
        name: 'Anonymous',
        tier: 'premium'
      },
      hashtags: ['support', 'community', 'mentalhealth', 'selfcare'],
      category: 'Emotional Wellness',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      votes: {
        upvotes: 56,
        downvotes: 1,
        userVote: null
      },
      commentCount: 24,
      isAnonymous: true,
      moderationStatus: 'approved'
    },
    {
      id: '5',
      title: 'Celebrating Small Wins Today',
      content: `Made my bed, took a shower, and ate a real meal today. Might not sound like much, but when you're dealing with depression, these feel like huge victories.
  
  Just wanted to remind everyone to celebrate the small things. Progress isn't always dramatic - sometimes it's just getting through the day, and that's enough.`,
      author: {
        id: '5',
        name: 'Jordan K.',
        tier: 'free'
      },
      hashtags: ['smallwins', 'depression', 'progress', 'selfcare'],
      category: 'Mental Health',
      createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      votes: {
        upvotes: 89,
        downvotes: 0,
        userVote: null
      },
      commentCount: 32,
      isAnonymous: false,
      moderationStatus: 'approved'
    }
  ];
  
  const mockHashtags: CommunityHashtag[] = [
    {
      id: '1',
      name: 'anxiety',
      description: 'Discussions about anxiety, coping strategies, and support',
      postCount: 156,
      followerCount: 834,
      isUserFollowing: false,
      category: 'Mental Health',
      isTrending: true,
      moderatorIds: [],
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'meditation',
      description: 'Mindfulness practices, techniques, and experiences',
      postCount: 98,
      followerCount: 567,
      isUserFollowing: true,
      category: 'Mindfulness & Meditation',
      isTrending: true,
      moderatorIds: [],
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'selfcare',
      description: 'Self-care practices and wellness routines',
      postCount: 234,
      followerCount: 1203,
      isUserFollowing: false,
      category: 'Emotional Wellness',
      isTrending: true,
      moderatorIds: [],
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      name: 'depression',
      description: 'Support and resources for depression',
      postCount: 187,
      followerCount: 945,
      isUserFollowing: false,
      category: 'Mental Health',
      isTrending: false,
      moderatorIds: [],
      createdAt: new Date().toISOString()
    },
    {
      id: '5',
      name: 'recovery',
      description: 'Stories and support for mental health recovery',
      postCount: 76,
      followerCount: 432,
      isUserFollowing: true,
      category: 'Mental Health',
      isTrending: false,
      moderatorIds: [],
      createdAt: new Date().toISOString()
    }
  ];
  
  const mockCategories: CommunityCategory[] = [
    {
      id: '1',
      name: 'Mental Health',
      description: 'Anxiety, depression, stress management, and general mental wellness',
      icon: '🧠',
      color: 'purple',
      postCount: 342,
      hashtags: []
    },
    {
      id: '2',
      name: 'Mindfulness & Meditation',
      description: 'Meditation practices, mindfulness techniques, and present moment awareness',
      icon: '🧘',
      color: 'green',
      postCount: 198,
      hashtags: []
    },
    {
      id: '3',
      name: 'Emotional Wellness',
      description: 'Emotional intelligence, relationships, and emotional regulation',
      icon: '💜',
      color: 'pink',
      postCount: 156,
      hashtags: []
    },
    {
      id: '4',
      name: 'Personal Growth',
      description: 'Self-improvement, goal setting, and personal development',
      icon: '🌱',
      color: 'blue',
      postCount: 123,
      hashtags: []
    },
    {
      id: '5',
      name: 'Breaking Habits',
      description: 'Addiction recovery, habit formation, and behavior change',
      icon: '🔄',
      color: 'orange',
      postCount: 87,
      hashtags: []
    }
  ];
  
  const mockStats: CommunityStats = {
    totalPosts: 906,
    totalComments: 2847,
    activeUsers: 1234,
    trendingHashtags: mockHashtags.filter(h => h.isTrending),
    topCategories: mockCategories
  };
  
  // SECURITY: Mock service that simulates real API behavior
  class MockCommunityService {
    private readonly isDemo = true; // Always demo mode for now
    
    // Simulate API delay
    private async simulateDelay(ms: number = 500): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  
    // GET CONTENT
    async getPosts(filters: CommunityFilters): Promise<{ posts: CommunityPost[]; hasMore: boolean }> {
      await this.simulateDelay();
      
      let filteredPosts = [...mockPosts];
      
      // Apply filters
      if (filters.hashtag) {
        filteredPosts = filteredPosts.filter(post => 
          post.hashtags.includes(filters.hashtag!)
        );
      }
      
      if (filters.category) {
        filteredPosts = filteredPosts.filter(post => 
          post.category === filters.category
        );
      }
      
      // Apply sorting
      switch (filters.sortBy) {
        case 'newest':
          filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'oldest':
          filteredPosts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          break;
        case 'top':
          filteredPosts.sort((a, b) => (b.votes.upvotes - b.votes.downvotes) - (a.votes.upvotes - a.votes.downvotes));
          break;
        case 'hot':
        default:
          // Hot algorithm: recent posts with high engagement
          filteredPosts.sort((a, b) => {
            const aScore = (a.votes.upvotes - a.votes.downvotes) + a.commentCount;
            const bScore = (b.votes.upvotes - b.votes.downvotes) + b.commentCount;
            return bScore - aScore;
          });
          break;
      }
      
      return {
        posts: filteredPosts,
        hasMore: false // For demo, show all posts
      };
    }
  
    async getPost(postId: string): Promise<CommunityPost> {
      await this.simulateDelay();
      const post = mockPosts.find(p => p.id === postId);
      if (!post) throw new Error('Post not found');
      return post;
    }
  
    async getComments(postId: string): Promise<CommunityComment[]> {
      await this.simulateDelay();
      // Return empty for now - comments can be added later
      return [];
    }
  
    async getHashtags(): Promise<CommunityHashtag[]> {
      await this.simulateDelay();
      return mockHashtags;
    }
  
    async getTrendingHashtags(): Promise<CommunityHashtag[]> {
      await this.simulateDelay();
      return mockHashtags.filter(h => h.isTrending);
    }
  
    async getCategories(): Promise<CommunityCategory[]> {
      await this.simulateDelay();
      return mockCategories;
    }
  
    async getCommunityStats(): Promise<CommunityStats> {
      await this.simulateDelay();
      return mockStats;
    }
  
    // CREATE CONTENT
    async createPost(postData: CreatePostRequest): Promise<CommunityPost> {
      await this.simulateDelay();
      
      const newPost: CommunityPost = {
        id: Date.now().toString(),
        title: postData.title,
        content: postData.content,
        author: {
          id: 'current-user',
          name: postData.isAnonymous ? 'Anonymous' : 'Current User',
          tier: 'free'
        },
        hashtags: postData.hashtags,
        category: postData.category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        votes: {
          upvotes: 0,
          downvotes: 0,
          userVote: null
        },
        commentCount: 0,
        isAnonymous: postData.isAnonymous,
        moderationStatus: 'approved'
      };
      
      // Add to mock data
      mockPosts.unshift(newPost);
      
      return newPost;
    }
  
    async createComment(commentData: CreateCommentRequest): Promise<CommunityComment> {
      await this.simulateDelay();
      // Mock implementation - would create actual comment
      throw new Error('Comments not implemented in demo');
    }
  
    // VOTING SYSTEM
    async vote(voteData: VoteRequest): Promise<{ success: boolean }> {
      await this.simulateDelay();
      
      const post = mockPosts.find(p => p.id === voteData.targetId);
      if (post) {
        const currentVote = post.votes.userVote;
        
        if (voteData.voteType === 'remove' || currentVote === voteData.voteType) {
          // Remove vote
          if (currentVote === 'up') post.votes.upvotes--;
          else if (currentVote === 'down') post.votes.downvotes--;
          post.votes.userVote = null;
        } else {
          // Change or add vote
          if (currentVote === 'up') post.votes.upvotes--;
          else if (currentVote === 'down') post.votes.downvotes--;
          
          if (voteData.voteType === 'up') {
            post.votes.upvotes++;
            post.votes.userVote = 'up';
          } else if (voteData.voteType === 'down') {
            post.votes.downvotes++;
            post.votes.userVote = 'down';
          }
        }
      }
      
      return { success: true };
    }
  
    // MODERATION (Mock implementations)
    async reportContent(reportData: ReportRequest): Promise<{ success: boolean }> {
      await this.simulateDelay();
      console.log('Mock: Content reported', reportData);
      return { success: true };
    }
  
    async deletePost(postId: string): Promise<{ success: boolean }> {
      await this.simulateDelay();
      const index = mockPosts.findIndex(p => p.id === postId);
      if (index > -1) {
        mockPosts.splice(index, 1);
      }
      return { success: true };
    }
  
    async deleteComment(commentId: string): Promise<{ success: boolean }> {
      await this.simulateDelay();
      return { success: true };
    }
  
    // HASHTAG MANAGEMENT
    async followHashtag(hashtagId: string): Promise<{ success: boolean }> {
      await this.simulateDelay();
      const hashtag = mockHashtags.find(h => h.id === hashtagId);
      if (hashtag) {
        hashtag.isUserFollowing = true;
        hashtag.followerCount++;
      }
      return { success: true };
    }
  
    async unfollowHashtag(hashtagId: string): Promise<{ success: boolean }> {
      await this.simulateDelay();
      const hashtag = mockHashtags.find(h => h.id === hashtagId);
      if (hashtag) {
        hashtag.isUserFollowing = false;
        hashtag.followerCount--;
      }
      return { success: true };
    }
  
    // SEARCH
    async searchPosts(query: string, filters?: Partial<CommunityFilters>): Promise<CommunityPost[]> {
      await this.simulateDelay();
      return mockPosts.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.hashtags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }
  
    // USER CONTENT
    async getUserPosts(userId?: string): Promise<CommunityPost[]> {
      await this.simulateDelay();
      return mockPosts.filter(post => post.author.id === (userId || 'current-user'));
    }
  
    async getUserComments(userId?: string): Promise<CommunityComment[]> {
      await this.simulateDelay();
      return [];
    }
  }
  
  // Export singleton instance
  export const communityService = new MockCommunityService();