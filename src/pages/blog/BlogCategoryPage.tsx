import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  image: string;
  timeAgo: string;
  category: string;
  author: string;
  slug: string;
}

const BlogCategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  
  // Convert URL parameter back to display format
  const displayCategory = category?.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || '';

  // This would typically come from an API or service
  const allPosts: BlogPost[] = [
    {
      id: '1',
      title: "Meta Behavioral Interview Guide and Top Questions",
      description: "This guide breaks down the behavioral rounds at Meta across various roles, including: • product management, • software engineering, • machine learning...",
      image: "/api/placeholder/300/200",
      timeAgo: "4 days ago",
      category: "Meta",
      author: "Exponent Team",
      slug: "meta-behavioral-interview-guide"
    },
    {
      id: '2',
      title: "Will data analysts be replaced by AI?",
      description: "Data analysis is being reshaped by artificial intelligence. The future does not belong solely to AI, nor to analysts resistant to change. It belo...",
      image: "/api/placeholder/300/200",
      timeAgo: "17 days ago",
      category: "AI",
      author: "Exponent Team",
      slug: "will-data-analysts-be-replaced-by-ai"
    },
    {
      id: '3',
      title: "Last-Minute Coding Interview Prep: Senior+ Guide",
      description: "You're a senior engineer. You've built systems, led teams, and shipped products. But your coding interview is next week, and you're feeling the pr...",
      image: "/api/placeholder/300/200",
      timeAgo: "24 days ago",
      category: "Software Engineering",
      author: "Exponent Team",
      slug: "last-minute-coding-interview-prep-senior-guide"
    },
    {
      id: '4',
      title: "What is an AI Product Manager?",
      description: "Here's what being an AI product manager actually means. Want to get a job as an AI PM? The best approach is to focus on becoming an excellent PM ...",
      image: "/api/placeholder/300/200",
      timeAgo: "a month ago",
      category: "Product Management",
      author: "Exponent Team",
      slug: "what-is-an-ai-product-manager"
    },
    {
      id: '5',
      title: "Netflix's Culture: Why the \"Dream Team\" Approach Matters",
      description: "Netflix's meteoric rise from DVD-by-mail to global streaming giant isn't just about technology or strategy. Behind the scenes, the company operates on a...",
      image: "/api/placeholder/300/200",
      timeAgo: "2 months ago",
      category: "Netflix",
      author: "Exponent Team",
      slug: "netflix-culture-dream-team-approach"
    },
    {
      id: '6',
      title: "Advanced React Patterns for Senior Engineers",
      description: "Deep dive into advanced React patterns that every senior engineer should know. From render props to compound components, master these techniques...",
      image: "/api/placeholder/300/200",
      timeAgo: "3 months ago",
      category: "Software Engineering",
      author: "Exponent Team",
      slug: "advanced-react-patterns-senior-engineers"
    }
  ];

  // Filter posts by category
  const filteredPosts = allPosts.filter(post => 
    post.category.toLowerCase().replace(/\s+/g, '-') === category
  );

  // Get all unique categories for navigation
  const allCategories = [...new Set(allPosts.map(post => post.category))];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/blog" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Posts
          </Link>
        </div>
      </nav>

      {/* Header */}
      <header className="text-center py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4 text-lg px-4 py-2">
            {displayCategory}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {displayCategory} Posts
          </h1>
          <p className="text-lg text-gray-600">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} about {displayCategory.toLowerCase()}
          </p>
        </div>
      </header>

      {/* Category Navigation */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <Link to="/blog">
            <Badge variant="outline" className="hover:bg-gray-100 cursor-pointer">
              All Posts
            </Badge>
          </Link>
          {allCategories.map((cat) => {
            const catSlug = cat.toLowerCase().replace(/\s+/g, '-');
            const isActive = catSlug === category;
            return (
              <Link key={cat} to={`/blog/category/${catSlug}`}>
                <Badge 
                  variant={isActive ? "default" : "outline"} 
                  className="hover:bg-gray-100 cursor-pointer"
                >
                  {cat}
                </Badge>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Posts Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article key={post.id} className="group cursor-pointer">
                <Link to={`/blog/post/${post.slug}`} className="block">
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
                      <span>•</span>
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
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
                        <AvatarFallback className="bg-purple-600 text-white text-xs">
                          ★
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-700">{post.author}</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No posts found</h2>
            <p className="text-gray-600 mb-8">
              There are no posts in the "{displayCategory}" category yet.
            </p>
            <Link to="/blog">
              <Badge variant="outline" className="hover:bg-gray-100 cursor-pointer px-4 py-2">
                Browse All Posts
              </Badge>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogCategoryPage;