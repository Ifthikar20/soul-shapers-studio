// src/pages/WatchPage.tsx - CLEANED UP VERSION (Full Screen Video Page)
import { useParams, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import HLSVideoPlayer, { HLSVideoPlayerRef } from '@/components/VideoModal/HLSVideoPlayer';
import { 
  X, Plus, ThumbsUp, Share2, Check
} from 'lucide-react';

// Import your video data (adjust path as needed)
// For now, using mock data
const mockVideo = {
  id: 1,
  title: "Understanding Anxiety: A Complete Guide",
  expert: "Dr. Sarah Johnson",
  expertCredentials: "Clinical Psychologist, PhD",
  expertAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2",
  duration: "18:30",
  category: "Mental Health",
  rating: 4.9,
  views: "12.5k",
  thumbnail: "https://images.unsplash.com/photo-1544027993-37dbfe43562a",
  description: "A comprehensive guide to understanding anxiety disorders.",
  fullDescription: "Dive deep into the complexities of anxiety, exploring its psychological and physiological impacts.",
  videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", // HLS URL
  learningObjectives: [
    "Understand the different types of anxiety disorders",
    "Identify personal anxiety triggers",
    "Learn practical coping mechanisms"
  ],
  accessTier: 'free' as const,
};

const WatchPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HLSVideoPlayerRef>(null);
  
  const [activeTab, setActiveTab] = useState('overview');
  
  // In production, fetch video by ID from your API
  const video = mockVideo;

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
            src={video.videoUrl}
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

export default WatchPage;