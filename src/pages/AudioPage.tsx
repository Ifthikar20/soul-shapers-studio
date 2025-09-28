// src/pages/AudioPage.tsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { 
  Play, 
  Clock, 
  User, 
  Crown, 
  TrendingUp, 
  Headphones,
  Volume2,
  X,
  ChevronRight,
  Pause,
  SkipBack,
  SkipForward,
  Filter,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';

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

// Extended mock audio data for a full page
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
    category: "Healing",
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
    category: "Gratitude",
    listens: "18.9k",
    thumbnail: plant11,
    isNew: false,
    isTrending: true,
    description: "Cultivate appreciation and shift your mindset toward abundance and joy.",
    fullDescription: "Research-based gratitude practices to enhance life satisfaction and emotional well-being.",
    audioUrl: "#",
    accessTier: 'free'
  }
];

// Audio Card Component
const AudioCard = ({ audio, onPlay, onUpgrade }: {
  audio: AudioContent;
  onPlay: (audio: AudioContent) => void;
  onUpgrade: (audio: AudioContent) => void;
}) => {
  const canListen = audio.accessTier === 'free' || audio.isFirstEpisode;

  return (
    <Card className="cursor-pointer group overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="relative">
        <img
          src={audio.thumbnail}
          alt={audio.title}
          className="w-full h-40 object-contain bg-white"
        />
       
        {/* Play Overlay on Hover */}
        <div 
          onClick={() => onPlay(audio)}
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
              onClick={() => onUpgrade(audio)}
              className="text-orange-600 border-orange-200 hover:bg-orange-50 text-sm px-3 py-1.5 h-8 flex-shrink-0"
            >
              Upgrade
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onPlay(audio)}
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

// Audio Information Modal - Shows details about the audio content
const AudioPlayerModal = ({ audio, open, onOpenChange }: {
  audio: AudioContent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const navigate = useNavigate();

  if (!audio) return null;

  const handleOpenFullPlayer = () => {
    // Navigate to the full audio player page
    navigate(`/audio/${audio.id}`);
    onOpenChange(false);
  };

  // Define who benefits from each audio type
  const getBenefits = (category: string) => {
    switch (category) {
      case 'Meditation':
        return ['People with anxiety', 'Stress management seekers', 'Mindfulness beginners'];
      case 'Sleep':
        return ['Insomnia sufferers', 'Restless sleepers', 'Night anxiety experiences'];
      case 'Breathwork':
        return ['Panic attack management', 'Stress relief seekers', 'Focus improvement'];
      case 'Self-Care':
        return ['Low self-esteem', 'Self-criticism issues', 'Confidence building'];
      case 'Focus':
        return ['ADHD management', 'Concentration issues', 'Productivity improvement'];
      case 'Self-Esteem':
        return ['Confidence building', 'Self-worth issues', 'Personal empowerment'];
      default:
        return ['General wellness', 'Mental health support', 'Personal growth'];
    }
  };

  const getKeyFeatures = (category: string) => {
    switch (category) {
      case 'Meditation':
        return ['Guided breathing', 'Body awareness', 'Mindful observation'];
      case 'Sleep':
        return ['Progressive relaxation', 'Calming narratives', 'Sleep induction'];
      case 'Breathwork':
        return ['4-7-8 breathing', 'Box breathing', 'Calming techniques'];
      case 'Self-Care':
        return ['Self-compassion', 'Positive affirmations', 'Inner kindness'];
      case 'Focus':
        return ['Attention training', 'Mental clarity', 'Concentration techniques'];
      case 'Self-Esteem':
        return ['Confidence building', 'Self-worth affirmations', 'Personal power'];
      default:
        return ['Expert guidance', 'Evidence-based', 'Practical techniques'];
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 border-0 bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          
          {/* Audio Header */}
          <div className="p-6 text-center border-b border-gray-100">
            <div className="mb-4">
              <img 
                src={audio.thumbnail} 
                alt={audio.title}
                className="w-24 h-24 rounded-2xl mx-auto object-contain bg-white shadow-lg"
              />
            </div>
            
            <h2 className="text-lg font-semibold mb-1 leading-tight">{audio.title}</h2>
            <p className="text-muted-foreground text-sm mb-2">{audio.expert}</p>
            <p className="text-xs text-muted-foreground">{audio.expertCredentials}</p>
            
            <div className="flex justify-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {audio.duration}
              </span>
              <span>{audio.listens} listens</span>
            </div>
          </div>
          
          {/* Audio Information */}
          <div className="p-6 space-y-4">
            {/* Description */}
            <div>
              <h3 className="font-medium text-sm mb-2">What You'll Experience</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {audio.fullDescription}
              </p>
            </div>

            {/* Who Benefits */}
            <div>
              <h3 className="font-medium text-sm mb-2">Perfect For</h3>
              <div className="space-y-1">
                {getBenefits(audio.category).map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            {/* Key Features */}
            <div>
              <h3 className="font-medium text-sm mb-2">What's Included</h3>
              <div className="space-y-1">
                {getKeyFeatures(audio.category).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Access Level */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Access Level</span>
                <Badge 
                  className={audio.accessTier === 'free' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}
                >
                  {audio.accessTier === 'free' ? 'Free' : 'Premium'}
                </Badge>
              </div>
            </div>

            {/* Action Button */}
            <Button 
              onClick={handleOpenFullPlayer}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg h-12"
            >
              <Headphones className="w-4 h-4 mr-2" />
              Start Listening
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main Audio Page Component
const AudioPage = () => {
  const [selectedAudio, setSelectedAudio] = useState<AudioContent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Meditation', 'Sleep', 'Breathwork', 'Self-Care', 'Focus', 'Self-Esteem'];

  const handlePlay = useCallback((audio: AudioContent) => {
    const canListen = audio.accessTier === 'free' || audio.isFirstEpisode;
    
    if (canListen) {
      setSelectedAudio(audio);
    } else {
      handleUpgrade(audio);
    }
  }, []);

  const handleUpgrade = useCallback((audio: AudioContent) => {
    console.log('Navigate to upgrade for audio:', audio.id);
    // Navigate to upgrade page
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedAudio(null);
  }, []);

  // Filter audio content
  const filteredAudio = audioContent.filter(audio => {
    const matchesSearch = audio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         audio.expert.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || audio.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

      {/* Filters and Search */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search audio sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Audio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAudio.map((audio) => (
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
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Audio Player Modal */}
      <AudioPlayerModal
        audio={selectedAudio}
        open={!!selectedAudio}
        onOpenChange={handleModalClose}
      />

      <Footer />
    </div>
  );
};

export default AudioPage;