// src/pages/WatchPage.tsx - COMPLETE FIXED VERSION WITH SHORT_ID
import { useParams, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import HLSVideoPlayer, { HLSVideoPlayerRef } from '@/components/VideoModal/HLSVideoPlayer';
import { contentService } from '@/services/content.service';
import { Video, VideoRouteParams, isShortId } from '@/types/video.types';
import { toast } from 'sonner';
import { 
  X, Plus, ThumbsUp, Share2, Check, Loader2, AlertCircle, ArrowLeft
} from 'lucide-react';

const WatchPage = () => {
  // ✅ Get short_id from URL params
  const { shortId } = useParams<{ shortId: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HLSVideoPlayerRef>(null);
  
  // ✅ State management
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);

  // ✅ Fetch video by short_id
 // src/pages/WatchPage.tsx - Enhanced Debug Version

useEffect(() => {
  const fetchVideo = async () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎬 WatchPage MOUNTED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🌐 Full URL:', window.location.href);
    console.log('📍 Pathname:', window.location.pathname);
    console.log('🔍 shortId from useParams:', shortId);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (!shortId) {
      console.error('❌ FAILED: No shortId in params');
      console.error('Available params:', Object.keys(useParams()));
      setError('No video ID provided');
      setLoading(false);
      return;
    }

    console.log('✅ PASSED: shortId exists:', shortId);
    console.log('📏 shortId length:', shortId.length);
    console.log('🔍 shortId validation:', isShortId(shortId));

    if (!isShortId(shortId)) {
      console.error('❌ FAILED: Invalid short_id format');
      console.error('Expected: 11 alphanumeric characters');
      console.error('Got:', shortId);
      console.error('Length:', shortId.length);
      setError('Invalid video ID format');
      setLoading(false);
      return;
    }

    console.log('✅ PASSED: shortId format valid');
    console.log('🔄 Fetching video...');

    try {
      setLoading(true);
      setError(null);
      
      const videoData = await contentService.getVideoByShortId(shortId);
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ VIDEO LOADED SUCCESSFULLY');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Video:', videoData);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      setVideo(videoData);
    } catch (err: any) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ ERROR FETCHING VIDEO');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('Error:', err);
      console.error('Error message:', err.message);
      console.error('Error response:', err.response);
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      if (err.message === 'Video not found') {
        setError('Video not found');
      } else if (err.response?.status === 403) {
        setError('Access denied. Please upgrade your subscription.');
      } else {
        setError('Failed to load video. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  fetchVideo();
}, [shortId]);


  // ✅ Handle share/copy link with short_id
  const handleCopyLink = () => {
    if (!video) return;
    
    const shareUrl = `${window.location.origin}/watch/${video.short_id}`;
    
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

  // ✅ Handle share with native share API
  const handleShare = async () => {
    if (!video) return;

    const shareUrl = `${window.location.origin}/watch/${video.short_id}`;
    const shareData = {
      title: video.title,
      text: `Check out this video: ${video.title}`,
      url: shareUrl,
    };

    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('Shared successfully!');
      } catch (err) {
        // User cancelled sharing
        console.log('Share cancelled');
      }
    } else {
      // Fallback to copy link
      handleCopyLink();
    }
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading video...</p>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error || !video) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            {error || 'Video not found'}
          </h2>
          <p className="text-gray-400 mb-6">
            {error === 'Access denied. Please upgrade your subscription.' 
              ? 'This video requires a premium subscription.'
              : 'The video you\'re looking for doesn\'t exist or has been removed.'}
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => navigate('/browse')}
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Browse
            </Button>
            {error === 'Access denied. Please upgrade your subscription.' && (
              <Button
                onClick={() => navigate('/upgrade')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Upgrade Now
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ✅ Success - render video player
  return (
    <div className="min-h-screen bg-black">
      
      {/* Video Player Container */}
      <div className="relative">
        
        {/* Close/Back Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/browse')}
          className="absolute top-4 left-4 z-50 rounded-full bg-black/60 hover:bg-black/80 text-white"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* HLS Video Player */}
        <div className="relative w-full aspect-video bg-black max-w-[1920px] mx-auto">
          <HLSVideoPlayer
            ref={videoRef}
            src={video.videoUrl || ''} // ✅ Uses videoUrl from backend
            poster={video.thumbnail}
            className="w-full h-full"
            autoPlay={true}
          />
        </div>
      </div>

      {/* Video Info Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Title */}
            <h1 className="text-3xl font-bold text-white mb-4">{video.title}</h1>
            
            {/* Expert Info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <img
                  src={video.expertAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${video.expert}`}
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
            </div>

            {/* Badges */}
            <div className="flex gap-2 mb-6">
              <Badge variant="outline" className="border-gray-700 text-gray-300">
                {video.category}
              </Badge>
              {video.isNew && (
                <Badge className="bg-purple-600 text-white">
                  New
                </Badge>
              )}
              {video.isTrending && (
                <Badge className="bg-orange-500 text-white">
                  Trending
                </Badge>
              )}
              <Badge variant="outline" className="border-gray-700 text-gray-300">
                {video.accessTier === 'premium' ? '👑 Premium' : 'Free'}
              </Badge>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-800 mb-6">
              <div className="flex gap-6">
                {['Overview', 'Lessons', 'Community'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`pb-3 text-sm font-medium transition-colors relative ${
                      activeTab === tab.toLowerCase()
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab}
                    {activeTab === tab.toLowerCase() && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div>
                <p className="text-gray-300 leading-relaxed mb-6">
                  {video.fullDescription || video.description}
                </p>

                {video.learningObjectives && video.learningObjectives.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">What you'll learn</h3>
                    <ul className="space-y-2">
                      {video.learningObjectives.map((objective, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-300">
                          <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {video.relatedTopics && video.relatedTopics.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-white mb-4">Related Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {video.relatedTopics.map((topic, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-gray-700 text-gray-300"
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'lessons' && (
              <div className="text-gray-400">
                <p>Lesson content coming soon...</p>
              </div>
            )}

            {activeTab === 'community' && (
              <div className="text-gray-400">
                <p>Community discussion coming soon...</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
              <div className="space-y-3">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add to My List
                </Button>
                <Button variant="outline" className="w-full border-gray-700 text-white hover:bg-gray-800">
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Like
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-700 text-white hover:bg-gray-800"
                  onClick={handleShare}
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
              </div>

              {/* Share URL Display */}
              <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-400 mb-2">Share URL:</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/watch/${video.short_id}`}
                    className="flex-1 px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded border border-gray-600 truncate"
                    onClick={(e) => e.currentTarget.select()}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-purple-400 hover:text-purple-300 hover:bg-gray-700"
                    onClick={handleCopyLink}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Details Section */}
              <div className="mt-6 pt-6 border-t border-gray-800">
                <h4 className="text-sm font-semibold text-white mb-3">Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category</span>
                    <span className="text-white">{video.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white">{video.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rating</span>
                    <span className="text-white">{video.rating} ⭐</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Views</span>
                    <span className="text-white">{video.views}</span>
                  </div>
                  {video.short_id && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Video ID</span>
                      <span className="text-white font-mono text-xs">{video.short_id}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Series Info (if applicable) */}
              {video.seriesId && (
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <h4 className="text-sm font-semibold text-white mb-2">Series</h4>
                  <p className="text-sm text-gray-400">
                    {video.episodeNumber && `Episode ${video.episodeNumber}`}
                  </p>
                  {video.isFirstEpisode && (
                    <Badge className="mt-2 bg-green-600 text-white text-xs">
                      First Episode - Free
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;