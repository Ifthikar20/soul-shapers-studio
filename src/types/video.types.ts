// ============================================
// FILE 1: src/types/video.types.ts
// ============================================
export interface Video {
  id: string; // ✅ CHANGED: UUID string instead of number
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

// ✅ URL parameter type for video routes using UUID
export interface VideoRouteParams {
  id: string; // ✅ CHANGED: Use 'id' instead of 'shortId'
}

// ✅ Type guard to check if identifier is a UUID
export function isUUID(identifier: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(identifier);
}