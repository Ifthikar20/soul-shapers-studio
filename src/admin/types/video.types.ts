export interface VideoData {
    id: number;
    title: string;
    expert: string;
    expertId: number;
    duration: string;
    category: string;
    subcategory: string;
    rating: number;
    views: string;
    thumbnail: string;
    videoUrl: string;
    isNew: boolean;
    isTrending: boolean;
    isFeatured: boolean;
    status: 'draft' | 'published';
    description: string;
    fullDescription: string;
    learningObjectives: string[];
    relatedTopics: string[];
    chapters: VideoChapter[];
    tags: string[];
    uploadDate: string;
    lastUpdated: string;
  }
  
  export interface VideoChapter {
    title: string;
    startTime: string;
    endTime: string;
  }