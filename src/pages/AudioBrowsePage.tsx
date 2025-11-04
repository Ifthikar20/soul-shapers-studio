// src/pages/AudioBrowsePage.tsx - Meditation-style Audio Browse Page
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { contentService } from '@/services/content.service';
import { Play, Loader2, AlertCircle, RefreshCw, Bookmark, Target } from 'lucide-react';

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

const gradients = [
  'from-cyan-400 to-blue-400',
  'from-blue-900 to-blue-700',
  'from-orange-400 to-pink-400',
  'from-amber-200 to-orange-300',
  'from-purple-500 to-indigo-600',
  'from-pink-400 to-rose-500',
  'from-teal-400 to-emerald-500',
  'from-indigo-500 to-purple-600',
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <Header />

      <div className="max-w-7xl mx-auto px-5 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading audio content...</p>
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
                    className="px-6 py-3 bg-white text-purple-600 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2"
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
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl p-10 mb-10 shadow-2xl">
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
                    <div className="p-5 h-full flex flex-col justify-between relative">
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
                        <p className="text-white/90 text-sm">{audio.expert_name}</p>
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

            {/* Recommendations Section */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-10 mb-10 shadow-2xl flex flex-col md:flex-row items-center gap-10">
              <div className="flex-shrink-0 w-full md:w-80 h-52 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <Target className="w-20 h-20 text-white/30 absolute" />
                <span className="text-8xl">🎯</span>
              </div>

              <div className="flex-1">
                <h2 className="text-white text-3xl font-bold mb-4">Your growth journey awaits</h2>
                <p className="text-white/90 text-lg mb-6 leading-relaxed">
                  Go beyond browsing — get tailored recommendations based on your growth goals.
                </p>
                <button
                  onClick={() => navigate('/settings')}
                  className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                >
                  Set your goals
                </button>
              </div>
            </div>

            {/* Favorites Section */}
            <div className="bg-white rounded-3xl p-10 mb-10 shadow-lg">
              <h2 className="text-gray-900 text-3xl font-bold mb-6">Favorites</h2>
              <div className="flex items-center gap-5 p-8 bg-gray-50 rounded-2xl">
                <div className="w-14 h-14 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Bookmark className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <h3 className="text-gray-900 text-lg font-bold mb-2">Nothing to show here yet!</h3>
                  <p className="text-gray-600 text-sm">
                    Start exploring our content and save your favorites for later.
                  </p>
                </div>
              </div>
            </div>

            {/* Popular Now Section */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-gray-900 text-3xl font-bold">Popular now</h2>
                  <p className="text-gray-600 text-sm mt-2">
                    Update your profile to get personalized program recommendations.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/profile')}
                  className="text-purple-600 text-sm font-semibold hover:underline"
                >
                  Update profile
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularAudio.map((audio, index) => (
                  <div
                    key={audio.id}
                    onClick={() => handlePlayAudio(audio.id)}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  >
                    {/* Card Image */}
                    <div
                      className={`w-full h-48 bg-gradient-to-br ${
                        gradients[(index + 4) % gradients.length]
                      } flex items-center justify-center relative`}
                    >
                      <Play className="w-12 h-12 text-white/30 absolute" />
                      <span className="text-white text-6xl font-bold drop-shadow-lg">
                        {audio.category_name?.substring(0, 1) || '🎵'}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      <h3 className="text-gray-900 text-lg font-bold mb-2 line-clamp-1">
                        {audio.title}
                      </h3>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">{audio.expert_name}</span>
                        <div className="flex items-center gap-1 text-gray-600 text-sm">
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
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-10">
              <h3 className="text-blue-900 text-lg font-semibold mb-3 flex items-center gap-2">
                <span>ℹ️</span>
                How Audio Streaming Works
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Content is fetched from your backend database with UUIDs</li>
                <li>• Click any audio card to start streaming</li>
                <li>
                  • Streaming uses: <code className="bg-blue-100 px-2 py-0.5 rounded font-mono text-xs">/api/streaming/content/{'{UUID}'}/stream</code>
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
