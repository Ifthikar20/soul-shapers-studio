// src/types/community.types.ts
export interface CommunityPost {
    id: string;
    title: string;
    content: string;
    author: {
      id: string;
      name: string;
      avatar?: string;
      tier: 'free' | 'basic' | 'premium';
      verified?: boolean;
    };
    hashtags: string[];
    category: string;
    createdAt: string;
    updatedAt: string;
    votes: {
      upvotes: number;
      downvotes: number;
      userVote?: 'up' | 'down' | null;
    };
    commentCount: number;
    isAnonymous: boolean;
    isSticky?: boolean;
    isFeatured?: boolean;
    moderationStatus: 'approved' | 'pending' | 'rejected';
    reportCount?: number;
  }
  
  export interface CommunityComment {
    id: string;
    postId: string;
    content: string;
    author: {
      id: string;
      name: string;
      avatar?: string;
      tier: 'free' | 'basic' | 'premium';
      verified?: boolean;
    };
    parentId?: string; // For nested replies
    createdAt: string;
    updatedAt: string;
    votes: {
      upvotes: number;
      downvotes: number;
      userVote?: 'up' | 'down' | null;
    };
    replies?: CommunityComment[];
    isAnonymous: boolean;
    moderationStatus: 'approved' | 'pending' | 'rejected';
    reportCount?: number;
  }
  
  export interface CommunityHashtag {
    id: string;
    name: string;
    description?: string;
    postCount: number;
    followerCount: number;
    isUserFollowing?: boolean;
    category: string;
    isTrending?: boolean;
    moderatorIds: string[];
    rules?: string[];
    createdAt: string;
  }
  
  export interface CommunityCategory {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    postCount: number;
    hashtags: CommunityHashtag[];
  }
  
  export interface CreatePostRequest {
    title: string;
    content: string;
    hashtags: string[];
    category: string;
    isAnonymous: boolean;
  }
  
  export interface CreateCommentRequest {
    postId: string;
    content: string;
    parentId?: string;
    isAnonymous: boolean;
  }
  
  export interface VoteRequest {
    targetId: string;
    targetType: 'post' | 'comment';
    voteType: 'up' | 'down' | 'remove';
  }
  
  export interface ReportRequest {
    targetId: string;
    targetType: 'post' | 'comment';
    reason: string;
    description?: string;
  }
  
  export interface CommunityFilters {
    hashtag?: string;
    category?: string;
    sortBy: 'newest' | 'oldest' | 'hot' | 'top';
    timeRange?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
    showAnonymous?: boolean;
  }
  
  export interface CommunityStats {
    totalPosts: number;
    totalComments: number;
    activeUsers: number;
    trendingHashtags: CommunityHashtag[];
    topCategories: CommunityCategory[];
  }