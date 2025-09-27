// src/pages/SingleAudioPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
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
    fullDescription: "Slow, relaxed breaths can always serve as your anchor to the present moment. Try this guided meditation whenever emotions are running high.",
    accessTier: 'free' as const,
    transcript: `Welcome to your morning meditation for anxiety relief. Find a comfortable seated position and gently close your eyes.

Take a deep breath in through your nose... hold for a moment... and slowly exhale through your mouth.

Feel your chest rise and fall naturally. There's no rush, no pressure. Just breathe.

Notice any tension in your shoulders. Let them drop and soften. Feel your jaw relax.

Inhale peace and calm... exhale worry and tension. Let each breath bring you deeper into this moment of tranquility.

Continue breathing at your own pace. You are safe, you are present, you are enough.`,
    durationText: "12 minutes of guided meditation",
    whoItHelps: "Anyone experiencing anxiety, stress, or needing a moment of calm",
    benefits: [
      'Reduces stress and anxiety',
      'Improves focus and mental clarity', 
      'Promotes relaxation and emotional balance'
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
    fullDescription: "Gentle sleep stories can guide your mind into relaxation and prepare you for restorative sleep. Listen to these calming narratives whenever you need help falling asleep.",
    accessTier: 'premium' as const,
    transcript: `Welcome to your sleep story. Settle into your most comfortable position and let your body sink into relaxation.

Imagine yourself in a peaceful meadow at twilight. The sky is painted in soft purples and pinks.

A gentle breeze carries the scent of lavender as you walk along a winding path.

Each step takes you deeper into tranquility. Your breathing becomes slower and more peaceful.

The stars begin to twinkle overhead, like tiny lights guiding you toward rest.

Allow yourself to drift... deeper... into peaceful sleep.`,
    durationText: "25 minutes of sleep stories",
    whoItHelps: "Anyone experiencing insomnia, restless nights, or bedtime anxiety",
    benefits: [
      'Promotes deep, restorative sleep',
      'Reduces bedtime anxiety and racing thoughts',
      'Creates a calming bedtime routine'
    ]
  },
  {
    id: 3,
    title: "Breathing Techniques for Stress",
    expert: "Dr. Michael Park",
    expertCredentials: "Mindfulness Coach",
    duration: "8:15",
    category: "Breathwork",
    rating: 4.7,
    listens: "12.4k",
    thumbnail: plant6,
    description: "Learn powerful breathing techniques to manage stress in real-time.",
    fullDescription: "Focused breathing exercises can instantly calm your nervous system and bring you back to center. Practice these techniques whenever you feel overwhelmed.",
    accessTier: 'free' as const,
    transcript: `Welcome to your breathing exercise for stress relief. Find a comfortable position and close your eyes if that feels good.

We'll start with a simple 4-7-8 breathing pattern. Inhale for 4 counts... hold for 7... exhale for 8.

Breathe in through your nose... 1, 2, 3, 4... hold... 1, 2, 3, 4, 5, 6, 7... and exhale slowly through your mouth... 1, 2, 3, 4, 5, 6, 7, 8.

Feel your body relaxing with each breath. Let go of any tension you're holding.

Continue this pattern at your own pace. You are creating space for calm in your body and mind.`,
    durationText: "8 minutes of guided breathing",
    whoItHelps: "Anyone experiencing stress, panic, or needing quick relief",
    benefits: [
      'Quickly reduces stress and anxiety',
      'Activates the parasympathetic nervous system',
      'Can be used anywhere, anytime'
    ]
  }
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
  const [progress, setProgress] = useState([25]); // Start at 25% like the example
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-8">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Audio Library
        </Button>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Main Content - Plant Image Left, Player Right */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            
            {/* Left Side - Plant Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-80 h-80">
                <img 
                  src={audio.thumbnail} 
                  alt={audio.title}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Right Side - Audio Player */}
            <div className="space-y-8">
              {/* Title and Description */}
              <div className="text-center lg:text-left space-y-4">
                <h1 className="text-3xl font-semibold text-foreground">
                  {audio.title}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {audio.description}
                </p>
              </div>

              {/* Play Button */}
              <div className="flex justify-center lg:justify-start">
                <Button
                  onClick={handleTogglePlay}
                  size="lg"
                  className="w-20 h-20 rounded-full bg-green-500 text-white hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8 ml-1" />
                  )}
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-3">
                <Slider
                  value={progress}
                  onValueChange={handleProgressChange}
                  max={100}
                  step={1}
                  className="w-full"
                />
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{audio.duration}</span>
                </div>
              </div>

              {/* Transcript Placeholder */}
              <div className="text-center text-muted-foreground/60 py-4">
                <p className="text-sm">
                  {showTranscript ? "Transcript available below" : "Transcript will appear here when audio begins"}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Section - Description and Info */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <div className="max-w-4xl mx-auto space-y-8">
              
              {/* Main Description */}
              <div className="space-y-3">
                <p className="text-foreground/80 leading-relaxed text-lg">
                  {audio.fullDescription}
                </p>
              </div>
              
              {/* Session Details */}
              <div className="grid md:grid-cols-2 gap-8 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Duration</h4>
                  <p className="text-muted-foreground">{audio.durationText}</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Who Benefits</h4>
                  <p className="text-muted-foreground">{audio.whoItHelps}</p>
                </div>
              </div>
              
              {/* Benefits */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Benefits</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {audio.benefits?.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Transcript Section */}
          {showTranscript && (
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Audio Transcript
                </h3>
                <ScrollArea className="h-60 w-full rounded-md p-4 bg-gray-50">
                  <div className="text-sm text-foreground/70 leading-relaxed whitespace-pre-line">
                    {audio.transcript}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
};

// Main Single Audio Page
const SingleAudioPage = () => {
  const { id } = useParams();

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
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return <AudioPlayer audio={audio} />;
};

export default SingleAudioPage;