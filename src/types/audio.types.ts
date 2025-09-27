// src/types/audio.types.ts
export interface AudioContent {
    id: number;
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