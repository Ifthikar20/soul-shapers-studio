// src/pages/SingleAudioPage.tsx - Main Component with Dark Mode
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AudioPlayer } from '@/components/AudioPlayer';
import { AudioContent } from '@/components/AudioContent';

// Plant images
import plant4 from "@/assets/plant001.png";
import plant4Night from "@/assets/1.png";
import plant5 from "@/assets/plant5.png";

// Audio content data
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

const SingleAudioPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showTranscript, setShowTranscript] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const audio = audioContentData.find(item => item.id === parseInt(id || ''));

  // Create audio object with the appropriate thumbnail based on dark mode
  const audioWithTheme = audio ? {
    ...audio,
    thumbnail: isDarkMode ? audio.thumbnailNight : audio.thumbnail
  } : null;

  const handlePlay = () => {
    setShowTranscript(true);
  };

  const handlePause = () => {
    // Keep transcript visible even when paused
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Define theme classes with custom dark background
  const themeClasses = {
    background: isDarkMode ? '' : 'bg-gray-50', // Empty for dark mode, will use inline style
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    mutedText: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    buttonBg: isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white'
  };

  if (!audioWithTheme) {
    return (
      <div 
        className={`min-h-screen ${themeClasses.background} transition-colors duration-300`}
        style={isDarkMode ? { backgroundColor: '#141413' } : {}}
      >
        {/* Dark Mode Toggle */}
        <div className="absolute top-6 right-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className={`${themeClasses.buttonBg} ${themeClasses.text}`}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
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
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
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
          
          {/* Pass dark mode state to child components if they support it */}
          <div className={isDarkMode ? 'dark' : ''}>
            <AudioPlayer 
              audio={audioWithTheme}
              onPlay={handlePlay}
              onPause={handlePause}
            />

            <AudioContent 
              audio={audioWithTheme}
              showTranscript={showTranscript}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default SingleAudioPage;