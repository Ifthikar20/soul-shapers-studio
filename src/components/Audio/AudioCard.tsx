// src/components/Audio/AudioCard.tsx - Modern image-only card with overlay
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Crown,
  TrendingUp,
  Volume2
} from 'lucide-react';

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

interface AudioCardProps {
  audio: AudioContent;
  onPlay: (audio: AudioContent) => void;
  onUpgrade: (audio: AudioContent) => void;
}

const AudioCard = ({ audio, onPlay, onUpgrade }: AudioCardProps) => {
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
    <Card
      className="cursor-pointer group overflow-hidden border-0 rounded-2xl transition-all duration-300 ease-in-out hover:scale-[1.05] hover:shadow-2xl hover:z-10 bg-transparent"
      onClick={handleCardClick}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-900">
        {/* Main Image */}
        <img
          src={audio.thumbnail}
          alt={audio.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient Overlay - Stronger for better text readability with purple tint */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/95 via-purple-900/50 to-purple-900/30 group-hover:from-purple-900/100 group-hover:via-purple-900/60 transition-all duration-300" />

        {/* Top Section - Badges */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          {audio.isNew && (
            <Badge className="bg-green-600 text-white text-[10px] px-2 py-0.5 font-semibold shadow-lg">
              NEW
            </Badge>
          )}
          {audio.isTrending && (
            <Badge className="bg-purple-600 text-white text-[10px] px-2 py-0.5 font-semibold flex items-center gap-1 shadow-lg">
              <TrendingUp className="w-3 h-3" />
              TRENDING
            </Badge>
          )}
        </div>

        {/* Premium Badge - Top Right */}
        {!canListen && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] px-2 py-0.5 font-semibold shadow-lg">
              <Crown className="w-3 h-3 mr-1" />
              PRO
            </Badge>
          </div>
        )}

        {/* Duration Badge - Top Right (when not locked) */}
        {canListen && (
          <div className="absolute top-3 right-3 bg-purple-600/90 backdrop-blur-sm text-white px-2 py-1 rounded-md text-[10px] font-medium flex items-center gap-1 shadow-lg">
            <Volume2 className="w-3 h-3" />
            {audio.duration}
          </div>
        )}

        {/* Center Play Button - Appears on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="rounded-full p-4 bg-white/95 backdrop-blur-sm shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
            {canListen ? (
              <Play className="w-6 h-6 text-purple-600 fill-current" />
            ) : (
              <Crown className="w-6 h-6 text-orange-500" />
            )}
          </div>
        </div>

        {/* Bottom Section - Title and Category Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <div className="space-y-2">
            {/* Category Badge */}
            <Badge
              variant="secondary"
              className="bg-purple-500/30 backdrop-blur-md text-white border-0 text-[10px] px-2 py-0.5 font-medium shadow-lg"
            >
              {audio.category}
            </Badge>

            {/* Title */}
            <h3 className="font-bold text-white text-base line-clamp-2 leading-tight drop-shadow-2xl">
              {audio.title}
            </h3>

            {/* Subtle info on hover */}
            <div className="flex items-center gap-2 text-white/90 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="font-medium">{audio.expert}</span>
              <span className="text-white/60">•</span>
              <span>{audio.listens}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AudioCard;
