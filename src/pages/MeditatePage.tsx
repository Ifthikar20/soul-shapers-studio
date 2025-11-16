import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/Layout/PageLayout';
import { Card } from '@/components/ui/card';
import { Waves, Wind, Droplets, Leaf, Music, Sparkles } from 'lucide-react';

interface CalmingSoundCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  iconColor: string;
}

const MeditatePage: React.FC = () => {
  const navigate = useNavigate();

  const calmingSounds: CalmingSoundCard[] = [
    {
      id: 'ocean-waves',
      title: 'Ocean Waves',
      description: 'Immerse yourself in sunset waves gently lapping against golden shores',
      icon: <Waves className="w-12 h-12" />,
      gradient: 'from-blue-500 to-cyan-500',
      iconColor: 'text-blue-100',
    },
    {
      id: 'flowing-river',
      title: 'Flowing River',
      description: 'Experience the peaceful flow of a crystal-clear river through nature',
      icon: <Droplets className="w-12 h-12" />,
      gradient: 'from-teal-500 to-emerald-500',
      iconColor: 'text-teal-100',
    },
    {
      id: 'forest-stream',
      title: 'Forest Stream',
      description: 'Lose yourself in the gentle sounds of water cascading over forest rocks',
      icon: <Sparkles className="w-12 h-12" />,
      gradient: 'from-green-500 to-teal-500',
      iconColor: 'text-green-100',
    },
    {
      id: 'rain-sounds',
      title: 'Gentle Rain',
      description: 'Let soft rainfall wash away your stress in this calming scene',
      icon: <Wind className="w-12 h-12" />,
      gradient: 'from-slate-500 to-blue-500',
      iconColor: 'text-slate-100',
    },
    {
      id: 'plants-germinating',
      title: 'Plants Germinating',
      description: 'Witness the quiet beauty and wonder of life emerging and growing',
      icon: <Leaf className="w-12 h-12" />,
      gradient: 'from-lime-500 to-green-500',
      iconColor: 'text-lime-100',
    },
    {
      id: 'nature-ambience',
      title: 'Nature Ambience',
      description: 'A harmonious blend of natural scenes for profound relaxation',
      icon: <Music className="w-12 h-12" />,
      gradient: 'from-purple-500 to-pink-500',
      iconColor: 'text-purple-100',
    },
  ];

  const handleSoundClick = (soundId: string) => {
    // Navigate to a placeholder page - will be implemented later
    navigate(`/meditate/${soundId}`);
  };

  return (
    <>
      <Header />
      <PageLayout hasHero={false}>
        <div className="max-w-7xl mx-auto py-12 px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Immersive Meditation
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Escape into beautiful, calming scenes from nature. Each experience features
              a fullscreen video with ambient sounds to help you relax and find inner peace.
            </p>
          </div>

          {/* Calming Sounds Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calmingSounds.map((sound) => (
              <Card
                key={sound.id}
                onClick={() => handleSoundClick(sound.id)}
                className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${sound.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                {/* Card Content */}
                <div className="relative p-8">
                  {/* Icon Container */}
                  <div
                    className={`mb-6 w-20 h-20 rounded-full bg-gradient-to-br ${sound.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className={sound.iconColor}>{sound.icon}</div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300">
                    {sound.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {sound.description}
                  </p>

                  {/* Hover Indicator */}
                  <div className="mt-6 flex items-center text-sm font-medium text-gray-500 dark:text-gray-500 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors duration-300">
                    <span>Click to experience</span>
                    <svg
                      className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Additional Info Section */}
          <div className="mt-16 text-center">
            <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Immersive Video Meditation
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Each experience takes you on a visual journey with beautiful nature scenes and ambient sounds.
                The fullscreen video creates an immersive environment that helps you disconnect from stress
                and reconnect with peace. Simply click, press play, and let the calming visuals and sounds
                wash over you.
              </p>
            </Card>
          </div>
        </div>
      </PageLayout>
      <Footer />
    </>
  );
};

export default MeditatePage;
