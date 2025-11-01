// src/pages/AudioPage.tsx - Topic Landing Page
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Headphones, ArrowRight } from 'lucide-react';
import canvasBackground from '@/assets/login-page-canvas.jpg';
import audioPage1 from '@/assets/audio-page-1.png';
import audioPage2 from '@/assets/audio-page-2.png';

interface AudioTopic {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
}

const audioTopics: AudioTopic[] = [
  {
    id: 'quick-meditations',
    title: 'Quick Meditations',
    description: 'Give yourself a moment to breathe.',
    category: 'meditation',
    imageUrl: audioPage1
  },
  {
    id: 'calming-anxiety',
    title: 'Calming Everyday Anxiety',
    description: 'Get in-the-moment support for anxious thinking.',
    category: 'anxiety',
    imageUrl: audioPage2
  },
  {
    id: 'mind-matters',
    title: 'Your Mind Matters',
    description: 'Manage stress, ease anxiety, and build healthy habits.',
    category: 'wellness'
  },
  {
    id: 'timers',
    title: 'Timers',
    description: 'Choose a length and press play. Guided or unguided.',
    category: 'practice'
  },
  {
    id: 'guided-breathwork',
    title: 'Guided Breathwork',
    description: 'Simple breathing techniques to relax your mind and body.',
    category: 'breathwork'
  },
  {
    id: 'techniques-support',
    title: 'Techniques and Support',
    description: 'Mindfulness tips to deepen your practice.',
    category: 'learning'
  },
  {
    id: 'back-to-school',
    title: 'Back-to-School Essentials',
    description: 'Mindfully navigate the year ahead.',
    category: 'seasonal'
  },
  {
    id: 'deepen-practice',
    title: 'Deepen Your Practice',
    description: 'Ready to go further? Advanced courses with less guidance, more silence.',
    category: 'advanced'
  },
  {
    id: 'reframe-stress',
    title: 'Reframe Stress and Relax',
    description: 'Meditation courses and singles to help you find stillness.',
    category: 'stress'
  },
  {
    id: 'healing-hope',
    title: 'Healing & Hope for Patients',
    description: 'Restorative exercises and uplifting guidance to support healing and resilience when you need it most.',
    category: 'health'
  },
  {
    id: 'pride-collection',
    title: 'Pride From the Inside Out',
    description: 'Be kind to LGBTQIA+ minds through affirmation, community, and support.',
    category: 'community'
  },
  {
    id: 'mindfulness-work',
    title: 'Mindfulness at Work',
    description: 'Find success by reclaiming your energy and purpose.',
    category: 'work'
  },
  {
    id: 'thrive-leader',
    title: 'Thrive as a Leader',
    description: 'Feel empowered with skills to be an effective leader.',
    category: 'leadership'
  },
  {
    id: 'high-performance',
    title: 'High-Performance Mindset',
    description: 'Exercises from mindfulness experts and athletes.',
    category: 'performance'
  },
  {
    id: 'ask-headspace',
    title: 'Ask Headspace',
    description: 'Learn from our team of teachers and therapists.',
    category: 'learning'
  },
  {
    id: 'family-relationships',
    title: 'Building Healthier Family Relationships',
    description: 'How to deal with burnout, boundaries, and more.',
    category: 'relationships'
  },
  {
    id: 'show-love',
    title: 'Show Yourself Love',
    description: 'Appreciate every relationship, starting with yourself.',
    category: 'self-care'
  },
  {
    id: 'fertility-journey',
    title: 'Support for Your Fertility Journey',
    description: 'Conversations and meditations to help you find comfort.',
    category: 'health'
  },
  {
    id: 'uncertain-times',
    title: 'Ease Stress in Uncertain Times',
    description: 'Simple ways to settle your mind and stay grounded.',
    category: 'stress'
  },
  {
    id: 'womens-collection',
    title: "Women's Collection",
    description: 'A space to celebrate, support, and empower.',
    category: 'community'
  },
  {
    id: 'black-joy',
    title: 'Celebrating Black Joy',
    description: 'Honoring Black experiences means not only recognizing our struggles, but celebrating our joy.',
    category: 'community'
  },
  {
    id: 'emotions-work',
    title: 'Life Skills: Embracing Emotions at Work',
    description: 'Get in touch with your emotions and bring your best, most confident self to work.',
    category: 'work'
  },
  {
    id: 'anger-sadness',
    title: 'Anger, Sadness, and Growth',
    description: 'Meditation courses and singles for working with challenging emotions.',
    category: 'emotions'
  },
  {
    id: 'climate-nature',
    title: 'Feelings on Climate & Nature',
    description: 'Enjoy the meditative practice of connecting with the natural world around you.',
    category: 'nature'
  },
  {
    id: 'mindful-parent',
    title: 'Becoming a Mindful Parent',
    description: 'Bring your attention and curiosity to all interactions with your children.',
    category: 'parenting'
  },
  {
    id: 'kids-mindfulness',
    title: 'Mindfulness with Kids',
    description: 'Help your family build healthy habits.',
    category: 'family'
  },
  {
    id: 'moving-forward',
    title: 'Moving Forward With Confidence',
    description: 'Sessions based on Acceptance and Commitment Therapy.',
    category: 'therapy'
  },
  {
    id: 'national-parks',
    title: 'National Park Collection',
    description: 'Explore meditations and sleep content set in iconic national parks.',
    category: 'nature'
  },
  {
    id: 'shine-collection',
    title: 'The Shine Collection',
    description: 'A network of mindfulness teachers committed to supporting marginalized communities.',
    category: 'community'
  },
  {
    id: 'navigating-injustice',
    title: 'Navigating Injustice',
    description: 'Voices with diverse perspectives to help us recognize our differences and unique journeys.',
    category: 'social'
  },
  {
    id: 'challenging-times',
    title: 'For Challenging Times',
    description: 'Emotional care for processing world tragedies and injustices.',
    category: 'support'
  },
  {
    id: 'mental-strength',
    title: 'Mental Strength Training',
    description: 'Stay focused during high-pressure situations.',
    category: 'performance'
  },
  {
    id: 'productivity',
    title: 'Feel Good Productivity',
    description: 'Make work feel energizing and enjoyable.',
    category: 'work'
  },
  {
    id: 'sail-stress',
    title: 'Sail Through Stress',
    description: 'Mental health tools picked by a family of adventurers.',
    category: 'stress'
  },
  {
    id: 'seeking-discomfort',
    title: 'Seeking Discomfort',
    description: 'Get out of your comfort zone with meditations and reflections.',
    category: 'growth'
  }
];

const AudioPage = () => {
  const navigate = useNavigate();

  const handleTopicClick = (topicId: string) => {
    navigate(`/audio/library/${topicId}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />

      {/* Hero Section with Purple Canvas Background */}
      <div
        className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white py-24 overflow-hidden dark:from-black dark:via-black dark:to-black"
        style={{
          backgroundImage: `url(${canvasBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-purple-900/40 dark:bg-black/80"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 dark:bg-white/10">
              <Headphones className="w-5 h-5" />
              <span className="text-sm font-medium">Audio Library</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Perfect
              <span className="block text-purple-200 dark:text-white">Audio Collection</span>
            </h1>

            <p className="text-xl text-purple-100 dark:text-gray-300 leading-relaxed">
              Explore curated collections for every moment. From quick meditations to deep dives into mindfulness.
            </p>
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="container mx-auto px-6 py-16 dark:text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audioTopics.map((topic) => (
            <Card
              key={topic.id}
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-purple-300 hover:-translate-y-1 overflow-hidden dark:bg-black dark:border-gray-800 dark:hover:border-purple-500"
              onClick={() => handleTopicClick(topic.id)}
            >
              {topic.imageUrl ? (
                <CardContent className="p-0 relative h-full min-h-[200px]">
                  {/* Image on the right */}
                  <div className="absolute inset-0">
                    <img
                      src={topic.imageUrl}
                      alt={topic.title}
                      className="w-full h-full object-cover object-right"
                    />
                  </div>

                  {/* Gradient fade overlay from left to right */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent dark:from-black dark:via-black/95 dark:to-transparent"></div>

                  {/* Text content on the left */}
                  <div className="relative z-10 p-6 flex flex-col justify-center h-full min-h-[200px]">
                    <div className="max-w-[65%]">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors leading-tight mb-3 dark:text-white dark:group-hover:text-purple-400">
                        {topic.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-sm dark:text-gray-300">
                        {topic.description}
                      </p>
                    </div>
                    <ArrowRight className="absolute top-6 right-6 w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all dark:text-gray-400 dark:group-hover:text-purple-400" />
                  </div>
                </CardContent>
              ) : (
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors leading-tight pr-2 dark:text-white dark:group-hover:text-purple-400">
                      {topic.title}
                    </h3>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1 dark:text-gray-400 dark:group-hover:text-purple-400" />
                  </div>
                  <p className="text-gray-600 leading-relaxed dark:text-gray-300">
                    {topic.description}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AudioPage;
