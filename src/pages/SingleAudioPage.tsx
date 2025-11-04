// src/pages/SingleAudioPage.tsx - HLS Streaming with Backend Integration
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { StreamingAudioPlayer } from '../components/StreamingAudioPlayer';


const SingleAudioPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Audio Not Found</h1>
          <button
            onClick={() => navigate('/audio')}
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  const handlePlay = () => {
    console.log('▶️ Audio started playing');
  };

  const handlePause = () => {
    console.log('⏸️ Audio paused');
  };

  const handleEnded = () => {
    console.log('✅ Audio ended');
  };

  const handleError = (error: Error) => {
    console.error('❌ Audio error:', error.message);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Close Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => navigate('/audio')}
          className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center transition-colors shadow-md"
          title="Close"
        >
          <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Audio Session
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              HLS Streaming Audio
            </p>
          </div>

          {/* Streaming Audio Player */}
          <StreamingAudioPlayer
            contentId={id}
            autoplay={false}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
            onError={handleError}
            showMetadata={true}
          />

          {/* Information Box */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              📋 Streaming Information
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li>• Content ID: {id}</li>
              <li>• Using HLS streaming from backend</li>
              <li>• Check browser console for detailed logging</li>
              <li>• Check Network tab for HLS manifest (.m3u8) and segments</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleAudioPage;
