// src/components/Audio/AudioCard.tsx - Amazon Prime-style card with hover modal
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Play,
  Crown,
  TrendingUp,
  Volume2,
  User,
  Headphones,
  ThumbsUp
} from 'lucide-react';

interface AudioContent {
  id: string; // UUID format
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
  const [isHovered, setIsHovered] = useState(false);
  const canListen = audio.accessTier === 'free' || audio.isFirstEpisode;

  const handleCardClick = () => {
    if (canListen) {
      navigate(`/audio/${audio.id}`);
    } else {
      onUpgrade(audio);
    }
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className="cursor-pointer overflow-hidden border-0 rounded-2xl transition-all duration-300 ease-in-out bg-transparent group-hover:invisible"
        onClick={handleCardClick}
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-900">
          {/* Main Image */}
          <img
            src={audio.thumbnail}
            alt={audio.title}
            className="w-full h-full object-cover"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/95 via-purple-900/50 to-purple-900/30" />

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

          {/* Premium/Duration Badge - Top Right */}
          <div className="absolute top-3 right-3 z-10">
            {!canListen ? (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] px-2 py-0.5 font-semibold shadow-lg">
                <Crown className="w-3 h-3 mr-1" />
                PRO
              </Badge>
            ) : (
              <div className="bg-purple-600/90 backdrop-blur-sm text-white px-2 py-1 rounded-md text-[10px] font-medium flex items-center gap-1 shadow-lg">
                <Volume2 className="w-3 h-3" />
                {audio.duration}
              </div>
            )}
          </div>

          {/* Bottom Section - Title, Category, Author & Listens */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <Badge
              variant="secondary"
              className="bg-purple-500/30 backdrop-blur-md text-white border-0 text-[10px] px-2 py-0.5 font-medium shadow-lg mb-2"
            >
              {audio.category}
            </Badge>
            <h3 className="font-bold text-white text-base line-clamp-2 leading-tight drop-shadow-2xl mb-2">
              {audio.title}
            </h3>
            {/* Author & Listens - Always visible */}
            <div className="flex items-center gap-2 text-white/80 text-xs">
              <span className="font-medium">{audio.expert}</span>
              <span className="text-white/50">•</span>
              <span>{audio.listens}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Amazon Prime-style Hover Modal */}
      {isHovered && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="pointer-events-auto animate-in fade-in zoom-in-95 duration-100" style={{
            width: '400px',
            maxWidth: '90vw'
          }}>
          <Card className="overflow-hidden border-0 rounded-2xl shadow-2xl bg-card">
            {/* Image Section */}
            <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-purple-900 to-indigo-900">
              <img
                src={audio.thumbnail}
                alt={audio.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-transparent to-transparent" />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="lg"
                  className="rounded-full h-14 w-14 p-0 bg-purple-600 hover:bg-purple-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick();
                  }}
                >
                  {!canListen ? (
                    <Crown className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 fill-current" />
                  )}
                </Button>
              </div>

              {/* Duration */}
              <div className="absolute bottom-3 right-3 bg-purple-600/90 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                <Volume2 className="w-3 h-3" />
                {audio.duration}
              </div>
            </div>

            {/* Expanded Info Section */}
            <div className="p-4 space-y-3 bg-card">
              {/* Title */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-sm line-clamp-2 flex-1">
                  {audio.title}
                </h3>
                {!canListen && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] px-2 py-0.5 flex-shrink-0">
                    <Crown className="w-3 h-3 mr-1" />
                    PRO
                  </Badge>
                )}
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 text-purple-500">
                  <Headphones className="w-3 h-3" />
                  <span className="font-semibold text-foreground">{audio.listens}</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-purple-200 text-purple-700">
                  {audio.category}
                </Badge>
              </div>

              {/* Expert */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="w-3 h-3" />
                <span>{audio.expert}</span>
              </div>

              {/* Description */}
              {audio.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {audio.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                {!canListen ? (
                  <Button
                    size="sm"
                    variant="default"
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpgrade(audio);
                    }}
                  >
                    <Crown className="w-3 h-3 mr-1" />
                    Upgrade to Listen
                  </Button>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="default"
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/audio/${audio.id}`);
                      }}
                    >
                      <Play className="w-3 h-3 mr-1 fill-current" />
                      Listen Now
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-purple-200 text-purple-700 hover:bg-purple-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioCard;
