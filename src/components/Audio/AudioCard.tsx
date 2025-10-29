// src/components/Audio/AudioCard.tsx
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Play,
  User,
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
      className="cursor-pointer group overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-purple-300"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={audio.thumbnail}
          alt={audio.title}
          className="w-full h-44 object-contain bg-white group-hover:scale-105 transition-transform duration-300"
        />

        {/* Play Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="rounded-full p-3 bg-white shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
            {canListen ? (
              <Play className="w-8 h-8 text-purple-600 fill-current" />
            ) : (
              <Crown className="w-8 h-8 text-orange-500" />
            )}
          </div>
        </div>

        {/* Badge - Priority: Premium > New > Trending */}
        <div className="absolute top-3 right-3">
          {audio.accessTier === 'premium' && !audio.isFirstEpisode ? (
            <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-2.5 py-1 shadow-lg">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          ) : audio.isNew ? (
            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-2.5 py-1 shadow-lg">
              New
            </Badge>
          ) : audio.isTrending ? (
            <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs px-2.5 py-1 shadow-lg">
              <TrendingUp className="w-3 h-3 mr-1" />
              Trending
            </Badge>
          ) : null}
        </div>

        {/* Duration */}
        <div className="absolute bottom-3 right-3 bg-black/80 text-white px-3 py-1 rounded-full text-xs flex items-center backdrop-blur-sm">
          <Volume2 className="w-3 h-3 mr-1" />
          {audio.duration}
        </div>
      </div>

      <CardContent className="p-4">
        {/* Category Badge */}
        <Badge variant="outline" className="text-xs mb-2 border-purple-200 text-purple-700">
          {audio.category}
        </Badge>

        {/* Title */}
        <h3 className="font-semibold text-base text-foreground mb-2 line-clamp-2 leading-tight group-hover:text-purple-600 transition-colors">
          {audio.title}
        </h3>

        {/* Expert */}
        <div className="flex items-center text-muted-foreground text-sm mb-3">
          <User className="w-4 h-4 mr-2 flex-shrink-0 text-purple-500" />
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

export default AudioCard;
