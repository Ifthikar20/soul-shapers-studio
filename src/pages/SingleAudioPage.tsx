// src/pages/SingleAudioPage.tsx - HLS Streaming with Backend Integration
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, AlertCircle, Terminal } from 'lucide-react';
import { StreamingAudioPlayer } from '../components/StreamingAudioPlayer';

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SingleAudioPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Check if ID exists
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

  // Validate UUID format
  if (!UUID_REGEX.test(id)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
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

          {/* Error Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Invalid Audio ID Format
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  The URL you're trying to access uses an invalid ID format. Audio content requires a UUID.
                </p>
              </div>
            </div>

            {/* Current ID */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Current ID:</p>
              <code className="text-sm text-red-600 dark:text-red-400 font-mono break-all">{id}</code>
            </div>

            {/* Expected Format */}
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Expected Format (UUID):</p>
              <code className="text-sm text-green-600 dark:text-green-400 font-mono break-all">
                0b8df95c-4a61-4446-b3a9-431091477455
              </code>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <Terminal className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  How to Get Valid UUIDs
                </h3>
              </div>
              <ol className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-[20px]">1.</span>
                  <div>
                    <p className="font-semibold mb-1">Run the UUID script:</p>
                    <code className="block bg-blue-100 dark:bg-blue-900/40 px-3 py-2 rounded text-xs font-mono mt-1">
                      python3 get_content_uuids.py
                    </code>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-[20px]">2.</span>
                  <span>Copy a UUID from the output table</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-[20px]">3.</span>
                  <div>
                    <p className="mb-1">Navigate to the correct URL format:</p>
                    <code className="block bg-blue-100 dark:bg-blue-900/40 px-3 py-2 rounded text-xs font-mono mt-1">
                      http://localhost:8080/audio/&#123;UUID&#125;
                    </code>
                  </div>
                </li>
              </ol>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/audio')}
                className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
              >
                Back to Audio Library
              </button>
              <button
                onClick={() => window.open('https://github.com/Ifthikar20/soul-shapers-studio/blob/main/STREAMING_ENDPOINT_FIX.md', '_blank')}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors"
              >
                View Documentation
              </button>
            </div>
          </div>
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
