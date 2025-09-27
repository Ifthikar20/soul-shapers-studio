// src/pages/SingleAudioPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Share2, Heart, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Plant images
import plant4 from "@/assets/plant4.png";
import plant5 from "@/assets/plant5.png";
import plant6 from "@/assets/plant6.png";
import plant7 from "@/assets/plant7.png";
import plant8 from "@/assets/plant8.png";
import plant9 from "@/assets/plant9.png";
import plant10 from "@/assets/plant10.png";
import plant11 from "@/assets/plant11.png";

// Audio content data (same as AudioPage)
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
    fullDescription: "A gentle morning meditation designed to help you release anxiety and set positive intentions for the day ahead. This practice combines mindful breathing with body awareness to create a foundation of peace for your entire day.",
    accessTier: 'free' as const,
    transcript: `Welcome to your morning meditation for anxiety relief. Find a comfortable seated position and gently close your eyes.

Take a deep breath in through your nose... hold for a moment... and slowly exhale through your mouth.

Feel your chest rise and fall naturally. There's no rush, no pressure. Just breathe.

Notice any tension in your shoulders. Let them drop and soften. Feel your jaw relax.

Inhale peace and calm... exhale worry and tension. Let each breath bring you deeper into this moment of tranquility.

Continue breathing at your own pace. You are safe, you are present, you are enough.`,
    benefits: [
      'Reduces morning anxiety and stress',
      'Improves focus and mental clarity',
      'Promotes emotional balance throughout the day',
      'Establishes a positive morning routine'
    ],
    whoItHelps: [
      'Anyone experiencing morning anxiety',
      'People with racing thoughts upon waking',
      'Those seeking a calmer start to their day',
      'Beginners to meditation practice'
    ]
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
    fullDescription: "Professionally crafted sleep stories that guide your mind into relaxation and prepare you for restorative sleep. These gentle narratives help quiet mental chatter and ease you into deep, restful sleep.",
    accessTier: 'premium' as const,
    transcript: `Welcome to your sleep story. Settle into your most comfortable position and let your body sink into relaxation.

Imagine yourself in a peaceful meadow at twilight. The sky is painted in soft purples and pinks.

A gentle breeze carries the scent of lavender as you walk along a winding path.

Each step takes you deeper into tranquility. Your breathing becomes slower and more peaceful.

The stars begin to twinkle overhead, like tiny lights guiding you toward rest.

Allow yourself to drift... deeper... into peaceful sleep.`,
    benefits: [
      'Promotes deep, restorative sleep',
      'Reduces bedtime anxiety and racing thoughts',
      'Creates a calming bedtime routine',
      'Improves overall sleep quality'
    ],
    whoItHelps: [
      'People with insomnia or sleep difficulties',
      'Those with bedtime anxiety',
      'Adults who enjoyed bedtime stories as children',
      'Anyone seeking better sleep quality'
    ]
  },
  // Add more audio content as needed...
];

// Audio Player Component
interface AudioPlayerProps {
  audio: any;
  onPlay?: () => void;
  onPause?: () => void;
  onProgressChange?: (progress: number) => void;
}

const AudioPlayer = ({ audio, onPlay, onPause, onProgressChange }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState([0]);
  const [showTranscript, setShowTranscript] = useState(false);
  
  // Convert duration string to seconds
  const durationParts = audio.duration.split(':');
  const duration = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      onPause?.();
    } else {
      setIsPlaying(true);
      onPlay?.();
      setShowTranscript(true);
    }
  };

  const handleProgressChange = (value: number[]) => {
    setProgress(value);
    onProgressChange?.(value[0]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = (progress[0] / 100) * duration;

  return (
    <div className="space-y-8">
      {/* Audio Thumbnail and Info */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-48 h-48 rounded-3xl overflow-hidden shadow-lg">
          <img 
            src={audio.thumbnail} 
            alt={audio.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">
            {audio.title}
          </h1>
          <p className="text-muted-foreground">
            {audio.description}
          </p>
          <p className="text-sm text-muted-foreground">
            Guided by {audio.expert}
          </p>
        </div>
      </div>

      {/* Play Controls */}
      <div className="flex flex-col items-center space-y-6">
        <Button
          onClick={handleTogglePlay}
          size="lg"
          className="w-20 h-20 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8 ml-1" />
          )}
        </Button>

        {/* Progress Bar */}
        <div className="w-full max-w-md space-y-3">
          <Slider
            value={progress}
            onValueChange={handleProgressChange}
            max={100}
            step={1}
            className="w-full"
          />
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button variant="outline" size="sm">
            <Heart className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Transcript */}
      <div className="max-w-2xl mx-auto">
        <TranscriptArea 
          isVisible={showTranscript} 
          transcript={audio.transcript}
        />
      </div>
    </div>
  );
};

// Audio Info Component
interface AudioInfoProps {
  audio: any;
  className?: string;
}

const AudioInfo = ({ audio, className = "" }: AudioInfoProps) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Description */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">About This Session</h3>
        <p className="text-foreground/80 leading-relaxed">
          {audio.fullDescription}
        </p>
      </div>
      
      {/* Session Details */}
      <div className="grid md:grid-cols-2 gap-6 text-sm">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Duration</h4>
            <p className="text-muted-foreground">{audio.duration} of guided audio</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Expert</h4>
            <p className="text-muted-foreground">{audio.expert}</p>
            <p className="text-xs text-muted-foreground">{audio.expertCredentials}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Category</h4>
            <Badge variant="outline">{audio.category}</Badge>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Listeners</h4>
            <p className="text-muted-foreground">{audio.listens} people have found this helpful</p>
          </div>
        </div>
      </div>
      
      {/* Benefits */}
      <div className="space-y-3">
        <h4 className="font-medium text-foreground">Benefits</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          {audio.benefits?.map((benefit: string, index: number) => (
            <li key={index}>• {benefit}</li>
          ))}
        </ul>
      </div>

      {/* Who It Helps */}
      <div className="space-y-3">
        <h4 className="font-medium text-foreground">Perfect For</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          {audio.whoItHelps?.map((person: string, index: number) => (
            <li key={index}>• {person}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Transcript Component
interface TranscriptAreaProps {
  isVisible?: boolean;
  transcript?: string;
}

const TranscriptArea = ({ isVisible = false, transcript }: TranscriptAreaProps) => {
  if (!isVisible) {
    return (
      <div className="p-4 bg-transparent">
        <div className="text-center text-muted-foreground/60">
          <p className="text-sm">Transcript will appear here when audio begins</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground/80">
        Audio Transcript
      </h3>
      <ScrollArea className="h-40 w-full rounded-md p-4 bg-gray-50">
        <div className="text-sm text-foreground/70 leading-relaxed whitespace-pre-line">
          {transcript}
        </div>
      </ScrollArea>
    </div>
  );
};

// Main Single Audio Page
const SingleAudioPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'player' | 'info'>('player');

  // Find the audio content by ID
  const audio = audioContentData.find(item => item.id === parseInt(id || ''));

  // Handle case where audio is not found
  if (!audio) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Audio Not Found</h1>
          <p className="text-gray-600 mb-8">The audio session you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/audio')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Audio Library
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/audio')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Audio Library
        </Button>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-sm">
              <Button
                variant={activeTab === 'player' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('player')}
                className="rounded-md"
              >
                Audio Player
              </Button>
              <Button
                variant={activeTab === 'info' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('info')}
                className="rounded-md"
              >
                Session Info
              </Button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {activeTab === 'player' ? (
              <AudioPlayer audio={audio} />
            ) : (
              <AudioInfo audio={audio} />
            )}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SingleAudioPage;