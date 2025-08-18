// src/types/video.types.ts
export interface Video {
    id: number;
    title: string;
    expert: string;
    expertCredentials?: string;
    expertAvatar?: string;
    duration: string;
    category: string;
    rating: number;
    views: string;
    thumbnail: string;
    videoUrl?: string;
    isNew: boolean;
    isTrending: boolean;
    description: string;
    fullDescription?: string;
    relatedTopics?: string[];
    learningObjectives?: string[];
    
    // Access control properties
    accessTier: 'free' | 'basic' | 'premium';
    isFirstEpisode?: boolean;
    seriesId?: string;
    episodeNumber?: number;
  }
  
  export interface VideoSeries {
    id: string;
    title: string;
    videos: Video[];
    firstEpisodeFree: boolean;
  }
  
  export interface UpgradeContext {
    upgradeId?: string;  // Make optional
    source?: string;
    videoId?: string;
    videoTitle?: string;
    seriesId?: string;
    episode?: string;
    plan?: string;       // Add plan property
  }
  
  export interface Lesson {
    id: number;
    title: string;
    description: string;
    duration: string;
    thumbnail: string;
    accessTier: 'free' | 'basic' | 'premium';
    isFirstEpisode?: boolean;
  }
  
  export interface CommunityPost {
    id: number;
    author: string;
    avatar: string;
    timeAgo: string;
    content: string;
    likes: number;
    replies: number;
  }
  
  export interface PracticeQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
  }
  
  // Type alias for backward compatibility
  export type VideoContent = Video;