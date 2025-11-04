// src/pages/AudioBrowsePage.tsx - Browse Real Audio Content with UUIDs
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { contentService } from '@/services/content.service';
import { Play, Clock, User, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface AudioContentItem {
  id: string; // UUID
  title: string;
  description: string;
  expert_name: string;
  expert_title: string;
  duration_seconds: number;
  category_name: string;
  thumbnail_url?: string;
  access_tier: 'free' | 'premium';
}

const AudioBrowsePage = () => {
  const navigate = useNavigate();
  const [audioContent, setAudioContent] = useState<AudioContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAudioContent = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🎵 Loading audio content from backend...');

      const content = await contentService.getAudioContent();

      if (content.length === 0) {
        setError('No audio content found in database. Please add audio content with UUIDs.');
      } else {
        setAudioContent(content as any);
        console.log(`✅ Loaded ${content.length} audio items`);
      }
    } catch (err: any) {
      console.error('❌ Failed to load audio content:', err);
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
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayAudio = (audioId: string, accessTier: string) => {
    if (accessTier === 'premium') {
      // You might want to check user subscription here
      console.log('Premium content clicked');
    }
    navigate(`/audio/${audioId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Audio Library
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Browse and listen to audio content from our collection
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading audio content...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <div className="flex items-start gap-4 mb-4">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                    Unable to Load Audio Content
                  </h3>
                  <p className="text-red-800 dark:text-red-200 mb-4">{error}</p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-900 dark:text-blue-100 font-semibold mb-2">
                  To add audio content:
                </p>
                <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 ml-4">
                  <li>1. Ensure your backend is running</li>
                  <li>2. Add content to the database with UUIDs</li>
                  <li>3. Set content_type = 'audio'</li>
                  <li>4. Refresh this page</li>
                </ol>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={loadAudioContent}
                  variant="default"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Content Grid */}
        {!loading && !error && audioContent.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {audioContent.map((audio) => (
              <div
                key={audio.id}
                onClick={() => handlePlayAudio(audio.id, audio.access_tier)}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video w-full bg-gradient-to-br from-purple-500 to-indigo-600 overflow-hidden">
                  {audio.thumbnail_url ? (
                    <img
                      src={audio.thumbnail_url}
                      alt={audio.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-12 h-12 text-white opacity-50" />
                    </div>
                  )}

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white fill-current ml-1" />
                    </div>
                  </div>

                  {/* Access Tier Badge */}
                  {audio.access_tier === 'premium' && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
                      PREMIUM
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {audio.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {audio.description}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span className="truncate">{audio.expert_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDuration(audio.duration_seconds)}</span>
                    </div>
                  </div>

                  {/* Category */}
                  {audio.category_name && (
                    <div className="mt-3">
                      <span className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs font-medium px-2 py-1 rounded">
                        {audio.category_name}
                      </span>
                    </div>
                  )}

                  {/* UUID Display (for debugging) */}
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-400 dark:text-gray-600 font-mono truncate" title={audio.id}>
                      ID: {audio.id.substring(0, 8)}...
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        {!loading && !error && audioContent.length > 0 && (
          <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              ℹ️ How Audio Streaming Works
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li>• Content is fetched from your backend database with UUIDs</li>
              <li>• Click any audio card to start streaming</li>
              <li>• Streaming uses HLS format via: <code className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded font-mono text-xs">/api/streaming/content/{'{UUID}'}/stream</code></li>
              <li>• Premium content may require authentication</li>
            </ul>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AudioBrowsePage;
