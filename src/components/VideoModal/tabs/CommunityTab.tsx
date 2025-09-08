// src/components/VideoModal/tabs/CommunityTab.tsx
import { ThumbsUp, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommunityPost {
  id: number;
  author: string;
  avatar: string;
  timeAgo: string;
  content: string;
  likes: number;
  replies: number;
}

interface CommunityTabProps {
  posts: CommunityPost[];
}

export const CommunityTab = ({ posts }: CommunityTabProps) => {
  // Default posts if none provided from API
  const defaultPosts: CommunityPost[] = [
    {
      id: 1,
      author: "Sarah M.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      timeAgo: "2 hours ago",
      content: "This program has been life-changing! The mindfulness techniques really helped me manage my daily stress.",
      likes: 124,
      replies: 18
    },
    {
      id: 2,
      author: "John D.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      timeAgo: "5 hours ago",
      content: "Just finished lesson 3 about emotional resilience. Never realized how much my thoughts were affecting my mood. Anyone else have this revelation?",
      likes: 89,
      replies: 12
    }
  ];

  const postsToRender = posts.length > 0 ? posts : defaultPosts;

  return (
    <div className="space-y-6">
      {/* Post Input */}
      <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500"></div>
          <div className="flex-1">
            <textarea 
              placeholder="Share your thoughts, experiences, or success story..."
              className="w-full bg-zinc-800 text-white placeholder-zinc-500 rounded-lg p-3 border border-zinc-700 focus:border-purple-500 focus:outline-none resize-none"
              rows={3}
            />
            <div className="flex justify-end mt-3">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Community Posts */}
      {postsToRender.map((post) => (
        <div key={post.id} className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
          <div className="flex gap-4">
            <img 
              src={post.avatar} 
              alt={post.author}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-white font-semibold">{post.author}</span>
                  <span className="text-zinc-500 text-sm ml-2">{post.timeAgo}</span>
                </div>
              </div>
              <p className="text-zinc-300 mb-4">{post.content}</p>
              <div className="flex items-center gap-6 text-sm">
                <button className="flex items-center gap-2 text-zinc-400 hover:text-purple-400 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-zinc-400 hover:text-purple-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{post.replies} replies</span>
                </button>
                <button className="flex items-center gap-2 text-zinc-400 hover:text-purple-400 transition-colors ml-auto">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <div className="text-center">
        <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
          Load More Posts
        </Button>
      </div>
    </div>
  );
};