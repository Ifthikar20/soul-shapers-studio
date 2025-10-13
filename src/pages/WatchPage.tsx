// ============================================
// FILE 3: src/pages/WatchPage.tsx
// ============================================
import { useParams, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import HLSVideoPlayer, { HLSVideoPlayerRef } from '@/components/VideoModal/HLSVideoPlayer';
import { contentService } from '@/services/content.service';
import { Video, isUUID } from '@/types/video.types';
import { toast } from 'sonner';
import { 
  X, Plus, ThumbsUp, Share2, Check, Loader2, AlertCircle, ArrowLeft
} from 'lucide-react';

const WatchPage = () => {
  // ✅ Get UUID from URL params (changed from shortId to id)
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HLSVideoPlayerRef>(null);
  
  const [video, setVideo] = useState<Video | null>(null);
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);

  // ✅ Fetch video by UUID
  useEffect(() => {
    const fetchVideo = async () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🎬 WatchPage MOUNTED');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🌐 Full URL:', window.location.href);
      console.log('📍 Pathname:', window.location.pathname);
      console.log('🔍 id from useParams:', id);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      if (!id) {
        console.error('❌ FAILED: No id in params');
        setError('No video ID provided');
        setLoading(false);
        return;
      }

      console.log('✅ PASSED: id exists:', id);
      console.log('📏 id length:', id.length);
      console.log('🔍 UUID validation:', isUUID(id));

      // ✅ Validate UUID format
      if (!isUUID(id)) {
        console.error('❌ FAILED: Invalid UUID format');
        console.error('Expected: UUID (e.g., 0b8df95c-4a61-4446-b3a9-431091477455)');
        console.error('Got:', id);
        setError('Invalid video ID format');
        setLoading(false);
        return;
      }

      console.log('✅ PASSED: UUID format valid');
      console.log('🔄 Fetching video...');

      try {
        setLoading(true);
        setError(null);
        
        // Fetch video metadata
        const videoData = await contentService.getVideoByUUID(id);
        
        console.log('✅ VIDEO LOADED:', videoData);
        
        setVideo(videoData);
        
        // Fetch streaming URLs
        console.log('🔄 Fetching stream data...');
        const streamData = await contentService.getVideoStreamData(id);
        
        console.log('✅ STREAM DATA LOADED:', streamData);
        
        setStreamUrl(streamData.streamUrl);
        
      } catch (err: any) {
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('❌ ERROR FETCHING VIDEO');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('Error:', err);
        console.error('Error message:', err.message);
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        setError(err.message || 'Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  // ✅ Handle share/copy link with UUID
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
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading video...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !video) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            {error || 'Video not found'}
          </h2>
          <p className="text-gray-400 mb-6">
            The video you're looking for doesn't exist or has been removed.
          </p>
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
    );
  }

  // Success - render video player
  return (
    <div className="min-h-screen bg-black">
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/browse')}
          className="absolute top-4 left-4 z-50 rounded-full bg-black/60 hover:bg-black/80 text-white"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="relative w-full aspect-video bg-black max-w-[1920px] mx-auto">
          <HLSVideoPlayer
            ref={videoRef}
            src={streamUrl}
            poster={video.thumbnail}
            className="w-full h-full"
            autoPlay={true}
          />
        </div>
      </div>

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

        <p className="text-gray-300 leading-relaxed">
          {video.fullDescription || video.description}
        </p>
      </div>
    </div>
  );
};

export default WatchPage;