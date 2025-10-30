// src/pages/AudioLibraryPage.tsx - Professional Audio Collection View
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Clock, Star, Lock, CheckCircle2 } from 'lucide-react';
import canvasBackground from '@/assets/login-page-canvas.jpg';

interface AudioSession {
  id: string;
  sessionNumber: number;
  title: string;
  description: string;
  duration: string;
  durationMinutes: number;
  teacher: string;
  teacherTitle?: string;
  isLocked: boolean;
  isCompleted: boolean;
  isFeatured?: boolean;
  category?: string;
  gradient: string;
}

interface Collection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  teacher: string;
  teacherBio: string;
  totalSessions: number;
  totalDuration: string;
  category: string;
  heroGradient: string;
  sessions: AudioSession[];
}

// Professional collection data
const collections: Record<string, Collection> = {
  'quick-meditations': {
    id: 'quick-meditations',
    title: 'Quick Meditations',
    subtitle: 'Moments of Calm',
    description: 'Short, powerful practices designed to fit into your busiest days. Perfect for beginners and experienced meditators alike.',
    teacher: 'Dr. Sarah Johnson',
    teacherBio: 'Mindfulness Expert & Clinical Psychologist',
    totalSessions: 8,
    totalDuration: '45 min',
    category: 'Meditation',
    heroGradient: 'from-purple-600 via-purple-700 to-indigo-800',
    sessions: [
      {
        id: '1',
        sessionNumber: 1,
        title: 'Introduction to Mindful Breathing',
        description: 'Learn the foundational practice of mindful breathing. Perfect for starting your meditation journey.',
        duration: '5:00',
        durationMinutes: 5,
        teacher: 'Dr. Sarah Johnson',
        teacherTitle: 'Clinical Psychologist',
        isLocked: false,
        isCompleted: true,
        isFeatured: true,
        category: 'Beginner',
        gradient: 'from-purple-400 to-indigo-500'
      },
      {
        id: '2',
        sessionNumber: 2,
        title: 'Body Awareness Scan',
        description: 'Release tension and connect with your physical sensations through gentle body scanning.',
        duration: '7:00',
        durationMinutes: 7,
        teacher: 'Dr. Sarah Johnson',
        isLocked: false,
        isCompleted: false,
        category: 'Relaxation',
        gradient: 'from-blue-400 to-cyan-500'
      },
      {
        id: '3',
        sessionNumber: 3,
        title: 'Midday Reset',
        description: 'A quick practice to refresh your mind during busy workdays.',
        duration: '3:00',
        durationMinutes: 3,
        teacher: 'Dr. Sarah Johnson',
        isLocked: false,
        isCompleted: false,
        category: 'Quick Practice',
        gradient: 'from-teal-400 to-emerald-500'
      },
      {
        id: '4',
        sessionNumber: 4,
        title: 'Evening Wind Down',
        description: 'Prepare your mind and body for restful sleep with this calming practice.',
        duration: '10:00',
        durationMinutes: 10,
        teacher: 'Dr. Sarah Johnson',
        isLocked: false,
        isCompleted: false,
        category: 'Sleep',
        gradient: 'from-indigo-400 to-purple-500'
      },
      {
        id: '5',
        sessionNumber: 5,
        title: 'Stress Relief Breathing',
        description: 'Advanced breathing techniques to manage acute stress and anxiety.',
        duration: '6:00',
        durationMinutes: 6,
        teacher: 'Dr. Sarah Johnson',
        isLocked: true,
        isCompleted: false,
        category: 'Advanced',
        gradient: 'from-pink-400 to-rose-500'
      },
      {
        id: '6',
        sessionNumber: 6,
        title: 'Loving-Kindness Practice',
        description: 'Cultivate compassion for yourself and others through this gentle meditation.',
        duration: '8:00',
        durationMinutes: 8,
        teacher: 'Dr. Sarah Johnson',
        isLocked: true,
        isCompleted: false,
        category: 'Compassion',
        gradient: 'from-orange-400 to-amber-500'
      },
      {
        id: '7',
        sessionNumber: 7,
        title: 'Focus & Concentration',
        description: 'Sharpen your mental clarity and sustained attention with targeted practice.',
        duration: '5:00',
        durationMinutes: 5,
        teacher: 'Dr. Sarah Johnson',
        isLocked: true,
        isCompleted: false,
        category: 'Productivity',
        gradient: 'from-violet-400 to-fuchsia-500'
      },
      {
        id: '8',
        sessionNumber: 8,
        title: 'Integration Practice',
        description: 'Bring together all the techniques you have learned into one comprehensive session.',
        duration: '12:00',
        durationMinutes: 12,
        teacher: 'Dr. Sarah Johnson',
        isLocked: true,
        isCompleted: false,
        category: 'Integration',
        gradient: 'from-cyan-400 to-blue-500'
      }
    ]
  },
  'calming-anxiety': {
    id: 'calming-anxiety',
    title: 'Calming Everyday Anxiety',
    subtitle: 'Find Your Peace',
    description: 'Evidence-based techniques to manage anxiety and find calm in challenging moments.',
    teacher: 'Dr. Emily Rodriguez',
    teacherBio: 'Anxiety Specialist & Meditation Teacher',
    totalSessions: 6,
    totalDuration: '52 min',
    category: 'Anxiety Relief',
    heroGradient: 'from-teal-600 via-cyan-700 to-blue-800',
    sessions: [
      {
        id: '4',
        sessionNumber: 1,
        title: 'Understanding Your Anxiety',
        description: 'Learn the science behind anxiety and how meditation can help.',
        duration: '10:00',
        durationMinutes: 10,
        teacher: 'Dr. Emily Rodriguez',
        isLocked: false,
        isCompleted: false,
        isFeatured: true,
        category: 'Foundation',
        gradient: 'from-teal-400 to-cyan-500'
      },
      {
        id: '5',
        sessionNumber: 2,
        title: 'Grounding Technique',
        description: 'Anchor yourself in the present moment when anxiety strikes.',
        duration: '8:00',
        durationMinutes: 8,
        teacher: 'Dr. Emily Rodriguez',
        isLocked: false,
        isCompleted: false,
        category: 'Quick Relief',
        gradient: 'from-blue-400 to-indigo-500'
      },
      {
        id: '6',
        sessionNumber: 3,
        title: 'Breath for Calm',
        description: 'Master breathing patterns that activate your relaxation response.',
        duration: '7:00',
        durationMinutes: 7,
        teacher: 'Dr. Emily Rodriguez',
        isLocked: false,
        isCompleted: false,
        category: 'Breathwork',
        gradient: 'from-cyan-400 to-teal-500'
      },
      {
        id: '7',
        sessionNumber: 4,
        title: 'Working with Worried Thoughts',
        description: 'Develop a healthier relationship with anxious thinking patterns.',
        duration: '12:00',
        durationMinutes: 12,
        teacher: 'Dr. Emily Rodriguez',
        isLocked: true,
        isCompleted: false,
        category: 'Advanced',
        gradient: 'from-indigo-400 to-purple-500'
      },
      {
        id: '8',
        sessionNumber: 5,
        title: 'Body Relaxation for Anxiety',
        description: 'Release physical tension associated with anxious states.',
        duration: '9:00',
        durationMinutes: 9,
        teacher: 'Dr. Emily Rodriguez',
        isLocked: true,
        isCompleted: false,
        category: 'Somatic',
        gradient: 'from-purple-400 to-pink-500'
      },
      {
        id: '9',
        sessionNumber: 6,
        title: 'Long-Term Anxiety Management',
        description: 'Build resilience and create sustainable practices for ongoing peace.',
        duration: '15:00',
        durationMinutes: 15,
        teacher: 'Dr. Emily Rodriguez',
        isLocked: true,
        isCompleted: false,
        category: 'Mastery',
        gradient: 'from-teal-400 to-emerald-500'
      }
    ]
  }
};

const AudioLibraryPage = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  const [hoveredSession, setHoveredSession] = useState<string | null>(null);

  const collection = collections[collectionId || ''] || null;

  const handlePlayAudio = (sessionId: string, isLocked: boolean) => {
    if (isLocked) {
      navigate('/upgrade');
      return;
    }
    navigate(`/audio/${sessionId}`);
  };

  const handleBackToLibrary = () => {
    navigate('/audio');
  };

  if (!collection) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-6 py-32 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Collection Not Found</h1>
          <p className="text-gray-600 mb-8">This audio collection doesn't exist yet.</p>
          <Button onClick={handleBackToLibrary}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const featuredSession = collection.sessions.find(s => s.isFeatured);
  const regularSessions = collection.sessions.filter(s => !s.isFeatured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      {/* Hero Section with Background Image */}
      <div
        className={`relative bg-gradient-to-br ${collection.heroGradient} text-white overflow-hidden`}
        style={{
          backgroundImage: `url(${canvasBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50"></div>

        <div className="relative container mx-auto px-6 py-12 md:py-20">
          {/* Back Button */}
          <button
            onClick={handleBackToLibrary}
            className="group flex items-center gap-2 text-white/90 hover:text-white mb-8 transition-all"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Library</span>
          </button>

          <div className="max-w-3xl">
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-4 border border-white/30">
              <Star className="w-4 h-4" />
              <span className="text-sm font-semibold">{collection.category}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold mb-3 leading-tight">
              {collection.title}
            </h1>
            <p className="text-2xl md:text-3xl text-white/90 font-light mb-6">
              {collection.subtitle}
            </p>

            {/* Description */}
            <p className="text-lg text-white/90 leading-relaxed mb-8 max-w-2xl">
              {collection.description}
            </p>

            {/* Teacher Info */}
            <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center border-2 border-white/40">
                <span className="text-2xl font-bold">{collection.teacher.charAt(0)}</span>
              </div>
              <div>
                <p className="font-semibold text-lg">{collection.teacher}</p>
                <p className="text-white/80 text-sm">{collection.teacherBio}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-6">
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5 text-white/80" />
                <span className="text-white/90">{collection.totalSessions} Sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-white/80" />
                <span className="text-white/90">{collection.totalDuration} Total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 -mt-12 relative z-10 pb-20">

        {/* Featured Session */}
        {featuredSession && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Start Here</h2>
            <div
              className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
              onClick={() => handlePlayAudio(featuredSession.id, featuredSession.isLocked)}
              onMouseEnter={() => setHoveredSession(featuredSession.id)}
              onMouseLeave={() => setHoveredSession(null)}
            >
              <div className="flex flex-col md:flex-row">
                {/* Image/Gradient */}
                <div className={`relative w-full md:w-64 h-48 md:h-auto bg-gradient-to-br ${featuredSession.gradient} flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/40 group-hover:scale-110 transition-transform">
                      {featuredSession.isLocked ? (
                        <Lock className="w-10 h-10 text-white" />
                      ) : (
                        <Play className="w-10 h-10 text-white fill-white" />
                      )}
                    </div>
                  </div>
                  <Badge className="absolute top-4 right-4 bg-white text-purple-700 hover:bg-white font-semibold">
                    Featured
                  </Badge>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 md:p-8">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="text-xs">
                          Session {featuredSession.sessionNumber}
                        </Badge>
                        <Badge className={`text-xs bg-gradient-to-r ${featuredSession.gradient} border-0 text-white`}>
                          {featuredSession.category}
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
                        {featuredSession.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed mb-4">
                    {featuredSession.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{featuredSession.duration}</span>
                      </div>
                      <span>•</span>
                      <span>{featuredSession.teacher}</span>
                    </div>
                    {featuredSession.isCompleted && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Sessions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Sessions</h2>
          <div className="space-y-4">
            {regularSessions.map((session) => (
              <div
                key={session.id}
                className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
                onClick={() => handlePlayAudio(session.id, session.isLocked)}
                onMouseEnter={() => setHoveredSession(session.id)}
                onMouseLeave={() => setHoveredSession(null)}
              >
                <div className="flex items-center">
                  {/* Session Number & Play Button */}
                  <div className={`relative w-32 h-32 flex-shrink-0 bg-gradient-to-br ${session.gradient} flex flex-col items-center justify-center`}>
                    <div className="absolute inset-0 bg-black/5"></div>
                    <span className="relative text-white/60 text-sm font-semibold mb-1">Session</span>
                    <span className="relative text-white text-3xl font-bold">{session.sessionNumber}</span>
                    <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${hoveredSession === session.id ? 'opacity-100' : 'opacity-0'}`}>
                      {session.isLocked ? (
                        <Lock className="w-8 h-8 text-white" />
                      ) : (
                        <Play className="w-8 h-8 text-white fill-white" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`text-xs bg-gradient-to-r ${session.gradient} border-0 text-white`}>
                            {session.category}
                          </Badge>
                          {session.isLocked && (
                            <Badge variant="secondary" className="text-xs">
                              <Lock className="w-3 h-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {session.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      {session.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{session.duration}</span>
                      </div>
                      {session.isCompleted && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-xs font-medium">Completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AudioLibraryPage;
