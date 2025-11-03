// src/types/audio.types.ts
//
// ⚠️ NOTE: When integrating with backend, 'id' should be UUID format string
// Currently using mock data with simple numeric IDs
//
export interface AudioContent {
    id: number | string; // Can be number (mock) or UUID string (backend)
    title: string;
    expert: string;
    expertCredentials: string;
    expertAvatar: string;
    duration: string;
    category: string;
    rating: number;
    listens: string;
    thumbnail: string;
    isNew: boolean;
    isTrending: boolean;
    description: string;
    fullDescription: string;
    audioUrl: string;
    accessTier: 'free' | 'premium';
    isFirstEpisode?: boolean;
    seriesId?: string;
    episodeNumber?: number;
  }