// src/pages/SingleAudioPage.tsx - Beautiful Plant Image Design
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, X, ChevronDown, ChevronUp, Volume2 } from 'lucide-react';

// Import plant images
import plant4 from '@/assets/plant4.png';
import plant5 from '@/assets/plant5.png';
import plant7 from '@/assets/plant7.png';
import plant8 from '@/assets/plant8.png';
import plant9 from '@/assets/plant9.png';
import plant10 from '@/assets/plant10.png';

// Plant images array for rotating through
const plantImages = [plant4, plant5, plant7, plant8, plant9, plant10];

// Dummy audio data
const AUDIO_SESSIONS = {
  '1': {
    id: '1',
    title: 'Introduction to Mindful Breathing',
    description: 'Learn the foundational practice of mindful breathing. Perfect for starting your meditation journey. This guided session will help you develop awareness of your breath and cultivate inner calm.',
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
    description: 'Release tension and connect with your physical sensations through gentle body scanning. This practice helps you develop deeper body awareness and release stored tension.',
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
    description: 'A quick practice to refresh your mind during busy workdays. Perfect for a midday reset to restore focus and energy.',
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
    description: 'Learn the science behind anxiety and how meditation can help. This comprehensive session explores the neuroscience of anxiety and provides practical tools for managing anxious thoughts and feelings.',
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
    description: 'Anchor yourself in the present moment when anxiety strikes. Learn powerful grounding techniques to bring yourself back to center during moments of overwhelm.',
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
    description: 'Master breathing patterns that activate your relaxation response. Discover specific breathing techniques proven to calm the nervous system and reduce anxiety.',
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
    description: 'Develop a healthier relationship with anxious thinking patterns. Learn cognitive techniques to observe, challenge, and reframe worry-based thoughts.',
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
    description: 'Release physical tension associated with anxious states. This somatic practice helps you identify and release the physical manifestations of anxiety stored in your body.',
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
    description: 'Build resilience and create sustainable practices for ongoing peace. This comprehensive session brings together all the techniques you\'ve learned to create a long-term anxiety management plan.',
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
    // Reset audio when ID changes
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [id]);

  if (!audioData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Audio Not Found</h1>
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
    <div className="min-h-screen bg-gray-50">
      {/* Close Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => navigate('/audio')}
          className="w-12 h-12 rounded-full bg-white hover:bg-gray-100 shadow-lg flex items-center justify-center transition-colors"
          title="Close"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-7xl mx-auto">

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">

            {/* Left Side - Plant Image with Play Button */}
            <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-white group">
              <img
                src={audioData.image}
                alt={audioData.title}
                className="w-full h-full object-contain"
              />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                  onClick={togglePlayPause}
                  className="w-24 h-24 rounded-full bg-white/95 hover:bg-white transition-all shadow-2xl flex items-center justify-center group/play"
                >
                  {isPlaying ? (
                    <Pause className="w-10 h-10 text-purple-600 fill-purple-600 group-hover/play:scale-110 transition-transform" />
                  ) : (
                    <Play className="w-10 h-10 text-purple-600 ml-1 fill-purple-600 group-hover/play:scale-110 transition-transform" />
                  )}
                </button>
              </div>

              {/* Duration Badge */}
              <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                {audioData.duration}
              </div>

              {/* Category Badge */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full text-sm font-medium">
                {audioData.category}
              </div>
            </div>

            {/* Right Side - Audio Details */}
            <div className="bg-white p-12 rounded-2xl shadow-lg">

              {/* Audio Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {audioData.title}
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {audioData.description}
              </p>

              {/* Divider */}
              <div className="h-px bg-gray-200 mb-8" />

              {/* Expert Info */}
              <div className="mb-8">
                <p className="text-sm text-gray-500 mb-1">Guided by</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {audioData.expert}
                </p>
                <p className="text-gray-600 text-lg">
                  {audioData.role}
                </p>
              </div>

              {/* Audio Player */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={togglePlayPause}
                    className="w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors flex items-center justify-center shadow-lg"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white fill-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white ml-0.5 fill-white" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600"
                    />
                  </div>
                  <Volume2 className="w-5 h-5 text-gray-600" />
                </div>
              </div>
            </div>

          </div>

          {/* Transcript Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  {showTranscript ? (
                    <ChevronUp className="w-5 h-5 text-purple-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-purple-600" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Transcript</h2>
              </div>
              <span className="text-sm text-gray-500">
                {showTranscript ? 'Hide' : 'Show'}
              </span>
            </button>

            {showTranscript && (
              <div className="px-6 pb-6">
                <div className="h-px bg-gray-200 mb-6" />
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {audioData.transcript}
                  </p>
                </div>
              </div>
            )}
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
