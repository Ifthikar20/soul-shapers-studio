// src/components/Audio/AudioCard.tsx - Netflix-style card with visible info
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Crown,
  TrendingUp,
  Volume2,
  Headphones
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
      className="cursor-pointer group overflow-hidden border-0 rounded-lg transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-2xl hover:z-10 bg-card"
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-purple-900 to-indigo-900">
        <img
          src={audio.thumbnail}
          alt={audio.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5 z-10">
          {audio.isNew && (
            <Badge className="bg-green-600 text-white text-[10px] px-1.5 py-0.5 font-semibold">
              NEW
            </Badge>
          )}
          {audio.isTrending && (
            <Badge className="bg-purple-600 text-white text-[10px] px-1.5 py-0.5 font-semibold flex items-center gap-1">
              <TrendingUp className="w-2.5 h-2.5" />
              TRENDING
            </Badge>
          )}
        </div>

        {/* Premium Badge - Top Right */}
        {!canListen && (
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] px-1.5 py-0.5 font-semibold">
              <Crown className="w-2.5 h-2.5 mr-0.5" />
              PRO
            </Badge>
          </div>
        )}

        {/* Duration Badge - Always visible */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-[10px] font-medium flex items-center gap-1">
          <Volume2 className="w-2.5 h-2.5" />
          {audio.duration}
        </div>

        {/* Center Play Button - Appears on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="rounded-full p-3 bg-white/95 shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
            {canListen ? (
              <Play className="w-5 h-5 text-purple-600 fill-current" />
            ) : (
              <Crown className="w-5 h-5 text-orange-500" />
            )}
          </div>
        </div>
      </div>

      {/* Content Section - Always Visible */}
      <CardContent className="p-3 space-y-2">
        {/* Category Badge */}
        <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 border-purple-200 text-purple-700">
          {audio.category}
        </Badge>

        {/* Title - Always visible */}
        <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
          {audio.title}
        </h3>

        {/* Expert - Always visible */}
        <p className="text-xs text-muted-foreground truncate">
          {audio.expert}
        </p>

        {/* Stats - Always visible */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Headphones className="w-3 h-3 text-purple-500" />
            <span>{audio.listens}</span>
          </div>
        </div>

        {/* Description - Only visible on hover with expansion */}
        <div className="max-h-0 group-hover:max-h-20 overflow-hidden transition-all duration-300 ease-in-out">
          <p className="text-xs text-muted-foreground line-clamp-2 pt-2 border-t">
            {audio.description || `Listen to this ${audio.category.toLowerCase()} session with ${audio.expert}.`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioCard;
