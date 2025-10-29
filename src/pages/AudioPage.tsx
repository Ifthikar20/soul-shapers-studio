// src/pages/AudioPage.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Play,
  Clock,
  User,
  Crown,
  TrendingUp,
  Headphones,
  Volume2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

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

// Audio Card Component
const AudioCard = ({ audio, onPlay, onUpgrade }: {
  audio: AudioContent;
  onPlay: (audio: AudioContent) => void;
  onUpgrade: (audio: AudioContent) => void;
}) => {
  const navigate = useNavigate();
  const canListen = audio.accessTier === 'free' || audio.isFirstEpisode;

  const handleCardClick = () => {
    if (canListen) {
      navigate(`/audio/${audio.id}`);
    } else {
      onUpgrade(audio);
    }
  };

  return (
    <Card className="cursor-pointer group overflow-hidden hover:shadow-md transition-all duration-200" onClick={handleCardClick}>
      <div className="relative">
        <img
          src={audio.thumbnail}
          alt={audio.title}
          className="w-full h-40 object-contain bg-white"
        />

        {/* Play Overlay on Hover */}
        <div
          className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
        >
          <div className="rounded-full p-2 bg-white/90 shadow-lg">
            {canListen ? (
              <Play className="w-6 h-6 text-purple-600 fill-current" />
            ) : (
              <Crown className="w-6 h-6 text-orange-500" />
            )}
          </div>
        </div>
        
        {/* Single Badge - Priority: Premium > New > Trending */}
        <div className="absolute top-2 right-2">
          {audio.accessTier === 'premium' && !audio.isFirstEpisode ? (
            <Badge className="bg-orange-500 text-white text-xs px-2 py-0.5">
              <Crown className="w-2.5 h-2.5 mr-0.5" />
              Premium
            </Badge>
          ) : audio.isNew ? (
            <Badge className="bg-green-500 text-white text-xs px-2 py-0.5">
              New
            </Badge>
          ) : audio.isTrending ? (
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
              Hot
            </Badge>
          ) : null}
        </div>
        
        {/* Duration */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-0.5 rounded text-xs flex items-center">
          <Volume2 className="w-2.5 h-2.5 mr-1" />
          {audio.duration}
        </div>
      </div>
      
      <CardContent className="p-4">
        {/* Category */}
        <Badge variant="outline" className="text-xs mb-2 w-fit">
          {audio.category}
        </Badge>
        
        {/* Title */}
        <h3 className="font-semibold text-base text-foreground mb-2 line-clamp-2 leading-tight">
          {audio.title}
        </h3>
        
        {/* Expert */}
        <div className="flex items-center text-muted-foreground text-sm mb-3">
          <User className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{audio.expert}</span>
        </div>

        {/* Stats and Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <span>{audio.listens} listens</span>
          </div>

          {!canListen ? (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onUpgrade(audio);
              }}
              className="text-orange-600 border-orange-200 hover:bg-orange-50 text-sm px-3 py-1.5 h-8 flex-shrink-0"
            >
              Upgrade
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/audio/${audio.id}`);
              }}
              className="text-purple-600 hover:bg-purple-50 text-sm px-3 py-1.5 h-8 flex-shrink-0"
            >
              Listen
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Audio Page Component
const AudioPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 12;
  const categories = ['All', 'Meditation', 'Sleep', 'Breathwork', 'Self-Care', 'Focus', 'Self-Esteem'];

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

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

  // Filter audio content by category only
  const filteredAudio = audioContent.filter(audio => {
    return selectedCategory === 'All' || audio.category === selectedCategory;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredAudio.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentAudio = filteredAudio.slice(startIndex, endIndex);

  // Page navigation handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
            <Headphones className="w-6 h-6" />
            <span className="font-semibold">Audio Wellness Library</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Guided Audio Sessions
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Expert-led meditation, sleep stories, and wellness practices to support your mental health journey.
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="container mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap px-6 py-2 rounded-full transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-purple-600">{startIndex + 1}-{Math.min(endIndex, filteredAudio.length)}</span> of <span className="font-semibold text-purple-600">{filteredAudio.length}</span> audio session{filteredAudio.length !== 1 ? 's' : ''}
            {selectedCategory !== 'All' && <span> in <span className="font-semibold">{selectedCategory}</span></span>}
          </p>
        </div>

        {/* Audio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {currentAudio.map((audio) => (
            <AudioCard
              key={audio.id}
              audio={audio}
              onPlay={handlePlay}
              onUpgrade={handleUpgrade}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredAudio.length === 0 && (
          <div className="text-center py-12">
            <Headphones className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No audio sessions found</h3>
            <p className="text-gray-500">Try selecting a different category.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center gap-4 mt-12 mb-8">
            {/* Page info */}
            <p className="text-sm text-gray-600">
              Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
            </p>

            {/* Pagination buttons */}
            <div className="flex items-center gap-2">
              {/* Previous button */}
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="px-3"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {/* Page numbers */}
              <div className="flex gap-1">
                {getPageNumbers().map((page, index) => (
                  <React.Fragment key={index}>
                    {page === '...' ? (
                      <span className="px-3 py-2 text-gray-400">...</span>
                    ) : (
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(page as number)}
                        className={`min-w-[40px] ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                            : ''
                        }`}
                      >
                        {page}
                      </Button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Next button */}
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-3"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AudioPage;