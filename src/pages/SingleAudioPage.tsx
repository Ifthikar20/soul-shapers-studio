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
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Close Button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => navigate('/audio')}
          className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
          title="Close"
        >
          <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Side - Plant Image */}
          <div className="relative rounded-2xl overflow-hidden h-[400px] lg:h-[600px] lg:sticky lg:top-8 bg-gray-50 dark:bg-gray-900">
            <img
              src={plant7}
              alt="Meditation"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Right Side - Audio Player and Content */}
          <div className="space-y-6">
            {/* Title Section */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {audioData?.title || 'Audio Meditation'}
              </h1>
              {audioData?.expert_name && (
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                  with {audioData.expert_name}
                </p>
              )}
              {audioData?.category && (
                <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full">
                  {audioData.category}
                </span>
              )}
            </div>

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
              <div className="pt-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  About This Session
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {audioData.description}
                </p>
              </div>
            )}

            {/* Transcript Section */}
            <div className="pt-2">
              {/* Transcript Header */}
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="w-full flex items-center justify-between py-4 hover:opacity-70 transition-opacity"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Transcript
                </h2>
                {showTranscript ? (
                  <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>

              {/* Transcript Content */}
              {showTranscript && (
                <div className="pt-2 pb-6">
                  <div className="max-h-96 overflow-y-auto">
                    {audioData?.transcript ? (
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                        {audioData.transcript}
                      </p>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-500 text-base mb-1">
                          No transcript available
                        </p>
                        <p className="text-gray-400 dark:text-gray-600 text-sm">
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
