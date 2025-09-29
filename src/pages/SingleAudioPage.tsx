// src/pages/SingleAudioPage.tsx - Integrated with Backend API
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AudioPlayer } from '@/components/AudioPlayer';
import { AudioContent } from '@/components/AudioContent';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Plant images
import plant4 from "@/assets/plant001.png";
import plant4Night from "@/assets/1.png";
import plant5 from "@/assets/plant5.png";

// API Response Interface
interface AudioStreamData {
  content_id: string;
  content_type: string;
  title: string;
  duration_seconds: number;
  audio_url: string;
  audio_format: string;
  thumbnail_url?: string;
  session_id: string;
  expires_at: string;
  content_metadata: {
    title: string;
    description: string;
    expert_name: string;
    category_name: string;
    access_tier: string;
  };
  user_info?: {
    user_id: string;
    subscription_tier: string;
    access_granted: boolean;
  };
}

// Fallback static data for when API is unavailable
const audioContentData = [
  {
    id: 1,
    title: "Morning Meditation for Anxiety Relief",
    expert: "Dr. Sarah Johnson",
    expertCredentials: "Clinical Psychologist, PhD",
    duration: "12:30",
    category: "Meditation",
    rating: 4.9,
    listens: "25.3k",
    thumbnail: plant4,
    thumbnailNight: plant4Night,
    description: "Start your day with calm and clarity through this guided anxiety relief meditation.",
    fullDescription: "A gentle morning meditation designed to help you release anxiety and set positive intentions for the day ahead.",
    accessTier: 'free' as const,
    transcript: `Welcome to your morning meditation for anxiety relief...`,
    benefits: [
      'Reduces morning anxiety and stress',
      'Improves focus and mental clarity',
      'Promotes emotional balance throughout the day',
      'Establishes a positive morning routine'
    ],
  },
  {
    id: 2,
    title: "Deep Sleep Stories for Adults",
    expert: "Dr. Emily Chen",
    expertCredentials: "Sleep Specialist, MD",
    duration: "25:45",
    category: "Sleep",
    rating: 4.8,
    listens: "18.7k",
    thumbnail: plant5,
    thumbnailNight: plant5,
    description: "Calming bedtime stories designed to help adults drift into peaceful sleep.",
    fullDescription: "Professionally crafted sleep stories that guide your mind into relaxation and prepare you for restorative sleep.",
    accessTier: 'premium' as const,
    transcript: `Welcome to your sleep story...`,
    benefits: [
      'Promotes deep, restorative sleep',
      'Reduces bedtime anxiety and racing thoughts',
      'Creates a calming bedtime routine',
      'Improves overall sleep quality'
    ],
  },
];

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const SingleAudioPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showTranscript, setShowTranscript] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // API state
  const [audioStreamData, setAudioStreamData] = useState<AudioStreamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useStaticData, setUseStaticData] = useState(false);

  // Fetch audio stream data from backend
  useEffect(() => {
    const fetchAudioStream = async () => {
      // For the real audio from backend, use the slug
      const audioSlug = 'guided-meditation-anxiety-relief';
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `${API_BASE_URL}/content/${audioSlug}/stream`,
          {
            credentials: 'include', // Send auth cookies
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Please log in to access this content');
          }
          if (response.status === 403) {
            throw new Error('Premium subscription required to access this content');
          }
          if (response.status === 404) {
            throw new Error('Audio content not found');
          }
          throw new Error('Failed to load audio');
        }

        const data: AudioStreamData = await response.json();
        setAudioStreamData(data);
        setUseStaticData(false);
        
      } catch (err) {
        console.error('Failed to fetch audio stream:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Fall back to static data for demo purposes
        setUseStaticData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAudioStream();
  }, [id]);

  const handlePlay = () => {
    setShowTranscript(true);
  };

  const handlePause = () => {
    // Keep transcript visible even when paused
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Theme classes
  const themeClasses = {
    background: isDarkMode ? '' : 'bg-gray-50',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    mutedText: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    buttonBg: isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white'
  };

  // Loading state
  if (loading) {
    return (
      <div 
        className={`min-h-screen ${themeClasses.background} transition-colors duration-300 flex items-center justify-center`}
        style={isDarkMode ? { backgroundColor: '#0F0D0E' } : {}}
      >
        <div className="text-center space-y-4">
          <Loader2 className={`w-12 h-12 ${themeClasses.text} animate-spin mx-auto`} />
          <p className={themeClasses.mutedText}>Loading audio content...</p>
        </div>
      </div>
    );
  }

  // If using static data (fallback), find the audio
  let audioToDisplay;
  
  if (useStaticData) {
    // Use static data as fallback
    const staticAudio = audioContentData.find(item => item.id === parseInt(id || ''));
    if (staticAudio) {
      audioToDisplay = {
        ...staticAudio,
        thumbnail: isDarkMode ? staticAudio.thumbnailNight : staticAudio.thumbnail,
        // Add a local audio file path for static data
        audioUrl: '/assets/box-breathing.mp3' // This would be your local file
      };
    }
  } else if (audioStreamData) {
    // Use API data
    audioToDisplay = {
      id: parseInt(id || '1'),
      title: audioStreamData.content_metadata.title,
      expert: audioStreamData.content_metadata.expert_name,
      expertCredentials: "Mental Health Professional",
      duration: `${Math.floor(audioStreamData.duration_seconds / 60)}:${(audioStreamData.duration_seconds % 60).toString().padStart(2, '0')}`,
      category: audioStreamData.content_metadata.category_name,
      rating: 4.9,
      listens: "0",
      thumbnail: audioStreamData.thumbnail_url || plant4,
      thumbnailNight: audioStreamData.thumbnail_url || plant4Night,
      description: audioStreamData.content_metadata.description,
      fullDescription: audioStreamData.content_metadata.description,
      accessTier: audioStreamData.content_metadata.access_tier as 'free' | 'premium',
      transcript: "Audio transcript will be available soon...",
      benefits: [
        'Reduces anxiety and stress',
        'Improves mental clarity',
        'Promotes relaxation',
        'Evidence-based techniques'
      ],
      // The actual streaming URL from your backend
      audioUrl: audioStreamData.audio_url,
      sessionId: audioStreamData.session_id,
      expiresAt: audioStreamData.expires_at
    };
  }

  // Not found state
  if (!audioToDisplay) {
    return (
      <div 
        className={`min-h-screen ${themeClasses.background} transition-colors duration-300`}
        style={isDarkMode ? { backgroundColor: '#141413' } : {}}
      >
        <div className="absolute top-6 right-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className={`${themeClasses.buttonBg} ${themeClasses.text}`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>

        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className={`text-2xl font-bold ${themeClasses.text} mb-4`}>Audio Not Found</h1>
          <p className={`${themeClasses.mutedText} mb-8`}>The audio session you're looking for doesn't exist.</p>
          <Button 
            onClick={() => navigate('/audio')} 
            variant="outline"
            className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : ''}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Audio Library
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen ${themeClasses.background} transition-colors duration-300`}
      style={isDarkMode ? { backgroundColor: '#0F0D0E' } : {}}
    >
      {/* Dark Mode Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className={`${themeClasses.buttonBg} ${themeClasses.text} rounded-full shadow-lg`}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>

      {/* Back Button */}
      <div className="container mx-auto px-6 pt-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/audio')}
          className={`mb-6 ${themeClasses.buttonBg} ${themeClasses.text}`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Audio Library
        </Button>
      </div>

      <div className="container mx-auto px-6 pb-12">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Warning if using fallback data */}
          {useStaticData && error && (
            <Alert variant="default" className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className={themeClasses.mutedText}>
                {error}. Showing demo content.
              </AlertDescription>
            </Alert>
          )}

          {/* Pass dark mode state to child components */}
          <div className={isDarkMode ? 'dark' : ''}>
            <AudioPlayer 
              audio={audioToDisplay}
              onPlay={handlePlay}
              onPause={handlePause}
            />

            <AudioContent 
              audio={audioToDisplay}
              showTranscript={showTranscript}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default SingleAudioPage;