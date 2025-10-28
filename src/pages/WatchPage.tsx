// src/pages/WatchPage.tsx - FIXED VERSION WITH BETTER ERROR HANDLING
import { useParams, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import HLSVideoPlayer, { HLSVideoPlayerRef } from '@/components/VideoModal/HLSVideoPlayer';
import { contentService } from '@/services/content.service';
import { Video, isUUID } from '@/types/video.types';
import { toast } from 'sonner';
import { analyticsService } from '@/services/analytics.service';
import { dummySeriesVideos, dummyRelatedVideos } from '@/data/dummyVideos';
import {
  X, Plus, ThumbsUp, Share2, Check, Loader2, AlertCircle, ArrowLeft, RefreshCw,
  PlayCircle, Clock, BookOpen, Hash, ChevronRight
} from 'lucide-react';

const WatchPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HLSVideoPlayerRef>(null);

  const [video, setVideo] = useState<Video | null>(null);
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [viewTracked, setViewTracked] = useState(false);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [seriesEpisodes, setSeriesEpisodes] = useState<Video[]>([]);

  // Debug info
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const fetchVideo = async (isRetry = false) => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎬 WatchPage - Fetching Video');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📍 Video ID:', id);
    console.log('🌐 API URL:', apiUrl);
    console.log('🔄 Is Retry:', isRetry);
    
    if (!id) {
      console.error('❌ No video ID provided');
      setError('No video ID provided');
      setLoading(false);
      return;
    }

    if (!isUUID(id)) {
      console.error('❌ Invalid UUID format:', id);
      setError('Invalid video ID format');
      setLoading(false);
      return;
    }

    try {
      if (isRetry) {
        setRetrying(true);
      } else {
        setLoading(true);
      }
      setError(null);

      console.log('📥 Step 1: Fetching video metadata...');
      const videoData = await contentService.getVideoByUUID(id);
      console.log('✅ Video metadata loaded:', {
        id: videoData.id,
        title: videoData.title,
        accessTier: videoData.accessTier
      });
      setVideo(videoData);

      console.log('📥 Step 2: Fetching stream data...');
      const streamData = await contentService.getVideoStreamData(id);
      console.log('✅ Stream data loaded:', {
        streamUrl: streamData.streamUrl ? 'Present' : 'Missing',
        qualities: streamData.qualities,
        thumbnailUrl: streamData.thumbnailUrl ? 'Present' : 'Missing'
      });

      if (!streamData.streamUrl) {
        throw new Error('No stream URL returned from server');
      }

      setStreamUrl(streamData.streamUrl);
      console.log('✅ Video loaded successfully');

      // Track view when stream loads successfully
      await trackVideoView(videoData);

    } catch (err: any) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ ERROR FETCHING VIDEO');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('Error:', err);
      console.error('Error message:', err.message);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      setError(err.message || 'Failed to load video');
      
      // Show toast with helpful message
      if (err.message.includes('not found')) {
        toast.error('Video not found');
      } else if (err.message.includes('Access denied')) {
        toast.error('Upgrade required to watch this video');
      } else {
        toast.error('Failed to load video. Please try again.');
      }
      
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  // Track video view (call once when video starts)
  const trackVideoView = useCallback(async (videoData: Video) => {
    if (viewTracked || !videoData?.id) return;

    try {
      // Generate or get session ID
      const sessionId = sessionStorage.getItem('sessionId') ||
        (() => {
          const id = crypto.randomUUID();
          sessionStorage.setItem('sessionId', id);
          return id;
        })();

      await analyticsService.trackView({
        content_id: videoData.id,
        video_title: videoData.title,
        category: videoData.category_name || videoData.category,
        expert: videoData.expert,
        duration_seconds: videoData.duration_seconds,
        session_id: sessionId
      });

      setViewTracked(true);
      console.log('✅ Video view tracked:', videoData.title);
    } catch (error) {
      console.error('❌ Failed to track video view:', error);
    }
  }, [viewTracked]);

  // Fetch related videos and next episode
  const fetchRelatedContent = useCallback(async (currentVideo: Video) => {
    try {
      // Try to fetch videos from the same category from API
      let allVideos: Video[] = [];
      let apiRelatedVideos: Video[] = [];

      try {
        allVideos = await contentService.getVideosForFrontend(currentVideo.category);
        apiRelatedVideos = allVideos.filter(v => v.id !== currentVideo.id).slice(0, 6);
      } catch (error) {
        console.log('API fetch failed, using dummy data');
      }

      // Use API data if available, otherwise use dummy data
      const relatedToShow = apiRelatedVideos.length > 0 ? apiRelatedVideos : dummyRelatedVideos;
      setRelatedVideos(relatedToShow);

      // Check if video is part of a series
      if (currentVideo.series_id || currentVideo.seriesId) {
        const seriesId = currentVideo.series_id || currentVideo.seriesId;
        const currentEpisodeNum = currentVideo.episode_number || currentVideo.episodeNumber || 0;

        // Try to find next episode from API data
        let nextEpisode: Video | null = null;

        if (allVideos.length > 0) {
          const allSeriesEpisodes = allVideos
            .filter(v => (v.series_id || v.seriesId) === seriesId)
            .sort((a, b) => {
              const aEp = a.episode_number || a.episodeNumber || 0;
              const bEp = b.episode_number || b.episodeNumber || 0;
              return aEp - bEp;
            });

          nextEpisode = allSeriesEpisodes.find(ep => {
            const epNum = ep.episode_number || ep.episodeNumber || 0;
            return epNum > currentEpisodeNum;
          }) || null;
        }

        // Fallback to dummy data if no next episode found
        if (!nextEpisode && currentEpisodeNum < 5) {
          nextEpisode = dummySeriesVideos.find(ep =>
            ep.episode_number === currentEpisodeNum + 1
          ) || null;
        }

        setSeriesEpisodes(nextEpisode ? [nextEpisode] : []);
      } else {
        // For videos not in a series, show dummy next episode for demonstration
        // This helps users see the feature even when watching standalone videos
        const currentEpNum = 1; // Treat as episode 1
        const dummyNext = dummySeriesVideos.find(ep => ep.episode_number === currentEpNum + 1);
        if (dummyNext) {
          setSeriesEpisodes([dummyNext]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch related content:', error);
      // Fallback to dummy data on error
      setRelatedVideos(dummyRelatedVideos);
      setSeriesEpisodes([dummySeriesVideos[1]]); // Show episode 2 as next
    }
  }, []);

  useEffect(() => {
    fetchVideo();
  }, [id]);

  // Fetch related content when video loads
  useEffect(() => {
    if (video) {
      fetchRelatedContent(video);
    }
  }, [video, fetchRelatedContent]);

  const handleRetry = () => {
    fetchVideo(true);
  };

  const handleCopyLink = () => {
    if (!video) return;

    const shareUrl = `${window.location.origin}/watch/${video.id}`;

    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy link');
      });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto" />
          <p className="text-gray-400">Loading video...</p>
          <p className="text-xs text-gray-600">
            Video ID: {id}
          </p>
        </div>
      </div>
    );
  }

  // Error state with retry option
  if (error || !video) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md space-y-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {error || 'Video not found'}
            </h2>
            <p className="text-gray-400 mb-2">
              The video you're looking for doesn't exist or has been removed.
            </p>
          </div>

          {/* Debug Info */}
          <div className="bg-gray-900 p-4 rounded-lg text-left text-xs text-gray-500 space-y-1">
            <p className="font-bold text-gray-400 mb-2">Debug Info:</p>
            <p>Video ID: {id}</p>
            <p>Error: {error || 'Unknown error'}</p>
            <p>API URL: {apiUrl}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleRetry}
              disabled={retrying}
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              {retrying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </>
              )}
            </Button>
            
            <Button
              onClick={() => navigate('/browse')}
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Browse
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Success - render video player
  return (
    <div className="min-h-screen bg-black">
      {/* Close Button */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/browse')}
          className="absolute top-4 left-4 z-50 rounded-full bg-black/60 hover:bg-black/80 text-white"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Video Player */}
        <div className="relative w-full aspect-video bg-black max-w-[1920px] mx-auto">
          {streamUrl ? (
            <HLSVideoPlayer
              ref={videoRef}
              src={streamUrl}
              poster={video.thumbnail}
              className="w-full h-full"
              autoPlay={true}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-center text-white">
                <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                <p>No stream URL available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Info */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-4">{video.title}</h1>
        
        <div className="flex items-center gap-4 mb-6">
          <img
            src={video.expertAvatar}
            alt={video.expert}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="text-white font-semibold">{video.expert}</p>
            {video.expertCredentials && (
              <p className="text-gray-400 text-sm">{video.expertCredentials}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <Badge variant="outline" className="border-gray-700 text-gray-300">
            {video.category}
          </Badge>
          {video.isNew && (
            <Badge className="bg-purple-600 text-white">New</Badge>
          )}
        </div>

        <p className="text-gray-300 leading-relaxed mb-6">
          {video.fullDescription || video.description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </>
            )}
          </Button>

          <Button
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to List
          </Button>

          <Button
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800"
          >
            <ThumbsUp className="w-4 h-4 mr-2" />
            Like
          </Button>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Learning Objectives */}
            {video.learningObjectives && video.learningObjectives.length > 0 && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-500" />
                    What You'll Learn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {video.learningObjectives.map((objective, index) => (
                      <li key={index} className="text-gray-300 flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Related Topics */}
            {video.relatedTopics && video.relatedTopics.length > 0 && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Hash className="w-5 h-5 text-purple-500" />
                    Related Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {video.relatedTopics.map((topic, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 cursor-pointer"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Next Episode */}
            {seriesEpisodes.length > 0 && (
              <Card className="bg-gray-900 border-gray-800 hover:border-purple-500/50 transition-all">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-base font-medium">
                    Next Episode
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {seriesEpisodes.map((episode) => {
                    const episodeNum = episode.episode_number || episode.episodeNumber;

                    return (
                      <div
                        key={episode.id}
                        onClick={() => navigate(`/watch/${episode.id}`)}
                        className="cursor-pointer group"
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={episode.thumbnail}
                            alt={episode.title}
                            className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {episodeNum && (
                            <Badge className="absolute top-3 left-3 bg-black/80 text-white">
                              Episode {episodeNum}
                            </Badge>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="bg-purple-600 rounded-full p-4">
                              <PlayCircle className="w-12 h-12 text-white" />
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-purple-400 transition-colors">
                            {episode.title}
                          </h3>
                          <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                            {episode.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {episode.duration}
                            </span>
                            {episode.views && (
                              <span>{episode.views} views</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Related Videos */}
          <div className="lg:col-span-1">
            {relatedVideos.length > 0 && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">More Like This</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {relatedVideos.map((relatedVideo) => (
                      <div
                        key={relatedVideo.id}
                        onClick={() => navigate(`/watch/${relatedVideo.id}`)}
                        className="group cursor-pointer"
                      >
                        <div className="relative mb-2 overflow-hidden rounded-lg">
                          <img
                            src={relatedVideo.thumbnail}
                            alt={relatedVideo.title}
                            className="w-full h-32 object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                            {relatedVideo.duration}
                          </div>
                        </div>
                        <h4 className="text-white font-medium text-sm mb-1 line-clamp-2 group-hover:text-purple-400 transition-colors">
                          {relatedVideo.title}
                        </h4>
                        <p className="text-gray-400 text-xs mb-1">{relatedVideo.expert}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{relatedVideo.views} views</span>
                          {relatedVideo.isNew && (
                            <Badge className="bg-purple-600 text-white text-xs">New</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;