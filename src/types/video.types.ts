// src/types/video.types.ts
export interface Video {
  id: number;
  short_id: string;
  slug?: string;
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
  short_id?: string;
  title: string;
  videos: Video[];
  firstEpisodeFree: boolean;
}

// ✅ UPDATED: Added missing properties
export interface UpgradeContext {
  upgradeId?: string;
  source?: string;
  videoId?: number;
  videoShortId?: string;  // ✅ ADDED for short_id tracking
  videoTitle?: string;
  seriesId?: string;
  episodeNumber?: number; // ✅ Keep this as number
  episode?: string;       // ✅ ADDED as string alternative
  plan?: string;
}

export interface Lesson {
  id: number;
  short_id?: string;
  slug?: string;
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

// ✅ Helper type for video identifiers
export type VideoIdentifier = string | number;

// ✅ URL parameter type for video routes
export interface VideoRouteParams {
  shortId: string;
}

// ✅ Type guard to check if a video has a short_id
export function hasShortId(video: Partial<Video>): video is Video & { short_id: string } {
  return typeof video.short_id === 'string' && video.short_id.length > 0;
}

// ✅ Type guard to check if identifier is a short_id (11 chars, alphanumeric)
export function isShortId(identifier: string): boolean {
  return /^[A-Za-z0-9_-]{11}$/.test(identifier);
}