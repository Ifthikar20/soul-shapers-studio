import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/Layout/PageLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Pause, Volume2, Music } from 'lucide-react';

const SoundDetailPage: React.FC = () => {
  const { soundId } = useParams<{ soundId: string }>();
  const navigate = useNavigate();

  // Map sound IDs to display names
  const soundTitles: Record<string, string> = {
    'ocean-waves': 'Ocean Waves',
    'flowing-river': 'Flowing River',
    'forest-stream': 'Forest Stream',
    'rain-sounds': 'Gentle Rain',
    'plants-germinating': 'Plants Germinating',
    'nature-ambience': 'Nature Ambience',
  };

  const soundTitle = soundId ? soundTitles[soundId] || 'Unknown Sound' : 'Unknown Sound';

  return (
    <>
      <Header />
      <PageLayout hasHero={false}>
        <div className="max-w-4xl mx-auto py-12 px-4">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/meditate')}
            className="mb-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Calming Sounds
          </Button>

          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
                <Music className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {soundTitle}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              This feature is coming soon
            </p>
          </div>

          {/* Placeholder Content */}
          <Card className="p-12 text-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
            <Volume2 className="w-16 h-16 mx-auto mb-6 text-purple-500 dark:text-purple-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Audio Player Coming Soon
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              We're currently building an immersive audio experience for <strong>{soundTitle}</strong>.
              Soon you'll be able to listen to this calming sound, adjust playback settings,
              and create your own personalized meditation sessions.
            </p>

            <div className="flex justify-center gap-4 mb-8">
              <Button
                disabled
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              >
                <Play className="w-4 h-4 mr-2" />
                Play (Coming Soon)
              </Button>
              <Button disabled variant="outline">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            </div>

            <div className="pt-6 border-t border-purple-200 dark:border-purple-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This page will include:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>High-quality audio playback</li>
                <li>Volume and playback controls</li>
                <li>Loop and timer options</li>
                <li>Background playback support</li>
              </ul>
            </div>
          </Card>

          {/* Back to Library Button */}
          <div className="mt-8 text-center">
            <Button
              onClick={() => navigate('/meditate')}
              variant="outline"
              className="border-gray-700 dark:border-gray-600"
            >
              Explore Other Sounds
            </Button>
          </div>
        </div>
      </PageLayout>
      <Footer />
    </>
  );
};

export default SoundDetailPage;
