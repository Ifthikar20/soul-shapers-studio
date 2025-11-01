import React from 'react';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  publishedAt: string;
  category: string;
  author: string;
  readTime: string;
  slug: string;
}

const BlogPostPage = () => {
  // This would typically come from an API or service
  const blogPost: BlogPost = {
    id: '1',
    title: "Understanding Anxiety: Signs, Symptoms, and Coping Strategies",
    excerpt: "Learn to recognize the signs of anxiety and discover practical techniques to manage stress and worry in your daily life.",
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
    `,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
    publishedAt: "2024-09-10",
    category: "Anxiety",
    author: "Dr. Sarah Mitchell",
    readTime: "8 min read",
    slug: "understanding-anxiety-coping-strategies"
  };

  if (!blogPost) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <Button>← Back to Read</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 py-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Read
          </div>
        </div>
      </nav>

      {/* Article Header */}
      <header className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Category Badge */}
          <div className="mb-4">
            <Badge variant="secondary" className="mb-4">
              {blogPost.category}
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {blogPost.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {blogPost.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-green-600 text-white text-xs">
                  {blogPost.author.split(' ').map(name => name[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-gray-700">{blogPost.author}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(blogPost.publishedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span>{blogPost.readTime}</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-lg overflow-hidden mb-8">
            <img
              src={blogPost.image}
              alt={blogPost.title}
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
            dangerouslySetInnerHTML={{ __html: blogPost.content }}
          />
        </div>
      </main>

      {/* Related Posts Section */}
      <section className="border-t border-gray-200 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
          <div className="text-center text-gray-500">
            <p>Explore more mental health resources and articles...</p>
            <Button variant="outline" className="mt-4">Browse All Articles</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPostPage;