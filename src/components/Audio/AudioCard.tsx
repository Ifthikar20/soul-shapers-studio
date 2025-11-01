// src/components/Audio/AudioCard.tsx - Netflix-style horizontal card
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Crown,
  TrendingUp,
  Volume2,
  Info
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
      className="cursor-pointer group overflow-hidden border-0 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:z-10"
      onClick={handleCardClick}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-purple-900 to-indigo-900">
        {/* Main Image */}
        <img
          src={audio.thumbnail}
          alt={audio.title}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Gradient Overlay - Always visible at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

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

        {/* Audio indicator badge */}
        <div className="absolute top-2 right-2 z-10">
          {canListen && (
            <Badge className="bg-purple-600/90 text-white text-[10px] px-1.5 py-0.5 font-semibold flex items-center gap-1">
              <Volume2 className="w-2.5 h-2.5" />
            </Badge>
          )}
        </div>

        {/* Center Play Button - Appears on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="rounded-full p-4 bg-white/95 shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
            {canListen ? (
              <Play className="w-6 h-6 text-purple-600 fill-current" />
            ) : (
              <Crown className="w-6 h-6 text-orange-500" />
            )}
          </div>
        </div>

        {/* Bottom Info - Slides up slightly on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
          <div className="space-y-1.5">
            {/* Title */}
            <h3 className="font-bold text-white text-sm line-clamp-1 drop-shadow-lg">
              {audio.title}
            </h3>

            {/* Info Row - Only visible on hover */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-1.5 text-xs text-white/90">
                <Volume2 className="w-3 h-3 text-purple-400" />
                <span className="font-medium">{audio.duration}</span>
              </div>
              <span className="text-white/60 text-xs">•</span>
              <span className="text-white/90 text-xs">{audio.listens}</span>
            </div>

            {/* Category & Expert - Only visible on hover */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-white/40 text-white bg-white/10">
                {audio.category}
              </Badge>
              <span className="text-white/80 text-xs truncate">{audio.expert}</span>
            </div>
          </div>
        </div>

        {/* Info Button - Bottom Right on Hover */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="rounded-full p-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/40 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/audio/${audio.id}`);
            }}
          >
            <Info className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default AudioCard;
