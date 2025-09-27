// src/components/Audio/AudioCard.tsx
import { memo } from "react";
import { 
  Play, Clock, User, Star, TrendingUp, Crown, Headphones, Volume2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useVideoAccess } from '@/hooks/useVideoAccess';

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
}

interface AudioCardProps {
  audio: AudioContent;
  onPlay: (audio: AudioContent) => void;
  onUpgrade: (audio: AudioContent) => void;
}

const AudioCard = memo(({ audio, onPlay, onUpgrade }: AudioCardProps) => {
  const { canWatchVideo } = useVideoAccess();
  
  const canListen = canWatchVideo(audio, []);
  const isLocked = !canListen;

  return (
    <Card className="cursor-pointer group overflow-hidden hover:shadow-md transition-all duration-200 w-72 h-80">
      <div className="relative">
        <img
          src={audio.thumbnail}
          alt={audio.title}
          className="w-full h-40 object-cover"
        />
        
        {/* Audio visualization overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20">
          {/* Audio indicator */}
          <div className="absolute top-3 left-3">
            <div className="bg-purple-600/80 backdrop-blur-sm rounded-full p-2">
              <Headphones className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        
        {/* Play Overlay */}
        <div 
          onClick={() => onPlay(audio)}
          className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor