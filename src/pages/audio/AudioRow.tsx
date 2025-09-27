// src/components/Audio/AudioRow.tsx
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AudioCard from './AudioCard';
import AudioCardSkeleton from './AudioCardSkeleton';

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

interface AudioRowProps {
  title: string;
  audioList: AudioContent[];
  loading: boolean;
  onPlay: (audio: AudioContent) => void;
  onUpgrade: (audio: AudioContent) => void;
}

const AudioRow = ({ title, audioList, loading, onPlay, onUpgrade }: AudioRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      const newScrollLeft = direction === 'left'
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons();
      return () => scrollElement.removeEventListener('scroll', updateScrollButtons);
    }
  }, [audioList]);

  if (audioList.length === 0 && !loading) return null;

  return (
    <div className="relative group/row mb-10">
      <h2 className="text-xl font-bold text-gray-900 mb-6 px-6">{title}</h2>

      <div className="relative">
        {/* Scroll buttons */}
        {canScrollLeft && !loading && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        )}

        {canScrollRight && !loading && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-6 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {loading ? (
            // Loading skeletons
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex-none w-72">
                <AudioCardSkeleton />
              </div>
            ))
          ) : (
            // Actual content
            audioList.map((audio) => (
              <div key={audio.id} className="flex-none w-72">
                <AudioCard
                  audio={audio}
                  onPlay={onPlay}
                  onUpgrade={onUpgrade}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioRow;