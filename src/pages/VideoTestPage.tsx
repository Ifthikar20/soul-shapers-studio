// src/pages/VideoTestPage.tsx - Test page for HLS Video Player

import React, { useState } from 'react';
import { VideoPlayer } from '../components/VideoPlayer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const VideoTestPage: React.FC = () => {
  // Example content ID from the documentation
  const [contentId, setContentId] = useState('079d0d9e-5cf4-49cc-805a-08b11082c1bf');
  const [inputValue, setInputValue] = useState(contentId);

  const handleContentIdChange = () => {
    setContentId(inputValue);
  };

  const handlePlay = () => {
    console.log('▶️ Video started playing');
  };

  const handlePause = () => {
    console.log('⏸️ Video paused');
  };

  const handleEnded = () => {
    console.log('✅ Video ended');
  };

  const handleError = (error: Error) => {
    console.error('❌ Video error:', error.message);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            HLS Video Player Test
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test the backend-integrated HLS streaming player
          </p>
        </div>

        {/* Content ID Input */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Content ID
          </h2>
          <div className="flex gap-3">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter content ID"
              className="flex-1"
            />
            <Button onClick={handleContentIdChange}>
              Load Video
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Current: {contentId}
          </p>
        </div>

        {/* Video Player */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <VideoPlayer
            contentId={contentId}
            autoplay={false}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
            onError={handleError}
          />
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            📋 Testing Instructions
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>• Make sure your backend server is running on http://localhost:8000</li>
            <li>• You must be logged in with a valid access token</li>
            <li>• The video player will automatically fetch the HLS streaming URL</li>
            <li>• Check the browser console for detailed logging</li>
            <li>• Check the Network tab to see HLS manifest (.m3u8) and segment (.ts) requests</li>
            <li>• Use the quality selector (top-right) to switch between 720p and 1080p</li>
          </ul>
        </div>

        {/* Example Content IDs */}
        <div className="mt-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3">
            🎬 Example Content IDs
          </h3>
          <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
            <li>• Default: 079d0d9e-5cf4-49cc-805a-08b11082c1bf</li>
            <li>• Replace with actual content IDs from your backend database</li>
          </ul>
        </div>

        {/* API Endpoints */}
        <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
            🔌 API Endpoints Being Used
          </h3>
          <ul className="space-y-2 text-sm text-green-800 dark:text-green-200 font-mono">
            <li>• GET /api/streaming/{'{contentId}'} - Get HLS streaming URL</li>
            <li>• GET /api/browse - Browse available content</li>
            <li>• GET /api/content/{'{contentId}'} - Get content metadata</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VideoTestPage;
