// src/pages/AudioBrowsePage.tsx - Meditation-style Audio Browse Page
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { contentService } from '@/services/content.service';
import { Play, Loader2, AlertCircle, RefreshCw, Bookmark, Target } from 'lucide-react';

// Import images
import plant1 from '@/assets/plant1.png';
import plant4 from '@/assets/plant4.png';
import plant5 from '@/assets/plant5.png';
import plant7 from '@/assets/plant7.png';
import plant8 from '@/assets/plant8.png';
import plant9 from '@/assets/plant9.png';
import plant10 from '@/assets/plant10.png';
import plant11 from '@/assets/plant11.png';
import lotusPl from '@/assets/lotus-plant-2.png';
import collectionPlant from '@/assets/collection-plant.png';
import audioPage1 from '@/assets/audio-page-1.png';
import audioPage2 from '@/assets/audio-page-2.png';
import morningBliss from '@/assets/morningbliss.png';

interface AudioContentItem {
  id: string;
  title: string;
  description: string;
  expert_name: string;
  duration_seconds: number;
  category_name: string;
  thumbnail_url?: string;
  access_tier: 'free' | 'premium';
  view_count?: number;
}

const plantImages = [
  plant1,
  plant4,
  plant5,
  plant7,
  plant8,
  plant9,
  plant10,
  plant11,
];

const gradients = [
  'from-gray-600 to-gray-700',
  'from-gray-700 to-gray-800',
  'from-gray-500 to-gray-600',
  'from-gray-600 to-gray-800',
  'from-gray-700 to-gray-900',
  'from-gray-500 to-gray-700',
  'from-gray-600 to-gray-700',
  'from-gray-700 to-gray-800',
];

const AudioBrowsePage = () => {
  const navigate = useNavigate();
  const [audioContent, setAudioContent] = useState<AudioContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<string>('all');

  const loadAudioContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const content = await contentService.getAudioContent();

      if (content.length === 0) {
        setError('No audio content found in database. Please add audio content with UUIDs.');
      } else {
        setAudioContent(content as any);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load audio content from backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAudioContent();
  }, []);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  const filterByDuration = (audio: AudioContentItem[]): AudioContentItem[] => {
    switch (timeFilter) {
      case 'under5':
        return audio.filter(a => a.duration_seconds < 300);
      case 'under10':
        return audio.filter(a => a.duration_seconds < 600);
      case 'under20':
        return audio.filter(a => a.duration_seconds < 1200);
      case 'over20':
        return audio.filter(a => a.duration_seconds >= 1200);
      default:
        return audio;
    }
  };

  const handlePlayAudio = (audioId: string) => {
    navigate(`/audio/${audioId}`);
  };

  const featuredAudio = filterByDuration(audioContent).slice(0, 4);
  const popularAudio = audioContent.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-black">
      <Header />

      <div className="max-w-7xl mx-auto px-5 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-gray-600 dark:text-gray-400 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading audio content...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl p-10 shadow-2xl">
            <div className="flex items-start gap-4 mb-6">
              <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">Unable to Load Audio Content</h3>
                <p className="text-gray-300 mb-6">{error}</p>
                <div className="flex gap-3">
                  <button
                    onClick={loadAudioContent}
                    className="px-6 py-3 bg-white text-gray-900 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-gray-600 text-white rounded-full font-bold hover:bg-gray-500 transition-colors"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && audioContent.length > 0 && (
          <>
            {/* Audio of the Day Section */}
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-800 dark:to-black rounded-3xl p-10 mb-10 shadow-2xl">
              <h2 className="text-white text-3xl font-bold mb-8">Audio of the day</h2>

              {/* Time Filters */}
              <div className="flex flex-wrap gap-8 mb-6">
                {[
                  { key: 'all', label: 'All Durations', icon: '⏱' },
                  { key: 'under5', label: 'Under 5 mins', icon: '⏱' },
                  { key: 'under10', label: 'Under 10 mins', icon: '⏱' },
                  { key: 'under20', label: 'Under 20 mins', icon: '⏱' },
                  { key: 'over20', label: 'Over 20 mins', icon: '⏱' },
                ].map((filter) => (
                  <div
                    key={filter.key}
                    onClick={() => setTimeFilter(filter.key)}
                    className={`flex items-center gap-2 text-sm cursor-pointer transition-colors ${
                      timeFilter === filter.key
                        ? 'text-white font-semibold'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <span className="text-base">{filter.icon}</span>
                    {filter.label}
                  </div>
                ))}
              </div>

              {/* Featured Audio Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {featuredAudio.map((audio, index) => (
                  <div
                    key={audio.id}
                    onClick={() => handlePlayAudio(audio.id)}
                    className={`bg-gradient-to-br ${gradients[index % gradients.length]} rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl relative h-52`}
                  >
                    {/* Plant Background Image */}
                    <div className="absolute inset-0 opacity-20 dark:opacity-15 pointer-events-none">
                      <img
                        src={plantImages[index % plantImages.length]}
                        alt=""
                        className="w-full h-full object-cover mix-blend-overlay dark:mix-blend-soft-light"
                      />
                    </div>

                    <div className="p-5 h-full flex flex-col justify-between relative z-10">
                      {/* Duration Badge */}
                      <span className="absolute top-3 right-3 bg-black/50 text-white px-3 py-1 rounded-xl text-xs font-semibold backdrop-blur-sm">
                        {formatDuration(audio.duration_seconds)}
                      </span>

                      {/* Premium Badge */}
                      {audio.access_tier === 'premium' && (
                        <span className="absolute top-3 left-3 bg-amber-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                          PRO
                        </span>
                      )}

                      {/* Title and Author */}
                      <div className="mt-auto">
                        <h3 className="text-white text-xl font-bold leading-tight mb-1 drop-shadow-lg">
                          {audio.title}
                        </h3>
                        <p className="text-white/90 text-sm drop-shadow-md">{audio.expert_name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {featuredAudio.length === 0 && (
                <div className="text-white/70 text-center py-10">
                  No audio found for this duration filter
                </div>
              )}
            </div>

            {/* Favorites Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-10 shadow-lg">
              <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">Favorites</h2>
              <div className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bookmark className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="text-gray-900 dark:text-white text-base font-bold mb-1">Nothing to show here yet!</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Start exploring our content and save your favorites for later.
                  </p>
                </div>
              </div>
            </div>

            {/* Popular Now Section */}
            <div className="mb-10">
              <div className="mb-6">
                <h2 className="text-gray-900 dark:text-white text-3xl font-bold">Popular now</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularAudio.map((audio, index) => (
                  <div
                    key={audio.id}
                    onClick={() => handlePlayAudio(audio.id)}
                    className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700"
                  >
                    {/* Card Image with Plant */}
                    <div
                      className={`w-full h-48 bg-gradient-to-br ${
                        gradients[(index + 4) % gradients.length]
                      } flex items-center justify-center relative overflow-hidden`}
                    >
                      <img
                        src={plantImages[(index + 3) % plantImages.length]}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-30 dark:opacity-20 mix-blend-overlay dark:mix-blend-soft-light"
                      />
                      <div className="relative z-10 flex flex-col items-center">
                        <Play className="w-16 h-16 text-white/80 mb-2" />
                        <span className="text-white text-2xl font-bold drop-shadow-lg">
                          {audio.category_name || 'Audio'}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-2 line-clamp-2">
                        {audio.title}
                      </h3>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">{audio.expert_name}</span>
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm">
                          <span className="text-base">👥</span>
                          {audio.view_count?.toLocaleString() || '0'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Debug Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 mt-10">
              <h3 className="text-blue-900 dark:text-blue-300 text-lg font-semibold mb-3 flex items-center gap-2">
                <span>ℹ️</span>
                How Audio Streaming Works
              </h3>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li>• Content is fetched from your backend database with UUIDs</li>
                <li>• Click any audio card to start streaming</li>
                <li>
                  • Streaming uses: <code className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded font-mono text-xs">/api/streaming/content/{'{UUID}'}/stream</code>
                </li>
                <li>• Total audio items: <strong>{audioContent.length}</strong></li>
              </ul>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AudioBrowsePage;
