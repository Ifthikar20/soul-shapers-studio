// Dummy video data for testing and development
import { Video } from '@/types/video.types';

export const dummySeriesVideos: Video[] = [
  {
    id: 'dummy-ep1-001',
    title: 'Understanding Your Mental Health - Episode 1: The Basics',
    description: 'Learn the fundamentals of mental health and why it matters for your overall well-being.',
    fullDescription: 'In this first episode, we explore the foundations of mental health, discussing what it means to be mentally healthy and why it\'s just as important as physical health. You\'ll learn about common misconceptions and get practical tips for maintaining good mental health.',
    expert: 'Dr. Sarah Johnson',
    expertCredentials: 'Clinical Psychologist, Ph.D.',
    expertAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    duration: '12:45',
    duration_seconds: 765,
    thumbnail: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80',
    category: 'Mental Health',
    category_name: 'Mental Health',
    rating: 4.8,
    views: '2.3k',
    view_count: 2300,
    isNew: true,
    isTrending: true,
    accessTier: 'free',
    series_id: 'mental-health-series-001',
    episode_number: 1,
    learningObjectives: [
      'Understand what mental health means',
      'Recognize the signs of good mental health',
      'Learn common misconceptions about mental health',
      'Discover practical daily habits for mental wellness'
    ],
    relatedTopics: ['Mental Wellness', 'Self-Care', 'Psychology Basics', 'Emotional Health'],
    content_type: 'video'
  },
  {
    id: 'dummy-ep2-002',
    title: 'Understanding Your Mental Health - Episode 2: Managing Stress',
    description: 'Discover effective strategies for managing stress in your daily life.',
    fullDescription: 'Stress is a natural part of life, but chronic stress can take a toll on your mental and physical health. In this episode, we dive deep into understanding stress, its effects on your body and mind, and proven techniques to manage it effectively.',
    expert: 'Dr. Sarah Johnson',
    expertCredentials: 'Clinical Psychologist, Ph.D.',
    expertAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    duration: '15:30',
    duration_seconds: 930,
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    category: 'Mental Health',
    category_name: 'Mental Health',
    rating: 4.9,
    views: '1.8k',
    view_count: 1800,
    isNew: true,
    isTrending: false,
    accessTier: 'free',
    series_id: 'mental-health-series-001',
    episode_number: 2,
    learningObjectives: [
      'Identify your personal stress triggers',
      'Learn evidence-based stress management techniques',
      'Practice breathing exercises for immediate relief',
      'Create a personalized stress management plan'
    ],
    relatedTopics: ['Stress Management', 'Relaxation Techniques', 'Mindfulness', 'Work-Life Balance'],
    content_type: 'video'
  },
  {
    id: 'dummy-ep3-003',
    title: 'Understanding Your Mental Health - Episode 3: Building Resilience',
    description: 'Learn how to bounce back from setbacks and build mental resilience.',
    fullDescription: 'Resilience is the ability to adapt and bounce back from adversity, trauma, or stress. This episode teaches you how to develop resilience through practical exercises, mindset shifts, and building a strong support system.',
    expert: 'Dr. Sarah Johnson',
    expertCredentials: 'Clinical Psychologist, Ph.D.',
    expertAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    duration: '18:20',
    duration_seconds: 1100,
    thumbnail: 'https://images.unsplash.com/photo-1552581234-26160f608093?w=800&q=80',
    category: 'Mental Health',
    category_name: 'Mental Health',
    rating: 4.9,
    views: '1.5k',
    view_count: 1500,
    isNew: true,
    isTrending: false,
    accessTier: 'basic',
    series_id: 'mental-health-series-001',
    episode_number: 3,
    learningObjectives: [
      'Understand the science behind resilience',
      'Learn the 7 pillars of resilience',
      'Practice resilience-building exercises',
      'Develop a growth mindset for challenges'
    ],
    relatedTopics: ['Resilience', 'Mental Strength', 'Coping Skills', 'Personal Growth'],
    content_type: 'video'
  },
  {
    id: 'dummy-ep4-004',
    title: 'Understanding Your Mental Health - Episode 4: Emotional Intelligence',
    description: 'Master the art of understanding and managing your emotions.',
    fullDescription: 'Emotional intelligence is crucial for mental health and success in all areas of life. Learn how to identify, understand, and regulate your emotions while building better relationships with others.',
    expert: 'Dr. Sarah Johnson',
    expertCredentials: 'Clinical Psychologist, Ph.D.',
    expertAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    duration: '16:45',
    duration_seconds: 1005,
    thumbnail: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=800&q=80',
    category: 'Mental Health',
    category_name: 'Mental Health',
    rating: 4.8,
    views: '1.2k',
    view_count: 1200,
    isNew: false,
    isTrending: false,
    accessTier: 'basic',
    series_id: 'mental-health-series-001',
    episode_number: 4,
    learningObjectives: [
      'Identify and name your emotions accurately',
      'Understand the connection between thoughts and feelings',
      'Practice emotional regulation techniques',
      'Improve empathy and social awareness'
    ],
    relatedTopics: ['Emotional Intelligence', 'Self-Awareness', 'Empathy', 'Relationships'],
    content_type: 'video'
  },
  {
    id: 'dummy-ep5-005',
    title: 'Understanding Your Mental Health - Episode 5: Sleep and Mental Health',
    description: 'Discover the powerful connection between quality sleep and mental wellness.',
    fullDescription: 'Sleep is one of the most important factors in mental health. This episode explores the science of sleep, its impact on your mood and cognitive function, and practical strategies for improving your sleep quality.',
    expert: 'Dr. Sarah Johnson',
    expertCredentials: 'Clinical Psychologist, Ph.D.',
    expertAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    duration: '14:15',
    duration_seconds: 855,
    thumbnail: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80',
    category: 'Mental Health',
    category_name: 'Mental Health',
    rating: 4.7,
    views: '980',
    view_count: 980,
    isNew: false,
    isTrending: false,
    accessTier: 'premium',
    series_id: 'mental-health-series-001',
    episode_number: 5,
    learningObjectives: [
      'Understand the sleep-mental health connection',
      'Learn about sleep cycles and quality',
      'Create a sleep-friendly environment',
      'Develop a consistent bedtime routine'
    ],
    relatedTopics: ['Sleep Health', 'Rest & Recovery', 'Circadian Rhythm', 'Sleep Hygiene'],
    content_type: 'video'
  }
];

// Related videos from different series/categories
export const dummyRelatedVideos: Video[] = [
  {
    id: 'dummy-related-001',
    title: 'Mindfulness Meditation for Beginners',
    description: 'A gentle introduction to mindfulness practice for stress relief and mental clarity.',
    expert: 'Dr. Michael Chen',
    expertCredentials: 'Meditation Instructor',
    expertAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    duration: '10:30',
    duration_seconds: 630,
    thumbnail: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80',
    category: 'Mental Health',
    category_name: 'Mental Health',
    rating: 4.6,
    views: '5.2k',
    view_count: 5200,
    isNew: false,
    isTrending: true,
    accessTier: 'free',
    content_type: 'video'
  },
  {
    id: 'dummy-related-002',
    title: 'Breaking Free from Anxiety',
    description: 'Practical techniques to manage and reduce anxiety in everyday situations.',
    expert: 'Dr. Emily Rodriguez',
    expertCredentials: 'Anxiety Specialist',
    expertAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    duration: '13:20',
    duration_seconds: 800,
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    category: 'Mental Health',
    category_name: 'Mental Health',
    rating: 4.9,
    views: '3.7k',
    view_count: 3700,
    isNew: true,
    isTrending: true,
    accessTier: 'free',
    content_type: 'video'
  },
  {
    id: 'dummy-related-003',
    title: 'The Power of Positive Thinking',
    description: 'Transform your mindset and cultivate optimism for better mental health.',
    expert: 'Dr. James Thompson',
    expertCredentials: 'Positive Psychology Expert',
    expertAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    duration: '11:45',
    duration_seconds: 705,
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    category: 'Mental Health',
    category_name: 'Mental Health',
    rating: 4.5,
    views: '2.1k',
    view_count: 2100,
    isNew: false,
    isTrending: false,
    accessTier: 'basic',
    content_type: 'video'
  },
  {
    id: 'dummy-related-004',
    title: 'Overcoming Depression Naturally',
    description: 'Evidence-based natural approaches to managing depression and improving mood.',
    expert: 'Dr. Lisa Anderson',
    expertCredentials: 'Clinical Therapist',
    expertAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    duration: '17:10',
    duration_seconds: 1030,
    thumbnail: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80',
    category: 'Mental Health',
    category_name: 'Mental Health',
    rating: 4.8,
    views: '4.5k',
    view_count: 4500,
    isNew: false,
    isTrending: true,
    accessTier: 'basic',
    content_type: 'video'
  },
  {
    id: 'dummy-related-005',
    title: 'Building Healthy Relationships',
    description: 'Learn communication skills and boundaries for healthier connections.',
    expert: 'Dr. Robert Williams',
    expertCredentials: 'Relationship Counselor',
    expertAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    duration: '15:55',
    duration_seconds: 955,
    thumbnail: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80',
    category: 'Mental Health',
    category_name: 'Mental Health',
    rating: 4.7,
    views: '1.9k',
    view_count: 1900,
    isNew: true,
    isTrending: false,
    accessTier: 'premium',
    content_type: 'video'
  },
  {
    id: 'dummy-related-006',
    title: 'Managing Work-Life Balance',
    description: 'Strategies to prevent burnout and create sustainable work-life harmony.',
    expert: 'Dr. Amanda Foster',
    expertCredentials: 'Burnout Prevention Specialist',
    expertAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda',
    duration: '12:30',
    duration_seconds: 750,
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    category: 'Mental Health',
    category_name: 'Mental Health',
    rating: 4.6,
    views: '3.3k',
    view_count: 3300,
    isNew: false,
    isTrending: false,
    accessTier: 'free',
    content_type: 'video'
  }
];

// Helper function to get all dummy videos
export const getAllDummyVideos = (): Video[] => {
  return [...dummySeriesVideos, ...dummyRelatedVideos];
};

// Helper function to get series episodes by series_id
export const getDummySeriesEpisodes = (seriesId: string): Video[] => {
  return dummySeriesVideos.filter(v => v.series_id === seriesId);
};

// Helper function to get next episode
export const getDummyNextEpisode = (currentEpisodeNumber: number, seriesId: string): Video | null => {
  const episodes = getDummySeriesEpisodes(seriesId);
  return episodes.find(ep => (ep.episode_number || 0) === currentEpisodeNumber + 1) || null;
};

// Helper function to get video by ID (prioritizes dummy data, useful for testing)
export const getDummyVideoById = (id: string): Video | null => {
  const allVideos = getAllDummyVideos();
  return allVideos.find(v => v.id === id) || null;
};
