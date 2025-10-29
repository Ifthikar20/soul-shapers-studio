// src/pages/AudioPage.tsx - Carousel Layout with Category Sections
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AudioRow from '@/components/Audio/AudioRow';
import { Headphones, Sparkles } from 'lucide-react';

// Audio content interface
interface AudioContent {
  id: number;
  title: string;
  expert: string;
  expertCredentials: string;
  expertAvatar: string;
  duration: string;
  category: string;
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

// Plant images for thumbnails
import plant4 from "@/assets/plant4.png";
import plant5 from "@/assets/plant5.png";
import plant7 from "@/assets/plant7.png";
import plant8 from "@/assets/plant8.png";
import plant9 from "@/assets/plant9.png";
import plant10 from "@/assets/plant10.png";
import plant11 from "@/assets/plant11.png";

// Extended mock audio data - 28 items total
const audioContent: AudioContent[] = [
  {
    id: 1,
    title: "Morning Meditation for Anxiety Relief",
    expert: "Dr. Sarah Johnson",
    expertCredentials: "Clinical Psychologist, PhD",
    expertAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
    duration: "12:30",
    category: "Meditation",
    listens: "25.3k",
    thumbnail: plant4,
    isNew: true,
    isTrending: true,
    description: "Start your day with calm and clarity through this guided anxiety relief meditation.",
    fullDescription: "A gentle morning meditation designed to help you release anxiety and set positive intentions for the day ahead.",
    audioUrl: "#",
    accessTier: 'free',
    isFirstEpisode: true
  },
  {
    id: 2,
    title: "Deep Sleep Stories for Adults",
    expert: "Dr. Emily Chen",
    expertCredentials: "Sleep Specialist, MD",
    expertAvatar: "https://images.unsplash.com/photo-1594824388853-d0b8ccbfbb3d?w=100&h=100&fit=crop&crop=face",
    duration: "25:45",
    category: "Sleep",
    listens: "18.7k",
    thumbnail: plant5,
    isNew: false,
    isTrending: true,
    description: "Calming bedtime stories designed to help adults drift into peaceful sleep.",
    fullDescription: "Professionally crafted sleep stories that guide your mind into relaxation and prepare you for restorative sleep.",
    audioUrl: "#",
    accessTier: 'premium'
  },
  {
    id: 3,
    title: "Breathing Techniques for Stress",
    expert: "Dr. Michael Park",
    expertCredentials: "Mindfulness Coach",
    expertAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    duration: "8:15",
    category: "Breathwork",
    listens: "12.4k",
    thumbnail: plant5,
    isNew: true,
    isTrending: false,
    description: "Learn powerful breathing techniques to manage stress in real-time.",
    fullDescription: "Master evidence-based breathing methods that you can use anywhere to quickly reduce stress and anxiety.",
    audioUrl: "#",
    accessTier: 'free'
  },
  {
    id: 4,
    title: "Self-Compassion Practice",
    expert: "Dr. Lisa Rodriguez",
    expertCredentials: "Licensed Therapist, LMFT",
    expertAvatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face",
    duration: "15:20",
    category: "Self-Care",
    listens: "22.1k",
    thumbnail: plant7,
    isNew: false,
    isTrending: false,
    description: "Cultivate kindness toward yourself with this guided self-compassion practice.",
    fullDescription: "Learn to treat yourself with the same kindness you would offer a good friend through this transformative practice.",
    audioUrl: "#",
    accessTier: 'premium'
  },
  {
    id: 5,
    title: "Focus & Concentration Boost",
    expert: "Dr. James Park",
    expertCredentials: "Cognitive Specialist",
    expertAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    duration: "18:45",
    category: "Focus",
    listens: "15.2k",
    thumbnail: plant8,
    isNew: true,
    isTrending: false,
    description: "Enhance your focus and mental clarity with targeted mindfulness techniques.",
    fullDescription: "Scientifically-backed exercises to improve concentration and cognitive performance.",
    audioUrl: "#",
    accessTier: 'free'
  },
  {
    id: 6,
    title: "Confidence Building Affirmations",
    expert: "Dr. Maria Santos",
    expertCredentials: "Life Coach, PhD Psychology",
    expertAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    duration: "14:30",
    category: "Self-Esteem",
    listens: "19.8k",
    thumbnail: plant9,
    isNew: false,
    isTrending: true,
    description: "Build unshakeable confidence with powerful affirmations and visualization.",
    fullDescription: "Transform your self-perception and boost confidence through guided affirmation practices.",
    audioUrl: "#",
    accessTier: 'premium'
  },
  {
    id: 7,
    title: "Emotional Release & Healing",
    expert: "Dr. Rachel Kim",
    expertCredentials: "Trauma Specialist, EMDR Certified",
    expertAvatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop&crop=face",
    duration: "22:15",
    category: "Meditation",
    listens: "14.2k",
    thumbnail: plant10,
    isNew: true,
    isTrending: false,
    description: "Gentle guidance for processing and releasing stored emotional tension.",
    fullDescription: "A safe space to explore and release emotional blocks through mindful awareness and compassionate self-inquiry.",
    audioUrl: "#",
    accessTier: 'premium'
  },
  {
    id: 8,
    title: "Gratitude & Appreciation Practice",
    expert: "Dr. Ahmed Hassan",
    expertCredentials: "Positive Psychology Expert, PhD",
    expertAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    duration: "16:45",
    category: "Meditation",
    listens: "18.9k",
    thumbnail: plant11,
    isNew: false,
    isTrending: true,
    description: "Cultivate appreciation and shift your mindset toward abundance and joy.",
    fullDescription: "Research-based gratitude practices to enhance life satisfaction and emotional well-being.",
    audioUrl: "#",
    accessTier: 'free'
  },
  {
    id: 9,
    title: "Evening Wind-Down Meditation",
    expert: "Dr. Jennifer Lee",
    expertCredentials: "Meditation Instructor",
    expertAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
    duration: "20:15",
    category: "Meditation",
    listens: "31.2k",
    thumbnail: plant4,
    isNew: true,
    isTrending: true,
    description: "Release the day's tension and prepare for restful sleep.",
    fullDescription: "A calming evening meditation to help you transition from day to night.",
    audioUrl: "#",
    accessTier: 'free'
  },
  {
    id: 10,
    title: "Power Nap Guided Rest",
    expert: "Dr. Robert Wilson",
    expertCredentials: "Sleep Researcher, PhD",
    expertAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    duration: "20:00",
    category: "Sleep",
    listens: "28.5k",
    thumbnail: plant5,
    isNew: false,
    isTrending: false,
    description: "Maximize your energy with a scientifically-optimized power nap.",
    fullDescription: "Perfect 20-minute guided rest for midday rejuvenation.",
    audioUrl: "#",
    accessTier: 'premium'
  },
  {
    id: 11,
    title: "Box Breathing for Athletes",
    expert: "Coach Marcus Thompson",
    expertCredentials: "Performance Coach",
    expertAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    duration: "10:30",
    category: "Breathwork",
    listens: "16.8k",
    thumbnail: plant7,
    isNew: true,
    isTrending: true,
    description: "Elite breathing techniques for peak performance.",
    fullDescription: "Military-grade breathing exercises adapted for athletic excellence.",
    audioUrl: "#",
    accessTier: 'free'
  },
  {
    id: 12,
    title: "Morning Self-Care Ritual",
    expert: "Dr. Sophia Martinez",
    expertCredentials: "Wellness Coach",
    expertAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    duration: "18:20",
    category: "Self-Care",
    listens: "24.6k",
    thumbnail: plant8,
    isNew: false,
    isTrending: true,
    description: "Start your day with intention and self-love.",
    fullDescription: "A comprehensive morning routine for mental and emotional wellness.",
    audioUrl: "#",
    accessTier: 'premium'
  },
  {
    id: 13,
    title: "Study Focus Enhancement",
    expert: "Dr. Kevin Huang",
    expertCredentials: "Educational Psychologist",
    expertAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    duration: "45:00",
    category: "Focus",
    listens: "21.3k",
    thumbnail: plant9,
    isNew: true,
    isTrending: false,
    description: "Extended focus session for deep work and studying.",
    fullDescription: "Scientifically designed audio to enhance learning and retention.",
    audioUrl: "#",
    accessTier: 'free'
  },
  {
    id: 14,
    title: "Inner Strength Affirmations",
    expert: "Dr. Patricia Brown",
    expertCredentials: "Motivational Psychologist",
    expertAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
    duration: "12:15",
    category: "Self-Esteem",
    listens: "27.4k",
    thumbnail: plant10,
    isNew: false,
    isTrending: true,
    description: "Cultivate resilience and inner power.",
    fullDescription: "Powerful affirmations to build mental strength and confidence.",
    audioUrl: "#",
    accessTier: 'premium'
  },
  {
    id: 15,
    title: "Body Scan Meditation",
    expert: "Dr. Thomas Anderson",
    expertCredentials: "Mindfulness Expert",
    expertAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    duration: "25:30",
    category: "Meditation",
    listens: "19.7k",
    thumbnail: plant11,
    isNew: true,
    isTrending: false,
    description: "Connect with your body through mindful awareness.",
    fullDescription: "Progressive body scan for deep relaxation and presence.",
    audioUrl: "#",
    accessTier: 'free'
  },
  {
    id: 16,
    title: "Insomnia Relief Program",
    expert: "Dr. Catherine White",
    expertCredentials: "Sleep Medicine Specialist",
    expertAvatar: "https://images.unsplash.com/photo-1594824388853-d0b8ccbfbb3d?w=100&h=100&fit=crop&crop=face",
    duration: "35:20",
    category: "Sleep",
    listens: "33.1k",
    thumbnail: plant4,
    isNew: false,
    isTrending: true,
    description: "Evidence-based techniques for overcoming insomnia.",
    fullDescription: "Comprehensive sleep therapy session for chronic sleep issues.",
    audioUrl: "#",
    accessTier: 'premium'
  },
  {
    id: 17,
    title: "Wim Hof Breathing Method",
    expert: "Coach Isabella Garcia",
    expertCredentials: "Certified Wim Hof Instructor",
    expertAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    duration: "15:45",
    category: "Breathwork",
    listens: "29.8k",
    thumbnail: plant5,
    isNew: true,
    isTrending: true,
    description: "Master the powerful Wim Hof breathing technique.",
    fullDescription: "Guided session to boost immunity and mental clarity.",
    audioUrl: "#",
    accessTier: 'free'
  },
  {
    id: 18,
    title: "Self-Love Journey",
    expert: "Dr. Michelle Turner",
    expertCredentials: "Self-Compassion Researcher",
    expertAvatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop&crop=face",
    duration: "22:40",
    category: "Self-Care",
    listens: "26.2k",
    thumbnail: plant7,
    isNew: false,
    isTrending: false,
    description: "Deep dive into unconditional self-acceptance.",
    fullDescription: "Transformative practice for developing genuine self-love.",
    audioUrl: "#",
    accessTier: 'premium'
  },
  {
    id: 19,
    title: "Creative Flow State",
    expert: "Dr. Daniel Foster",
    expertCredentials: "Creativity Coach, PhD",
    expertAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    duration: "30:00",
    category: "Focus",
    listens: "17.9k",
    thumbnail: plant8,
    isNew: true,
    isTrending: false,
    description: "Enter a state of effortless creativity.",
    fullDescription: "Unlock your creative potential with this flow-inducing audio.",
    audioUrl: "#",
    accessTier: 'free'
  },
  {
    id: 20,
    title: "Overcoming Self-Doubt",
    expert: "Dr. Rebecca Stone",
    expertCredentials: "Cognitive Behavioral Therapist",
    expertAvatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face",
    duration: "19:25",
    category: "Self-Esteem",
    listens: "23.7k",
    thumbnail: plant9,
    isNew: false,
    isTrending: true,
    description: "Break free from limiting self-beliefs.",
    fullDescription: "CBT-based techniques to overcome imposter syndrome and self-doubt.",
    audioUrl: "#",
    accessTier: 'premium'
  },
  {
    id: 21,
    title: "Loving-Kindness Meditation",
    expert: "Dr. Yuki Tanaka",
    expertCredentials: "Buddhist Psychology Expert",
    expertAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
    duration: "17:30",
    category: "Meditation",
    listens: "20.4k",
    thumbnail: plant10,
    isNew: true,
    isTrending: false,
    description: "Cultivate compassion for yourself and others.",
    fullDescription: "Traditional metta meditation for developing universal love.",
    audioUrl: "#",
    accessTier: 'free'
  },
  {
    id: 22,
    title: "Dreams & Sleep Quality",
    expert: "Dr. Oliver Bennett",
    expertCredentials: "Dream Researcher",
    expertAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    duration: "28:15",
    category: "Sleep",
    listens: "15.6k",
    thumbnail: plant11,
    isNew: false,
    isTrending: false,
    description: "Enhance your sleep quality and dream recall.",
    fullDescription: "Guided techniques for lucid dreaming and better rest.",
    audioUrl: "#",
    accessTier: 'premium'
  },
  {
    id: 23,
    title: "Pranayama for Beginners",
    expert: "Yogi Arjun Patel",
    expertCredentials: "Yoga Breathwork Master",
    expertAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    duration: "13:20",
    category: "Breathwork",
    listens: "22.8k",
    thumbnail: plant4,
    isNew: true,
    isTrending: true,
    description: "Ancient yogic breathing for modern wellness.",
    fullDescription: "Introduction to classical pranayama techniques.",
    audioUrl: "#",
    accessTier: 'free'
  },
  {
    id: 24,
    title: "Boundary Setting Practice",
    expert: "Dr. Laura Mitchell",
    expertCredentials: "Relationship Therapist",
    expertAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    duration: "21:10",
    category: "Self-Care",
    listens: "25.9k",
    thumbnail: plant5,
    isNew: false,
    isTrending: true,
    description: "Learn to set healthy boundaries with confidence.",
    fullDescription: "Essential skills for protecting your energy and wellbeing.",
    audioUrl: "#",
    accessTier: 'premium'
  },
  {
    id: 25,
    title: "Deep Work Session",
    expert: "Dr. Samuel Chen",
    expertCredentials: "Productivity Researcher",
    expertAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    duration: "60:00",
    category: "Focus",
    listens: "18.3k",
    thumbnail: plant7,
    isNew: true,
    isTrending: false,
    description: "One hour of distraction-free focus enhancement.",
    fullDescription: "Extended deep work session for maximum productivity.",
    audioUrl: "#",
    accessTier: 'free'
  },
  {
    id: 26,
    title: "Worthy & Enough",
    expert: "Dr. Natalie Cooper",
    expertCredentials: "Self-Worth Specialist",
    expertAvatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop&crop=face",
    duration: "16:55",
    category: "Self-Esteem",
    listens: "30.2k",
    thumbnail: plant8,
    isNew: false,
    isTrending: true,
    description: "Affirm your inherent worthiness.",
    fullDescription: "Powerful practice to recognize you are already enough.",
    audioUrl: "#",
    accessTier: 'premium'
  },
  {
    id: 27,
    title: "Mindful Walking Meditation",
    expert: "Dr. Grace Williams",
    expertCredentials: "Movement Meditation Teacher",
    expertAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
    duration: "14:40",
    category: "Meditation",
    listens: "19.1k",
    thumbnail: plant9,
    isNew: true,
    isTrending: false,
    description: "Bring mindfulness to your daily walks.",
    fullDescription: "Turn ordinary walking into a meditative practice.",
    audioUrl: "#",
    accessTier: 'free'
  },
  {
    id: 28,
    title: "Sleep Anxiety Relief",
    expert: "Dr. Benjamin Taylor",
    expertCredentials: "Anxiety & Sleep Specialist",
    expertAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    duration: "26:35",
    category: "Sleep",
    listens: "32.4k",
    thumbnail: plant10,
    isNew: false,
    isTrending: true,
    description: "Calm nighttime anxiety and racing thoughts.",
    fullDescription: "Specialized techniques for anxiety that interferes with sleep.",
    audioUrl: "#",
    accessTier: 'premium'
  }
];

// Main Audio Page Component
const AudioPage = () => {
  const navigate = useNavigate();

  // Group audio by category
  const audioByCategory = audioContent.reduce((acc, audio) => {
    if (!acc[audio.category]) {
      acc[audio.category] = [];
    }
    acc[audio.category].push(audio);
    return acc;
  }, {} as Record<string, AudioContent[]>);

  // Category order for display
  const categoryOrder = ['Meditation', 'Sleep', 'Breathwork', 'Self-Care', 'Focus', 'Self-Esteem'];

  const handlePlay = useCallback((audio: AudioContent) => {
    const canListen = audio.accessTier === 'free' || audio.isFirstEpisode;
    if (canListen) {
      navigate(`/audio/${audio.id}`);
    } else {
      handleUpgrade(audio);
    }
  }, [navigate]);

  const handleUpgrade = useCallback((audio: AudioContent) => {
    console.log('Navigate to upgrade for audio:', audio.id);
    navigate('/upgrade');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 text-white py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-white/20">
              <Headphones className="w-6 h-6" />
              <span className="font-semibold tracking-wide">Audio Wellness Library</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Guided Audio
              <span className="block bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                For Your Wellness
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
              Expert-led meditation, sleep stories, and wellness practices to support your mental health journey.
            </p>

            <div className="flex items-center justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-purple-100">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium">28 Sessions Available</span>
              </div>
              <div className="w-1 h-1 bg-purple-300 rounded-full"></div>
              <div className="flex items-center gap-2 text-purple-100">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium">6 Categories</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Carousel Sections */}
      <div className="container mx-auto py-12">
        {categoryOrder.map((category) => {
          const audios = audioByCategory[category] || [];
          if (audios.length === 0) return null;

          return (
            <AudioRow
              key={category}
              title={category}
              audioItems={audios}
              onPlay={handlePlay}
              onUpgrade={handleUpgrade}
            />
          );
        })}
      </div>

      <Footer />
    </div>
  );
};

export default AudioPage;
