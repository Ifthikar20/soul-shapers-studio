// src/pages/AudioLibraryPage.tsx - Professional Audio Collection View
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import audioPage1 from '@/assets/audio-page-1.png';
import audioPage2 from '@/assets/audio-page-2.png';

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
  rating: number;
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
  heroImageUrl?: string;
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
    heroImageUrl: audioPage1,
    sessions: [
      {
        id: '1',
        sessionNumber: 1,
        title: 'Introduction to Mindful Breathing',
        description: 'Learn the foundational practice of mindful breathing. Perfect for starting your meditation journey.',
        duration: '5m',
        durationMinutes: 5,
        teacher: 'Dr. Sarah Johnson',
        teacherTitle: 'Clinical Psychologist',
        isLocked: false,
        isCompleted: true,
        isFeatured: true,
        category: 'Beginner',
        gradient: 'from-purple-400 to-indigo-500',
        rating: 4.7
      },
      {
        id: '2',
        sessionNumber: 2,
        title: 'Body Awareness Scan',
        description: 'Release tension and connect with your physical sensations through gentle body scanning.',
        duration: '7m',
        durationMinutes: 7,
        teacher: 'Dr. Sarah Johnson',
        isLocked: false,
        isCompleted: false,
        category: 'Relaxation',
        gradient: 'from-blue-400 to-cyan-500',
        rating: 4.8
      },
      {
        id: '3',
        sessionNumber: 3,
        title: 'Midday Reset',
        description: 'A quick practice to refresh your mind during busy workdays.',
        duration: '3m',
        durationMinutes: 3,
        teacher: 'Dr. Sarah Johnson',
        isLocked: false,
        isCompleted: false,
        category: 'Quick Practice',
        gradient: 'from-teal-400 to-emerald-500',
        rating: 4.6
      },
      {
        id: '4',
        sessionNumber: 4,
        title: 'Evening Wind Down',
        description: 'Prepare your mind and body for restful sleep with this calming practice.',
        duration: '10m',
        durationMinutes: 10,
        teacher: 'Dr. Sarah Johnson',
        isLocked: false,
        isCompleted: false,
        category: 'Sleep',
        gradient: 'from-indigo-400 to-purple-500',
        rating: 4.9
      },
      {
        id: '5',
        sessionNumber: 5,
        title: 'Stress Relief Breathing',
        description: 'Advanced breathing techniques to manage acute stress and anxiety.',
        duration: '6m',
        durationMinutes: 6,
        teacher: 'Dr. Sarah Johnson',
        isLocked: true,
        isCompleted: false,
        category: 'Advanced',
        gradient: 'from-pink-400 to-rose-500',
        rating: 4.7
      },
      {
        id: '6',
        sessionNumber: 6,
        title: 'Loving-Kindness Practice',
        description: 'Cultivate compassion for yourself and others through this gentle meditation.',
        duration: '8m',
        durationMinutes: 8,
        teacher: 'Dr. Sarah Johnson',
        isLocked: true,
        isCompleted: false,
        category: 'Compassion',
        gradient: 'from-orange-400 to-amber-500',
        rating: 4.8
      },
      {
        id: '7',
        sessionNumber: 7,
        title: 'Focus & Concentration',
        description: 'Sharpen your mental clarity and sustained attention with targeted practice.',
        duration: '5m',
        durationMinutes: 5,
        teacher: 'Dr. Sarah Johnson',
        isLocked: true,
        isCompleted: false,
        category: 'Productivity',
        gradient: 'from-violet-400 to-fuchsia-500',
        rating: 4.6
      },
      {
        id: '8',
        sessionNumber: 8,
        title: 'Integration Practice',
        description: 'Bring together all the techniques you have learned into one comprehensive session.',
        duration: '12m',
        durationMinutes: 12,
        teacher: 'Dr. Sarah Johnson',
        isLocked: true,
        isCompleted: false,
        category: 'Integration',
        gradient: 'from-cyan-400 to-blue-500',
        rating: 4.9
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
    heroImageUrl: audioPage2,
    sessions: [
      {
        id: '4',
        sessionNumber: 1,
        title: 'Understanding Your Anxiety',
        description: 'Learn the science behind anxiety and how meditation can help.',
        duration: '10m',
        durationMinutes: 10,
        teacher: 'Dr. Emily Rodriguez',
        isLocked: false,
        isCompleted: false,
        isFeatured: true,
        category: 'Foundation',
        gradient: 'from-teal-400 to-cyan-500',
        rating: 4.8
      },
      {
        id: '5',
        sessionNumber: 2,
        title: 'Grounding Technique',
        description: 'Anchor yourself in the present moment when anxiety strikes.',
        duration: '8m',
        durationMinutes: 8,
        teacher: 'Dr. Emily Rodriguez',
        isLocked: false,
        isCompleted: false,
        category: 'Quick Relief',
        gradient: 'from-blue-400 to-indigo-500',
        rating: 4.7
      },
      {
        id: '6',
        sessionNumber: 3,
        title: 'Breath for Calm',
        description: 'Master breathing patterns that activate your relaxation response.',
        duration: '7m',
        durationMinutes: 7,
        teacher: 'Dr. Emily Rodriguez',
        isLocked: false,
        isCompleted: false,
        category: 'Breathwork',
        gradient: 'from-cyan-400 to-teal-500',
        rating: 4.9
      },
      {
        id: '7',
        sessionNumber: 4,
        title: 'Working with Worried Thoughts',
        description: 'Develop a healthier relationship with anxious thinking patterns.',
        duration: '12m',
        durationMinutes: 12,
        teacher: 'Dr. Emily Rodriguez',
        isLocked: true,
        isCompleted: false,
        category: 'Advanced',
        gradient: 'from-indigo-400 to-purple-500',
        rating: 4.6
      },
      {
        id: '8',
        sessionNumber: 5,
        title: 'Body Relaxation for Anxiety',
        description: 'Release physical tension associated with anxious states.',
        duration: '9m',
        durationMinutes: 9,
        teacher: 'Dr. Emily Rodriguez',
        isLocked: true,
        isCompleted: false,
        category: 'Somatic',
        gradient: 'from-purple-400 to-pink-500',
        rating: 4.8
      },
      {
        id: '9',
        sessionNumber: 6,
        title: 'Long-Term Anxiety Management',
        description: 'Build resilience and create sustainable practices for ongoing peace.',
        duration: '15m',
        durationMinutes: 15,
        teacher: 'Dr. Emily Rodriguez',
        isLocked: true,
        isCompleted: false,
        category: 'Mastery',
        gradient: 'from-teal-400 to-emerald-500',
        rating: 4.7
      }
    ]
  }
};

const AudioLibraryPage = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />

      {/* Main Container */}
      <div className="max-w-[1100px] mx-auto px-5 py-6">

        {/* Hero Banner */}
        <section
          className="relative h-[280px] rounded-2xl overflow-hidden mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
        >
          {collection.heroImageUrl ? (
            <>
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={collection.heroImageUrl}
                  alt={collection.title}
                  className="w-full h-full object-cover object-right"
                />
              </div>

              {/* Gradient fade overlay from left to right */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent"></div>

              {/* Text content on the left */}
              <div className="relative z-10 absolute bottom-7 left-7 max-w-[55%]">
                <h1 className="text-[42px] font-extrabold mb-2.5 tracking-tight text-gray-900">
                  {collection.title}
                </h1>
                <p className="text-sm leading-relaxed text-gray-700">
                  {collection.description}
                </p>
              </div>
            </>
          ) : (
            <>
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, #ff5722 0%, #ff1744 25%, #e91e63 40%, #2196f3 60%, #00bcd4 80%, #ffeb3b 100%)'
                }}
              ></div>
              <div className="absolute bottom-7 left-7 text-white max-w-[500px]">
                <h1 className="text-[42px] font-extrabold mb-2.5 tracking-tight">
                  {collection.title}
                </h1>
                <p className="text-sm leading-relaxed opacity-95">
                  {collection.description}
                </p>
              </div>
            </>
          )}
        </section>

        {/* Series Section */}
        <section>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold tracking-tight">From this series</h2>
          </div>

          {/* Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {collection.sessions.map((session) => (
              <article
                key={session.id}
                className="bg-white rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.08)] cursor-pointer transition-all duration-200 border border-[#f3f4f6] hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)] hover:border-[#e5e7eb]"
                onClick={() => handlePlayAudio(session.id, session.isLocked)}
              >
                {/* Card Image */}
                <div
                  className={`relative h-[200px] bg-gradient-to-br ${session.gradient}`}
                  style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  {/* Lock Icon */}
                  {session.isLocked && (
                    <div className="absolute top-2.5 left-2.5 w-[26px] h-[26px] bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xs">
                      🔒
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-3.5">
                  <h3 className="text-sm font-semibold mb-1.5 text-[#1a1a1a] leading-tight">
                    {session.title}
                  </h3>
                  <p className="text-xs text-[#737373] mb-2">
                    {session.teacher}
                  </p>
                  <div className="flex items-center gap-2.5 text-xs text-[#737373]">
                    <div className="flex items-center gap-1">
                      <span className="text-[#fbbf24] text-[13px]">★</span>
                      <span>{session.rating}</span>
                    </div>
                    <span>• {session.duration}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default AudioLibraryPage;
