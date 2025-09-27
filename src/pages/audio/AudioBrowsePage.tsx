// src/pages/audio/AudioBrowsePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigationTracking } from '@/hooks/useNavigationTracking';
import { AlertCircle, Headphones, Play, Clock, User, Star, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AudioHeroSection from '@/components/Audio/AudioHeroSection';
import AudioRow from '@/components/Audio/AudioRow';
import AudioModal from '@/components/Audio/AudioModal';

interface AudioContent {
  id: number;
  title: string;
  expert: string;
  expertCredentials: string;
  expertAvatar: string;
  duration: string;
  category: string;
  rating: number;
  views: string;
  thumbnail: string;
  isNew: boolean;
  isTrending: boolean;
  description: string;
  fullDescription: string;
  audioUrl: string;
  relatedTopics: string[];
  learningObjectives: string[];
  accessTier: 'free' | 'premium';
  isFirstEpisode?: boolean;
  seriesId?: string;
  episodeNumber?: number;
  hashtags: string[];
}

// Mock audio content data
const mockAudioContent: AudioContent[] = [
  {
    id: 1,
    title: "5-Minute Morning Meditation for Inner Peace",
    expert: "Dr. Sarah Johnson",
    expertCredentials: "Mindfulness Expert, PhD in Psychology",
    expertAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
    duration: "5:30",
    category: "Mindfulness",
    rating: 4.9,
    views: "25.3k",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    isNew: true,
    isTrending: true,
    description: "Start your day with a peaceful guided meditation focused on breath awareness and intention setting.",
    fullDescription: "This gentle morning meditation guide will help you establish a centered, peaceful start to your day. Dr. Johnson leads you through breathing techniques, body awareness, and intention setting practices that can transform your morning routine and overall well-being.",
    audioUrl: "/audio/morning-meditation.mp3",
    relatedTopics: ["Breath Work", "Morning Routines", "Stress Reduction"],
    learningObjectives: [
      "Learn foundational breathing techniques",
      "Develop a consistent morning practice",
      "Reduce morning anxiety and stress"
    ],
    accessTier: 'free',
    isFirstEpisode: true,
    seriesId: "morning-series-1",
    episodeNumber: 1,
    hashtags: ["#Meditation", "#MorningRitual"]
  },
  {
    id: 2,
    title: "Deep Sleep Hypnosis for Anxiety Relief",
    expert: "Michael Chen",
    expertCredentials: "Clinical Hypnotherapist, LCSW",
    expertAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    duration: "45:20",
    category: "Sleep",
    rating: 4.8,
    views: "89.7k",
    thumbnail: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=250&fit=crop",
    isNew: false,
    isTrending: true,
    description: "A soothing hypnosis session designed to release anxiety and guide you into deep, restorative sleep.",
    fullDescription: "This comprehensive sleep hypnosis session combines progressive muscle relaxation, guided imagery, and therapeutic suggestions to help you release the day's stress and anxiety. Perfect for those struggling with racing thoughts at bedtime.",
    audioUrl: "/audio/sleep-hypnosis.mp3",
    relatedTopics: ["Sleep Hygiene", "Anxiety Management", "Relaxation"],
    learningObjectives: [
      "Master progressive muscle relaxation",
      "Develop healthy sleep patterns",
      "Reduce bedtime anxiety"
    ],
    accessTier: 'premium',
    isFirstEpisode: false,
    seriesId: "sleep-series-1",
    episodeNumber: 2,
    hashtags: ["#Sleep", "#Hypnosis", "#AnxietyRelief"]
  },
  {
    id: 3,
    title: "Confidence Building Affirmations",
    expert: "Dr. Emily Rodriguez",
    expertCredentials: "Life Coach, PhD in Positive Psychology",
    expertAvatar: "https://images.unsplash.com/photo-1594824388853-d0b8ccbfbb3d?w=100&h=100&fit=crop&crop=face",
    duration: "15:45",
    category: "Personal Growth",
    rating: 4.7,
    views: "34.2k",
    thumbnail: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=250&fit=crop",
    isNew: true,
    isTrending: false,
    description: "Powerful affirmations to boost self-confidence and develop unshakeable self-belief.",
    fullDescription: "Transform your inner dialogue with these scientifically-backed affirmations designed to build lasting confidence and self-esteem. Dr. Rodriguez guides you through positive self-talk techniques that rewire limiting beliefs.",
    audioUrl: "/audio/confidence-affirmations.mp3",
    relatedTopics: ["Self-Esteem", "Positive Psychology", "Neural Rewiring"],
    learningObjectives: [
      "Develop positive self-talk patterns",
      "Build unshakeable confidence",
      "Overcome limiting beliefs"
    ],
    accessTier: 'free',
    isFirstEpisode: true,
    hashtags: ["#Confidence", "#Affirmations", "#SelfEsteem"]
  },
  {
    id: 4,
    title: "Stress Release Body Scan Meditation",
    expert: "Dr. James Park",
    expertCredentials: "Meditation Teacher, Neuroscience PhD",
    expertAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    duration: "20:15",
    category: "Stress Management",
    rating: 4.8,
    views: "67.8k",
    thumbnail: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=250&fit=crop",
    isNew: false,
    isTrending: true,
    description: "A comprehensive body scan meditation to release physical tension and mental stress.",
    fullDescription: "This guided body scan meditation helps you identify and release stored tension throughout your body. Dr. Park combines mindfulness techniques with neuroscience insights to create a deeply relaxing experience.",
    audioUrl: "/audio/body-scan-meditation.mp3",
    relatedTopics: ["Body Awareness", "Tension Release", "Mindfulness"],
    learningObjectives: [
      "Develop body awareness",
      "Learn tension release techniques",
      "Practice mindful relaxation"
    ],
    accessTier: 'premium',
    hashtags: ["#BodyScan", "#StressRelief", "#Mindfulness"]
  },
  {
    id: 5,
    title: "Loving-Kindness Meditation for Relationships",
    expert: "Dr. Maria Garcia",
    expertCredentials: "Relationship Therapist, LMFT",
    expertAvatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face",
    duration: "18:30",
    category: "Relationships",
    rating: 4.9,
    views: "43.5k",
    thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=250&fit=crop",
    isNew: false,
    isTrending: false,
    description: "Cultivate compassion and improve relationships through loving-kindness meditation practice.",
    fullDescription: "This beautiful loving-kindness meditation helps you develop deeper compassion for yourself and others. Learn to extend love and forgiveness, heal relationship wounds, and create more harmonious connections.",
    audioUrl: "/audio/loving-kindness.mp3",
    relatedTopics: ["Compassion", "Forgiveness", "Heart-Centered Practice"],
    learningObjectives: [
      "Cultivate self-compassion",
      "Improve relationship dynamics",
      "Practice forgiveness techniques"
    ],
    accessTier: 'free',
    hashtags: ["#LovingKindness", "#Compassion", "#Relationships"]
  }
];

const AudioBrowsePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { navigateToUpgrade, trackNavigationEvent } = useNavigationTracking();

  // State
  const [allAudio, setAllAudio] = useState<AudioContent[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<AudioContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load audio content
  useEffect(() => {
    const loadAudioContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API call - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAllAudio(mockAudioContent);
      } catch (err) {
        console.error('Failed to load audio content:', err);
        setError('Failed to load audio content. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadAudioContent();
  }, []);

  // Event handlers
  const handleUpgrade = (audio: AudioContent) => {
    navigateToUpgrade({
      source: 'audio_page',
      videoId: audio.id,
      videoTitle: audio.title,
      seriesId: audio.seriesId,
      episodeNumber: audio.episodeNumber
    });
  };

  const handlePlay = (audio: AudioContent) => {
    trackNavigationEvent('Audio Play', {
      videoId: audio.id.toString(),
      source: 'audio_page'
    });
    setSelectedAudio(audio);
  };

  const handleCloseModal = () => {
    setSelectedAudio(null);
  };

  // Data organization
  const featuredAudio = allAudio.find(a => a.isTrending) || allAudio[0] || null;
  const trendingAudio = allAudio.filter(a => a.isTrending);
  const newAudio = allAudio.filter(a => a.isNew);
  const freeAudio = allAudio.filter(a => a.accessTier === 'free');
  const premiumAudio = allAudio.filter(a => a.accessTier === 'premium');
  const meditationAudio = allAudio.filter(a => a.category === 'Mindfulness');
  const sleepAudio = allAudio.filter(a => a.category === 'Sleep');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <AudioHeroSection 
        featuredAudio={featuredAudio} 
        loading={loading}
        onPlay={handlePlay}
      />

      <main className="flex-1 container mx-auto py-10">
        {error && (
          <div className="text-center text-red-600 mb-6">
            <AlertCircle className="w-5 h-5 inline-block mr-2" />
            {error}
          </div>
        )}

        <AudioRow
          title="Trending Now"
          audioList={trendingAudio}
          loading={loading}
          onPlay={handlePlay}
          onUpgrade={handleUpgrade}
        />

        <AudioRow
          title="New Releases"
          audioList={newAudio}
          loading={loading}
          onPlay={handlePlay}
          onUpgrade={handleUpgrade}
        />

        <AudioRow
          title="Meditation & Mindfulness"
          audioList={meditationAudio}
          loading={loading}
          onPlay={handlePlay}
          onUpgrade={handleUpgrade}
        />

        <AudioRow
          title="Sleep & Relaxation"
          audioList={sleepAudio}
          loading={loading}
          onPlay={handlePlay}
          onUpgrade={handleUpgrade}
        />

        <AudioRow
          title="Free to Listen"
          audioList={freeAudio}
          loading={loading}
          onPlay={handlePlay}
          onUpgrade={handleUpgrade}
        />

        <AudioRow
          title="Premium Exclusives"
          audioList={premiumAudio}
          loading={loading}
          onPlay={handlePlay}
          onUpgrade={handleUpgrade}
        />
      </main>

      <Footer />

      {/* Audio Modal */}
      {selectedAudio && (
        <AudioModal 
          audio={selectedAudio}
          open={!!selectedAudio}
          onOpenChange={handleCloseModal}
        />
      )}
    </div>
  );
};

export default AudioBrowsePage;