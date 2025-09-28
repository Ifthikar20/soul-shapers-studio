// src/pages/SingleAudioPage.tsx - Main Component
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AudioPlayer } from '@/components/AudioPlayer';
import { AudioContent } from '@/components/AudioContent';

// Plant images
import plant4 from "@/assets/plant4.png";
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

  const audio = audioContentData.find(item => item.id === parseInt(id || ''));

  const handlePlay = () => {
    setShowTranscript(true);
  };

  const handlePause = () => {
    // Keep transcript visible even when paused
  };

  if (!audio) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Audio Not Found</h1>
          <p className="text-muted-foreground mb-8">The audio session you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/audio')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Audio Library
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-6 pt-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/audio')}
          className="mb-6 hover:bg-wellness-soft/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Audio Library
        </Button>
      </div>

      <div className="container mx-auto px-6 pb-12">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <AudioPlayer 
            audio={audio}
            onPlay={handlePlay}
            onPause={handlePause}
          />

          <AudioContent 
            audio={audio}
            showTranscript={showTranscript}
          />

        </div>
      </div>
    </div>
  );
};

export default SingleAudioPage;