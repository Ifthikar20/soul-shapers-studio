// src/pages/AudioLibraryPage.tsx - Individual Audio Collection View
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Clock, Headphones } from 'lucide-react';

interface AudioItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  expert?: string;
  thumbnail?: string;
}

// Sample audio items for each collection
const collectionAudioItems: Record<string, {
  collectionTitle: string;
  collectionDescription: string;
  items: AudioItem[];
}> = {
  'quick-meditations': {
    collectionTitle: 'Quick Meditations',
    collectionDescription: 'Give yourself a moment to breathe with these short, powerful meditations.',
    items: [
      {
        id: '1',
        title: '5-Minute Breathing Exercise',
        description: 'A simple breathing meditation to center yourself.',
        duration: '5:00',
        expert: 'Dr. Sarah Johnson'
      },
      {
        id: '2',
        title: 'Mindful Moment',
        description: 'Quick reset for a busy day.',
        duration: '3:00',
        expert: 'Michael Chen'
      },
      {
        id: '3',
        title: 'Body Scan Basics',
        description: 'Release tension in just minutes.',
        duration: '7:00',
        expert: 'Dr. Sarah Johnson'
      }
    ]
  },
  'calming-anxiety': {
    collectionTitle: 'Calming Everyday Anxiety',
    collectionDescription: 'Get in-the-moment support for anxious thinking.',
    items: [
      {
        id: '4',
        title: 'Anxiety Relief Meditation',
        description: 'Ease anxious thoughts and find calm.',
        duration: '10:00',
        expert: 'Dr. Emily Rodriguez'
      },
      {
        id: '5',
        title: 'Grounding Exercise',
        description: 'Come back to the present moment.',
        duration: '8:00',
        expert: 'James Williams'
      }
    ]
  },
  'mind-matters': {
    collectionTitle: 'Your Mind Matters',
    collectionDescription: 'Manage stress, ease anxiety, and build healthy habits.',
    items: [
      {
        id: '6',
        title: 'Building Mental Resilience',
        description: 'Strengthen your mental wellness foundation.',
        duration: '15:00',
        expert: 'Dr. Lisa Chen'
      },
      {
        id: '7',
        title: 'Daily Stress Management',
        description: 'Tools for handling everyday stress.',
        duration: '12:00',
        expert: 'Dr. Lisa Chen'
      }
    ]
  }
};

const AudioLibraryPage = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();

  // Get collection data or use default
  const collection = collectionAudioItems[collectionId || ''] || {
    collectionTitle: 'Audio Collection',
    collectionDescription: 'Explore our curated audio content.',
    items: []
  };

  const handlePlayAudio = (audioId: string) => {
    navigate(`/audio/${audioId}`);
  };

  const handleBackToLibrary = () => {
    navigate('/audio');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white py-16">
        <div className="container mx-auto px-6">
          <Button
            variant="ghost"
            onClick={handleBackToLibrary}
            className="text-white hover:bg-white/20 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Audio Library
          </Button>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Headphones className="w-4 h-4" />
              <span className="text-sm font-medium">Collection</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {collection.collectionTitle}
            </h1>

            <p className="text-xl text-purple-100">
              {collection.collectionDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Audio Items Grid */}
      <div className="container mx-auto px-6 py-16">
        {collection.items.length === 0 ? (
          <div className="text-center py-16">
            <Headphones className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              No Audio Content Yet
            </h3>
            <p className="text-gray-500 mb-6">
              This collection is being prepared. Check back soon!
            </p>
            <Button onClick={handleBackToLibrary}>
              Browse Other Collections
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collection.items.map((item) => (
              <Card
                key={item.id}
                className="group hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-purple-300"
              >
                <CardContent className="p-6">
                  {/* Thumbnail or Icon */}
                  <div className="w-full aspect-square bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg mb-4 flex items-center justify-center">
                    <Headphones className="w-16 h-16 text-purple-600" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    {item.expert && (
                      <span className="font-medium">{item.expert}</span>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{item.duration}</span>
                    </div>
                  </div>

                  {/* Play Button */}
                  <Button
                    onClick={() => handlePlayAudio(item.id)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Play Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AudioLibraryPage;
