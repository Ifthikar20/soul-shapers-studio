import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play, Pause, Volume2, VolumeX, Volume1, Settings,
  SkipBack, SkipForward, Maximize, Minimize, X,
  ThumbsUp, Share2, Plus, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import HLSVideoPlayer, { HLSVideoPlayerRef } from '@/components/VideoModal/HLSVideoPlayer';
import { VideoContent } from '@/types/video.types';

interface FullPageVideoPlayerProps {
  video: VideoContent;
}

const FullPageVideoPlayer = ({ video }: FullPageVideoPlayerProps) => {
  const navigate = useNavigate();
  const videoRef = useRef<HLSVideoPlayerRef>(null);

  // Video state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([80]);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // UI state
  const [activeTab, setActiveTab] = useState('overview');
  const [showInfo, setShowInfo] = useState(true);

  const togglePlayPause = useCallback(async () => {
    if (!videoRef.current) return;
    try {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        await videoRef.current.play();
      }
    } catch (error) {
      console.error('Playback error:', error);
    }
  }, [isPlaying]);

  const handleSeek = useCallback((newTime: number[]) => {
    if (!videoRef.current) return;
    videoRef.current.seek(newTime[0]);
  }, []);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const VolumeIcon = isMuted || volume[0] === 0 ? VolumeX : volume[0] < 50 ? Volume1 : Volume2;

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

        {/* Video Player */}
        <div className="relative w-full aspect-video bg-black max-w-[1920px] mx-auto">
          <HLSVideoPlayer
            ref={videoRef}
            src={video.videoUrl}
            poster={video.thumbnail}
            className="w-full h-full"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={setCurrentTime}
            onDurationChange={setDuration}
          />

          {/* Custom Controls Overlay */}
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 transition-opacity ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            {/* Progress Bar */}
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="mb-4"
            />

            {/* Controls Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  size="icon"
                  onClick={togglePlayPause}
                  className="rounded-full bg-white text-black hover:bg-white/90"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </Button>

                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                    <VolumeIcon className="w-5 h-5" />
                  </Button>
                  <Slider
                    value={volume}
                    max={100}
                    onValueChange={setVolume}
                    className="w-24"
                  />
                </div>

                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                  {playbackRate}x
                </Button>
                <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                  <Settings className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                  <Maximize className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Info Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-white mb-4">{video.title}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <img
                  src={video.expertAvatar}
                  alt={video.expert}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-white font-semibold">{video.expert}</p>
                  <p className="text-gray-400 text-sm">{video.expertCredentials}</p>
                </div>
              </div>
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

                {video.learningObjectives && (
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
                <Button variant="outline" className="w-full border-gray-700 text-white hover:bg-gray-800">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullPageVideoPlayer;