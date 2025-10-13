// ============================================
// FILE: src/types/video.types.ts - VERIFIED COMPLETE VERSION
// ============================================

/**
 * Main Video interface - represents a video/content item
 * Uses UUID (string) for id field
 * Supports both frontend and backend field naming conventions
 */
export interface Video {
  // Identifiers
  id: string; // ✅ UUID string (primary key)
  slug?: string;
  
  // Basic Info
  title: string;
  description: string;
  fullDescription?: string;
  
  // Expert Info (supports both frontend and backend field names)
  expert: string;
  expert_title?: string; // ✅ Backend field
  expertCredentials?: string; // Frontend alias
  expert_avatar?: string; // ✅ Backend field
  expertAvatar?: string; // Frontend alias
  
  // Media
  duration: string; // Formatted as "MM:SS"
  duration_seconds?: number; // ✅ Backend field (raw seconds)
  thumbnail: string;
  thumbnail_url?: string; // ✅ Backend field
  videoUrl?: string;
  video_url?: string; // ✅ Backend field
  audioUrl?: string;
  audio_url?: string; // ✅ Backend field
  
  // Categorization
  category: string;
  category_name?: string; // ✅ Backend field
  content_type?: string; // 'video', 'audio', etc.
  
  // Metrics
  rating: number;
  views: string; // Formatted as "1.2k", "5.6M", etc.
  view_count?: number; // ✅ Backend field (raw number)
  
  // Flags
  isNew: boolean;
  is_new?: boolean; // ✅ Backend field
  isTrending: boolean;
  featured?: boolean; // ✅ Backend field (maps to isTrending)
  
  // Additional Content
  relatedTopics?: string[];
  learningObjectives?: string[];
  hashtags?: string[];
  
  // Access Control
  accessTier: 'free' | 'basic' | 'premium';
  access_tier?: string; // ✅ Backend field
  isFirstEpisode?: boolean;
  is_first_episode?: boolean; // ✅ Backend field - THIS MUST BE HERE
  seriesId?: string;
  series_id?: string; // ✅ Backend field
  episodeNumber?: number;
  episode_number?: number; // ✅ Backend field
  accessible?: boolean; // Computed field for user access
}

/**
 * Alias for backward compatibility
 * Use this in existing components that reference VideoContent
 */
export type VideoContent = Video;

/**
 * URL parameter type for video routes using UUID
 */
export interface VideoRouteParams {
  id: string; // UUID string
}

/**
 * Type guard to check if identifier is a UUID
 */
export function isUUID(identifier: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(identifier);
}

/**
 * Type guard to check if a video object has a valid UUID
 */
export function hasValidId(video: Partial<Video>): video is Video {
  return typeof video.id === 'string' && isUUID(video.id);
}

/**
 * Helper: Format view count for display
 */
export function formatViews(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

/**
 * Helper: Format duration seconds to MM:SS
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Normalize video object - converts backend field names to frontend names
 * Use this when receiving data from the API
 * 
 * @example
 * const apiData = await fetch('/api/videos');
 * const videos = apiData.map(item => normalizeVideo(item));
 */
export function normalizeVideo(raw: any): Video {
  return {
    // Identifiers
    id: raw.id,
    slug: raw.slug,
    
    // Basic Info
    title: raw.title || '',
    description: raw.description || '',
    fullDescription: raw.fullDescription || raw.full_description || raw.description || '',
    
    // Expert Info
    expert: raw.expert_name || raw.expert || 'Unknown',
    expert_title: raw.expert_title,
    expertCredentials: raw.expert_title || raw.expertCredentials || '',
    expert_avatar: raw.expert_avatar,
    expertAvatar: raw.expert_avatar || raw.expertAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${raw.expert_name || 'expert'}`,
    
    // Media
    duration: raw.duration || formatDuration(raw.duration_seconds || 0),
    duration_seconds: raw.duration_seconds,
    thumbnail: raw.thumbnail_url || raw.thumbnail || '',
    thumbnail_url: raw.thumbnail_url,
    videoUrl: raw.video_url || raw.videoUrl,
    video_url: raw.video_url,
    audioUrl: raw.audio_url || raw.audioUrl,
    audio_url: raw.audio_url,
    
    // Categorization
    category: raw.category_name || raw.category || 'General',
    category_name: raw.category_name,
    content_type: raw.content_type || 'video',
    
    // Metrics
    rating: raw.rating || 4.8,
    views: raw.views || formatViews(raw.view_count || 0),
    view_count: raw.view_count,
    
    // Flags
    isNew: raw.is_new || raw.isNew || false,
    is_new: raw.is_new,
    isTrending: raw.featured || raw.isTrending || false,
    featured: raw.featured,
    
    // Additional Content
    relatedTopics: raw.relatedTopics || raw.related_topics || [],
    learningObjectives: raw.learningObjectives || raw.learning_objectives || [],
    hashtags: raw.hashtags || [],
    
    // Access Control
    accessTier: (raw.access_tier || raw.accessTier || 'free') as 'free' | 'basic' | 'premium',
    access_tier: raw.access_tier,
    isFirstEpisode: raw.is_first_episode || raw.isFirstEpisode || false,
    is_first_episode: raw.is_first_episode, // ✅ This maps the backend field
    seriesId: raw.series_id || raw.seriesId,
    series_id: raw.series_id,
    episodeNumber: raw.episode_number || raw.episodeNumber,
    episode_number: raw.episode_number,
    accessible: raw.accessible !== undefined ? raw.accessible : true,
  };
}

/**
 * Extract video ID from various sources
 * Handles both UUID strings and Video objects
 */
export function extractVideoId(source: string | Video): string {
  if (typeof source === 'object' && source !== null) {
    return source.id;
  }
  return String(source);
}

/**
 * Validate if a string is a valid video ID (UUID)
 */
export function isValidVideoId(id: string): boolean {
  return isUUID(id);
}

/**
 * Create a safe video ID for routing
 * Throws error if ID is not a valid UUID
 */
export function toSafeVideoId(id: string | number): string {
  const strId = String(id);
  if (isUUID(strId)) {
    return strId;
  }
  throw new Error(`Invalid video ID format: ${id}. Expected UUID.`);
}

/**
 * Check if a video is accessible based on user's subscription
 * This is a helper - actual access control should be done server-side
 */
export function canAccessVideo(video: Video, userTier: 'free' | 'basic' | 'premium'): boolean {
  const tierHierarchy = { free: 0, basic: 1, premium: 2 };
  
  // First episodes are always free
  if (video.isFirstEpisode || video.is_first_episode) {
    return true;
  }
  
  // Check tier hierarchy
  return tierHierarchy[userTier] >= tierHierarchy[video.accessTier as keyof typeof tierHierarchy];
}