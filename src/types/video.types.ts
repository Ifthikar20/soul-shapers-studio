// src/types/video.types.ts (create this file)
export interface Video {
    id: number;
    title: string;
    expert: string;
    duration: string;
    category: string;
    rating: number;
    views: string;
    thumbnail: string;
    videoUrl: string;
    isNew: boolean;
    isTrending: boolean;
    description: string;
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