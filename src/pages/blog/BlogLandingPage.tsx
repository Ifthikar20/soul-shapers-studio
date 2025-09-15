import React, { useState } from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  image: string;
  timeAgo: string;
  category: string;
  author: string;
  slug: string;
  content?: string;
  publishedAt?: string;
  readTime?: string;
}

const BlogLandingPage = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: "Understanding Anxiety: Signs, Symptoms, and Coping Strategies",
      description: "Learn to recognize the signs of anxiety and discover practical techniques to manage stress and worry. This guide covers breathing exercises, mindfulness practices...",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      timeAgo: "4 days ago",
      category: "Anxiety",
      author: "Dr. Sarah Mitchell",
      slug: "understanding-anxiety-coping-strategies",
      publishedAt: "2024-09-10",
      readTime: "8 min read",
      content: `
        <h2>What is Anxiety?</h2>
        <p>Anxiety is a natural human response to stress and potential threats. While everyone experiences anxiety from time to time, persistent or overwhelming anxiety can significantly impact your quality of life. Understanding the signs and learning effective coping strategies can help you regain control and find peace.</p>
        
        <h3>Common Signs and Symptoms</h3>
        <p>Anxiety manifests differently for everyone, but common physical and emotional symptoms include:</p>
        <ul>
          <li>Racing heart or palpitations</li>
          <li>Sweating or trembling</li>
          <li>Difficulty concentrating</li>
          <li>Restlessness or feeling on edge</li>
          <li>Sleep disturbances</li>
          <li>Muscle tension</li>
          <li>Digestive issues</li>
        </ul>
        
        <h3>Types of Anxiety Disorders</h3>
        <p>There are several types of anxiety disorders, each with unique characteristics:</p>
        <ol>
          <li><strong>Generalized Anxiety Disorder (GAD):</strong> Persistent worry about various aspects of life</li>
          <li><strong>Panic Disorder:</strong> Sudden, intense episodes of fear</li>
          <li><strong>Social Anxiety:</strong> Fear of social situations and judgment</li>
          <li><strong>Specific Phobias:</strong> Intense fear of specific objects or situations</li>
        </ol>
        
        <h3>Effective Coping Strategies</h3>
        <p>Here are evidence-based techniques to help manage anxiety:</p>
        
        <h4>1. Deep Breathing Exercises</h4>
        <p>Practice the 4-7-8 breathing technique: Inhale for 4 counts, hold for 7, exhale for 8. This activates your body's relaxation response and helps calm your nervous system.</p>
        
        <h4>2. Mindfulness and Grounding</h4>
        <p>Use the 5-4-3-2-1 technique: Notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. This brings you back to the present moment.</p>
        
        <h4>3. Progressive Muscle Relaxation</h4>
        <p>Systematically tense and release different muscle groups in your body. This helps identify and release physical tension associated with anxiety.</p>
        
        <h3>Lifestyle Changes That Help</h3>
        <p>Supporting your mental health through lifestyle modifications:</p>
        <ul>
          <li>Regular exercise (even 10 minutes of walking can help)</li>
          <li>Limiting caffeine and alcohol</li>
          <li>Maintaining a consistent sleep schedule</li>
          <li>Eating a balanced diet rich in omega-3 fatty acids</li>
          <li>Staying connected with supportive friends and family</li>
        </ul>
        
        <h3>When to Seek Professional Help</h3>
        <p>Consider reaching out to a mental health professional if:</p>
        <ul>
          <li>Anxiety interferes with daily activities</li>
          <li>You avoid situations due to fear</li>
          <li>Physical symptoms are concerning</li>
          <li>Coping strategies aren't providing relief</li>
        </ul>
        
        <h3>Remember: You're Not Alone</h3>
        <p>Anxiety affects millions of people worldwide. With the right tools, support, and sometimes professional guidance, it's entirely possible to manage anxiety effectively and live a fulfilling life. Be patient with yourself as you learn and practice these techniques.</p>
      `
    },
    {
      id: '2',
      title: "The Power of Self-Compassion in Mental Wellness",
      description: "Self-compassion is more than just being kind to yourself. Research shows it can reduce depression, increase motivation, and improve overall well-being...",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      timeAgo: "1 week ago",
      category: "Self-Care",
      author: "Dr. Michael Chen",
      slug: "power-of-self-compassion",
      publishedAt: "2024-09-07",
      readTime: "6 min read",
      content: `
        <h2>Understanding Self-Compassion</h2>
        <p>Self-compassion involves treating yourself with the same kindness and understanding you would offer a good friend during difficult times. Research by Dr. Kristin Neff shows that self-compassion is a powerful tool for emotional resilience and mental well-being.</p>
        
        <h3>The Three Components of Self-Compassion</h3>
        <ol>
          <li><strong>Self-Kindness:</strong> Being warm and understanding toward yourself when you suffer, fail, or feel inadequate</li>
          <li><strong>Common Humanity:</strong> Recognizing that suffering and personal inadequacy are part of the shared human experience</li>
          <li><strong>Mindfulness:</strong> Holding your experience in balanced awareness rather than over-identifying with thoughts and feelings</li>
        </ol>
        
        <h3>Benefits of Self-Compassion</h3>
        <p>Research has shown that self-compassion can:</p>
        <ul>
          <li>Reduce anxiety and depression</li>
          <li>Increase motivation and personal responsibility</li>
          <li>Improve emotional resilience</li>
          <li>Enhance life satisfaction</li>
          <li>Strengthen relationships</li>
        </ul>
        
        <h3>Practical Self-Compassion Exercises</h3>
        <h4>1. Self-Compassion Break</h4>
        <p>When facing difficulty, place your hands on your heart and say: "This is a moment of suffering. Suffering is part of life. May I be kind to myself in this moment."</p>
        
        <h4>2. Loving-Kindness for Yourself</h4>
        <p>Practice sending yourself the same good wishes you'd send to a loved one: "May I be happy. May I be healthy. May I be at peace."</p>
        
        <h3>Remember</h3>
        <p>Self-compassion is not self-pity or self-indulgence. It's about treating yourself with the same care you'd show a dear friend, fostering resilience and genuine happiness.</p>
      `
    },
    {
      id: '3',
      title: "Breaking the Cycle: Overcoming Depression Naturally",
      description: "Depression can feel overwhelming, but there are natural approaches that can complement professional treatment. Explore lifestyle changes, nutrition...",
      image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=300&fit=crop",
      timeAgo: "2 weeks ago",
      category: "Depression",
      author: "Dr. Emma Rodriguez",
      slug: "overcoming-depression-naturally"
    },
    {
      id: '4',
      title: "Mindfulness for Beginners: Start Your Journey Today",
      description: "Mindfulness isn't about emptying your mind – it's about being present. Learn simple techniques you can practice anywhere to reduce stress and increase awareness...",
      image: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=400&h=300&fit=crop",
      timeAgo: "3 weeks ago",
      category: "Mindfulness",
      author: "Lisa Thompson",
      slug: "mindfulness-for-beginners"
    },
    {
      id: '5',
      title: "Building Healthy Boundaries: Protecting Your Mental Space",
      description: "Healthy boundaries are essential for mental wellness. Learn how to set limits with family, friends, and colleagues while maintaining positive relationships...",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      timeAgo: "1 month ago",
      category: "Boundaries",
      author: "Dr. James Wilson",
      slug: "building-healthy-boundaries"
    },
    {
      id: '6',
      title: "Sleep and Mental Health: The Connection You Can't Ignore",
      description: "Quality sleep is fundamental to mental wellness. Discover how sleep affects your mood, cognition, and emotional regulation, plus tips for better sleep hygiene...",
      image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop",
      timeAgo: "1 month ago",
      category: "Sleep",
      author: "Dr. Rachel Green",
      slug: "sleep-mental-health-connection"
    }
  ];

  const categories = [...new Set(blogPosts.map(post => post.category))];

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
  };

  const handleBackToList = () => {
    setSelectedPost(null);
  };

  // If a post is selected, show the blog post view
  if (selectedPost) {
    return (
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="border-b border-gray-200 py-4">
          <div className="max-w-4xl mx-auto px-4">
            <button 
              onClick={handleBackToList}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </button>
          </div>
        </nav>

        {/* Article Header */}
        <header className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Category Badge */}
            <div className="mb-4">
              <Badge variant="secondary" className="mb-4">
                {selectedPost.category}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {selectedPost.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {selectedPost.description}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-green-600 text-white text-xs">
                    {selectedPost.author.split(' ').map(name => name[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-gray-700">{selectedPost.author}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{selectedPost.publishedAt && new Date(selectedPost.publishedAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span>{selectedPost.readTime}</span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="rounded-lg overflow-hidden mb-8">
              <img
                src={selectedPost.image.replace('w=400&h=300', 'w=800&h=400')}
                alt={selectedPost.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          </div>
        </header>

        {/* Article Content */}
        <main className="pb-16">
          <div className="max-w-4xl mx-auto px-4">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700"
              dangerouslySetInnerHTML={{ __html: selectedPost.content || '<p>Article content coming soon...</p>' }}
            />
          </div>
        </main>

        {/* Related Posts Section */}
        <section className="border-t border-gray-200 py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="text-center text-gray-500">
              <p>Explore more mental health resources and articles...</p>
              <Button variant="outline" className="mt-4" onClick={handleBackToList}>
                Browse All Articles
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Default blog listing view
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="text-center py-16 px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Mental Wellness Hub
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your trusted resource for mental health insights, wellness tips, and personal growth strategies.
        </p>
      </header>

      {/* Categories Filter */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="outline" className="hover:bg-gray-100 cursor-pointer">
            All Posts
          </Badge>
          {categories.map((category) => (
            <Badge key={category} variant="outline" className="hover:bg-gray-100 cursor-pointer">
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="group cursor-pointer" onClick={() => handlePostClick(post)}>
              <div className="block">
                {/* Image */}
                <div className="relative overflow-hidden rounded-lg mb-4 aspect-[4/3]">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  {/* Meta info */}
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{post.timeAgo}</span>
                    {post.category && (
                      <>
                        <span>•</span>
                        <Badge variant="secondary" className="text-xs">
                          {post.category}
                        </Badge>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {post.description}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-2 pt-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs">
                        {post.author.split(' ').map(name => name[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-700">{post.author}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BlogLandingPage;