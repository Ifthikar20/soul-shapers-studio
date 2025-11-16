// src/pages/SingleAudioPage.tsx - HLS Streaming with Backend Integration
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, AlertCircle, Terminal, ChevronDown, ChevronUp } from 'lucide-react';
import { StreamingAudioPlayer } from '../components/StreamingAudioPlayer';
import { audioStreamingService } from '../services/audio.service';
import { progressService } from '@/services/progress.service';
import ContentProgressBar from '@/components/progress/ContentProgressBar';
import plant1 from '../assets/plant1.png';

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Sample transcript with timestamps
const SAMPLE_TRANSCRIPT = [
  { time: 0, text: "Welcome to this guided meditation session. Find a comfortable position, either sitting or lying down." },
  { time: 8, text: "Close your eyes gently, and take a deep breath in through your nose..." },
  { time: 15, text: "Hold it for a moment... and now release slowly through your mouth." },
  { time: 22, text: "Feel your body beginning to relax with each breath you take." },
  { time: 30, text: "Notice any tension in your shoulders, and let it melt away." },
  { time: 38, text: "Bring your awareness to the present moment, right here, right now." },
  { time: 46, text: "There's nowhere else you need to be, nothing else you need to do." },
  { time: 54, text: "Continue breathing naturally, observing the gentle rise and fall of your chest." },
  { time: 62, text: "If your mind wanders, that's perfectly okay. Gently bring it back to your breath." },
  { time: 72, text: "Feel the calm spreading through your entire body, from head to toe." },
];

const SingleAudioPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showTranscript, setShowTranscript] = useState(true);
  const [audioData, setAudioData] = useState<any>(null);
  const [showPlantInfo, setShowPlantInfo] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

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

  const handleEnded = async () => {
    console.log('✅ Audio ended');

    // Track audio completion for progress/gamification
    if (id && audioDuration > 0) {
      const durationMinutes = Math.round(audioDuration / 60);
      await progressService.trackActivity({
        activityType: 'audio_completed',
        contentId: id,
        contentTitle: audioData?.title || 'Audio Session',
        durationMinutes: durationMinutes,
      });
      console.log('✅ Audio completion tracked:', durationMinutes, 'minutes');
    }
  };

  const handleError = (error: Error) => {
    console.error('❌ Audio error:', error.message);
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleDurationChange = (duration: number) => {
    setAudioDuration(duration);
  };

  const handleContinueListening = () => {
    // The audio player will auto-resume from saved position
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get current transcript segment
  const getCurrentSegmentIndex = () => {
    for (let i = SAMPLE_TRANSCRIPT.length - 1; i >= 0; i--) {
      if (currentTime >= SAMPLE_TRANSCRIPT[i].time) {
        return i;
      }
    }
    return -1;
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
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-6 lg:gap-10 items-start">
          {/* Left Side - Plant Image */}
          <div
            className="relative h-[450px] sm:h-[500px] lg:h-[550px] lg:sticky lg:top-8 flex items-center justify-center group cursor-pointer"
            onMouseEnter={() => setShowPlantInfo(true)}
            onMouseLeave={() => setShowPlantInfo(false)}
          >
            <img
              src={plant1}
              alt="Meditation Plant"
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />

            {/* Plant Info Modal */}
            {showPlantInfo && (
              <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-2xl border border-gray-200 dark:border-gray-700 z-10 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5 text-sm">
                  Monstera Deliciosa
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Known as the "Swiss Cheese Plant," this tropical beauty symbolizes growth and transformation.
                  Its presence promotes calmness, improved air quality, and serves as a reminder of nature's resilience during meditation.
                </p>
              </div>
            )}
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
                onTimeUpdate={handleTimeUpdate}
                onDurationChange={handleDurationChange}
              />
            </div>

            {/* Listen Progress Bar */}
            <ContentProgressBar
              contentId={id}
              contentType="audio"
              currentTime={currentTime}
              duration={audioDuration}
              onContinue={handleContinueListening}
              className="mt-6"
            />

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

              {/* Transcript Content with Sync */}
              {showTranscript && (
                <div className="pt-2 pb-6">
                  <div className="max-h-96 overflow-y-auto space-y-4">
                    {SAMPLE_TRANSCRIPT.map((segment, index) => {
                      const isActive = index === getCurrentSegmentIndex();
                      return (
                        <div
                          key={index}
                          className={`transition-all duration-300 p-3 rounded-lg ${
                            isActive
                              ? 'bg-gray-100 dark:bg-gray-800 scale-[1.02]'
                              : 'opacity-60'
                          }`}
                        >
                          <p className={`text-sm leading-relaxed ${
                            isActive
                              ? 'text-gray-900 dark:text-white font-medium'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {segment.text}
                          </p>
                        </div>
                      );
                    })}
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
