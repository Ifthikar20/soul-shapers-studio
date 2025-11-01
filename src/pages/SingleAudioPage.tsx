// src/pages/SingleAudioPage.tsx - Simple Clean Design
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, X } from 'lucide-react';

// Import plant images
import plant4 from '@/assets/plant4.png';
import plant5 from '@/assets/plant5.png';
import plant7 from '@/assets/plant7.png';
import plant8 from '@/assets/plant8.png';
import plant9 from '@/assets/plant9.png';
import plant10 from '@/assets/plant10.png';

// Dummy audio data
const AUDIO_SESSIONS = {
  '1': {
    id: '1',
    title: 'Introduction to Mindful Breathing',
    description: 'Learn the foundational practice of mindful breathing. Perfect for starting your meditation journey.',
    duration: '5:00',
    expert: 'Dr. Sarah Johnson',
    role: 'Clinical Psychologist',
    category: 'Meditation',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    image: plant4,
    transcript: `Welcome to this mindful breathing practice.

Find a comfortable seated position, with your spine gently upright and your shoulders relaxed.

Begin by taking a few deep breaths, noticing the sensation of air entering and leaving your body.

There's no need to change your breath - simply observe it as it is, natural and effortless.

Notice the gentle rise and fall of your chest and belly with each breath.

If your mind wanders, that's perfectly normal. Simply guide your attention back to your breath.

Continue this practice for the next few minutes, breathing naturally and staying present.`
  },
  '2': {
    id: '2',
    title: 'Body Awareness Scan',
    description: 'Release tension and connect with your physical sensations through gentle body scanning.',
    duration: '7:00',
    expert: 'Dr. Sarah Johnson',
    role: 'Clinical Psychologist',
    category: 'Relaxation',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    image: plant5,
    transcript: `Welcome to this body awareness scan.

Find a comfortable position, either sitting or lying down.

We'll begin by bringing attention to your feet. Notice any sensations - warmth, coolness, tingling, or pressure.

Gradually move your awareness up through your legs, noticing each part of your body.

Release any tension you find, allowing each part to relax completely.

Continue scanning through your torso, arms, and up to the crown of your head.

Take a moment to appreciate your body and all it does for you.`
  },
  '3': {
    id: '3',
    title: 'Midday Reset',
    description: 'A quick practice to refresh your mind during busy workdays.',
    duration: '3:00',
    expert: 'Dr. Sarah Johnson',
    role: 'Clinical Psychologist',
    category: 'Quick Practice',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    image: plant7,
    transcript: `Let's take a quick midday reset.

Close your eyes and take three deep breaths.

Release the stress of the morning and prepare for the afternoon ahead.

Notice how you feel right now - physically and mentally.

Set an intention for the rest of your day.

You're doing great. Let's continue.`
  },
  '4': {
    id: '4',
    title: 'Understanding Your Anxiety',
    description: 'Learn the science behind anxiety and how meditation can help.',
    duration: '10:00',
    expert: 'Dr. Emily Rodriguez',
    role: 'Anxiety Specialist',
    category: 'Anxiety Relief',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    image: plant8,
    transcript: `Welcome to understanding your anxiety.

Anxiety is a natural human response, designed to keep us safe.

However, sometimes this protective mechanism can become overactive.

In this session, we'll explore what happens in your brain when you feel anxious.

You'll learn techniques to work with anxiety rather than against it.

Remember, you're not broken - your nervous system is simply trying to protect you.

Let's begin by acknowledging any anxiety you're feeling right now, without judgment.`
  },
  '5': {
    id: '5',
    title: 'Grounding Technique',
    description: 'Anchor yourself in the present moment when anxiety strikes.',
    duration: '8:00',
    expert: 'Dr. Emily Rodriguez',
    role: 'Anxiety Specialist',
    category: 'Quick Relief',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    image: plant9,
    transcript: `Let's practice a powerful grounding technique.

This exercise uses your five senses to anchor you in the present moment.

Name five things you can see around you.

Four things you can touch or feel.

Three things you can hear.

Two things you can smell.

One thing you can taste.

Notice how you feel more present and grounded in this moment.`
  },
  '6': {
    id: '6',
    title: 'Breath for Calm',
    description: 'Master breathing patterns that activate your relaxation response.',
    duration: '7:00',
    expert: 'Dr. Emily Rodriguez',
    role: 'Anxiety Specialist',
    category: 'Breathwork',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    image: plant10,
    transcript: `Welcome to calming breathwork.

We'll practice a simple but powerful breathing technique.

Breathe in slowly through your nose for a count of four.

Hold for a count of four.

Breathe out through your mouth for a count of six.

The longer exhale activates your body's relaxation response.

Continue this pattern, finding your natural rhythm.`
  },
  '7': {
    id: '7',
    title: 'Working with Worried Thoughts',
    description: 'Develop a healthier relationship with anxious thinking patterns.',
    duration: '12:00',
    expert: 'Dr. Emily Rodriguez',
    role: 'Anxiety Specialist',
    category: 'Advanced',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    image: plant4,
    transcript: `Working with worried thoughts.

Thoughts are not facts - they're mental events that come and go.

Notice your thoughts without getting caught up in them.

Imagine them as clouds passing in the sky.

You can observe them without needing to engage or believe them.

Practice this gentle distance from your thoughts.`
  },
  '8': {
    id: '8',
    title: 'Body Relaxation for Anxiety',
    description: 'Release physical tension associated with anxious states.',
    duration: '9:00',
    expert: 'Dr. Emily Rodriguez',
    role: 'Anxiety Specialist',
    category: 'Somatic',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    image: plant5,
    transcript: `Body relaxation for anxiety.

Anxiety often manifests physically in our bodies.

Let's scan for areas of tension - jaw, shoulders, stomach.

Breathe into these areas with compassion.

As you exhale, imagine releasing the tension.

Your body is safe. You are safe.

Continue breathing and releasing.`
  },
  '9': {
    id: '9',
    title: 'Long-Term Anxiety Management',
    description: 'Build resilience and create sustainable practices for ongoing peace.',
    duration: '15:00',
    expert: 'Dr. Emily Rodriguez',
    role: 'Anxiety Specialist',
    category: 'Mastery',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    image: plant7,
    transcript: `Long-term anxiety management.

Managing anxiety is a journey, not a destination.

You've learned many tools - breathwork, grounding, mindfulness.

The key is consistent practice, even when you feel good.

Build these practices into your daily routine.

Remember to be patient and compassionate with yourself.

You're building new neural pathways, and that takes time.

Trust the process and celebrate small victories.`
  }
};

const SingleAudioPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);

  const audioData = AUDIO_SESSIONS[id || '1'];

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setShowTranscript(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [id]);

  if (!audioData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Audio Not Found</h1>
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

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        setShowTranscript(true);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Close Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => navigate('/audio')}
          className="w-10 h-10 rounded-full bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"
          title="Close"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-12">

          {/* Plant Image and Player Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* Plant Image - Larger and seamless */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <img
                  src={audioData.image}
                  alt={audioData.title}
                  className="w-[28rem] h-[28rem] object-contain transition-transform duration-500 hover:scale-105 opacity-95"
                />
              </div>
            </div>

            {/* Player and Info Section */}
            <div className="space-y-8">

              {/* Audio Player */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-foreground mb-3">
                    {audioData.title}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    {audioData.description}
                  </p>
                </div>

                {/* Play Button and Progress */}
                <div className="space-y-4">
                  <button
                    onClick={togglePlayPause}
                    className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center transition-colors shadow-md"
                  >
                    {isPlaying ? (
                      <Pause className="w-7 h-7 text-primary-foreground fill-primary-foreground" />
                    ) : (
                      <Play className="w-7 h-7 text-primary-foreground ml-0.5 fill-primary-foreground" />
                    )}
                  </button>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transcript Area */}
              {showTranscript && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-xl font-semibold text-foreground">Transcript</h2>
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">
                    {audioData.transcript}
                  </div>
                </div>
              )}

              {/* Info Section */}
              <div className="space-y-4 pt-6 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Guided by</p>
                  <p className="text-xl font-semibold text-foreground">{audioData.expert}</p>
                  <p className="text-muted-foreground">{audioData.role}</p>
                </div>
                <div className="flex gap-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-muted text-muted-foreground">
                    {audioData.category}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-muted text-muted-foreground">
                    {audioData.duration}
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={audioData.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default SingleAudioPage;
