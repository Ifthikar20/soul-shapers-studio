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

  // Check if ID exists or is not a valid UUID - redirect to 404
  if (!id || !UUID_REGEX.test(id)) {
    // Silently redirect to 404 for security - don't reveal valid format
    useEffect(() => {
      navigate('/404', { replace: true });
    }, [navigate]);
    return null;
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
