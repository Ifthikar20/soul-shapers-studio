// src/pages/SingleAudioPage.tsx - HLS Streaming with Backend Integration
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, AlertCircle, Terminal, ChevronDown, ChevronUp } from 'lucide-react';
import { StreamingAudioPlayer } from '../components/StreamingAudioPlayer';
import { audioStreamingService } from '../services/audio.service';
import plant7 from '../assets/plant7.png';

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SingleAudioPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showTranscript, setShowTranscript] = useState(true);
  const [audioData, setAudioData] = useState<any>(null);

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

  // Fetch audio metadata
  useEffect(() => {
    if (id && UUID_REGEX.test(id)) {
      audioStreamingService.getAudioStreamingUrl(id)
        .then(data => setAudioData(data))
        .catch(err => console.error('Error fetching audio data:', err));
    }
  }, [id]);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/50 dark:from-gray-950 dark:via-purple-950/20 dark:to-blue-950/20">
      {/* Close Button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => navigate('/audio')}
          className="w-12 h-12 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
          title="Close"
        >
          <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Plant Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[500px] lg:h-[700px] lg:sticky lg:top-8">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 via-indigo-600/80 to-blue-600/80 dark:from-purple-900/90 dark:via-indigo-900/90 dark:to-blue-900/90" />
            <img
              src={plant7}
              alt="Meditation"
              className="w-full h-full object-cover opacity-40 dark:opacity-30"
            />
            {/* Overlay Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                {audioData?.title || 'Audio Meditation'}
              </h1>
              {audioData?.expert_name && (
                <p className="text-lg sm:text-xl text-purple-100 mb-3 drop-shadow">
                  with {audioData.expert_name}
                </p>
              )}
              {audioData?.category && (
                <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                  {audioData.category}
                </span>
              )}
            </div>
          </div>

          {/* Right Side - Audio Player and Transcript */}
          <div className="space-y-6">
            {/* Audio Player */}
            <div>
              <StreamingAudioPlayer
                contentId={id}
                autoplay={false}
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handleEnded}
                onError={handleError}
                showMetadata={false}
              />
            </div>

            {/* Description Section */}
            {audioData?.description && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  About This Session
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {audioData.description}
                </p>
              </div>
            )}

            {/* Transcript Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              {/* Transcript Header */}
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="w-full flex items-center justify-between px-6 sm:px-8 py-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    Transcript
                  </h2>
                </div>
                {showTranscript ? (
                  <ChevronUp className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                )}
              </button>

              {/* Transcript Content */}
              {showTranscript && (
                <div className="px-6 sm:px-8 pb-8 border-t border-gray-100 dark:border-gray-700">
                  <div className="pt-6 max-h-96 overflow-y-auto">
                    {audioData?.transcript ? (
                      <div className="prose prose-gray dark:prose-invert max-w-none">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                          {audioData.transcript}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                          No transcript available
                        </p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">
                          The transcript for this audio session is not yet available.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="h-12" />
      </div>
    </div>
  );
};

export default SingleAudioPage;
