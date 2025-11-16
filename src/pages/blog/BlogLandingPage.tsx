import React, { useState } from 'react';
import { Heart, MessageCircle, Send, MoreHorizontal, User, BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import PageLayout from '@/components/Layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  content: string;
  timeAgo: string;
  likes: number;
}

interface Story {
  id: string;
  author: string;
  authorAvatar?: string;
  timeAgo: string;
  category: string;
  title: string;
  content: string;
  image?: string;
  likes: number;
  commentsCount: number;
  comments: Comment[];
  isLiked: boolean;
}

const BlogLandingPage = () => {
  // Check if user story posting is enabled via environment variable
  const canPostStories = import.meta.env.VITE_ENABLE_STORY_POSTING !== 'false';

  const [stories, setStories] = useState<Story[]>([
    {
      id: '1',
      author: 'Sarah Chen',
      authorAvatar: undefined,
      timeAgo: '2 hours ago',
      category: 'Anxiety Journey',
      title: 'How I Overcame Social Anxiety',
      content: 'After years of struggling with social anxiety, I finally found techniques that work for me. I started with small steps - making eye contact with cashiers, saying hi to neighbors. Each small victory built my confidence. Now I can attend social gatherings without that overwhelming dread. If you\'re struggling, know that progress is possible. Start small, be patient with yourself, and celebrate every step forward.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
      likes: 127,
      commentsCount: 23,
      isLiked: false,
      comments: [
        {
          id: 'c1',
          author: 'Michael Torres',
          content: 'This really resonates with me. Thank you for sharing your journey!',
          timeAgo: '1 hour ago',
          likes: 12,
        },
        {
          id: 'c2',
          author: 'Emma Wilson',
          content: 'I\'m at the beginning of this journey. Your story gives me hope.',
          timeAgo: '45 min ago',
          likes: 8,
        },
      ],
    },
    {
      id: '2',
      author: 'James Rodriguez',
      authorAvatar: undefined,
      timeAgo: '5 hours ago',
      category: 'Self-Care',
      title: 'My Morning Routine Changed Everything',
      content: 'I used to jump straight into work, checking emails before I even got out of bed. Now I start with 10 minutes of meditation, a healthy breakfast, and journaling. This simple routine has transformed my mental health. I feel more grounded, less reactive, and actually enjoy my mornings. Sometimes the smallest changes make the biggest difference.',
      likes: 89,
      commentsCount: 15,
      isLiked: false,
      comments: [
        {
          id: 'c3',
          author: 'Lisa Park',
          content: 'I need to try this! What journaling prompts do you use?',
          timeAgo: '3 hours ago',
          likes: 5,
        },
      ],
    },
    {
      id: '3',
      author: 'Maya Patel',
      authorAvatar: undefined,
      timeAgo: '1 day ago',
      category: 'Therapy',
      title: 'Why I Finally Started Therapy',
      content: 'For years I thought I could handle everything on my own. Asking for help felt like weakness. But starting therapy was one of the best decisions I\'ve ever made. Having a safe space to process my thoughts and emotions has been invaluable. If you\'re on the fence about therapy, this is your sign to take that step. You deserve support.',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop',
      likes: 234,
      commentsCount: 42,
      isLiked: false,
      comments: [
        {
          id: 'c4',
          author: 'David Kim',
          content: 'How did you find the right therapist? That\'s what I\'m struggling with.',
          timeAgo: '18 hours ago',
          likes: 15,
        },
        {
          id: 'c5',
          author: 'Rachel Green',
          content: 'Same here! Therapy changed my life. So glad you took that step.',
          timeAgo: '12 hours ago',
          likes: 9,
        },
      ],
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [newStoryContent, setNewStoryContent] = useState('');
  const [newStoryCategory, setNewStoryCategory] = useState('');
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});

  const categories = ['Anxiety Journey', 'Self-Care', 'Therapy', 'Depression', 'Mindfulness', 'Recovery', 'Relationships'];

  const handleLike = (storyId: string) => {
    setStories(stories.map(story => {
      if (story.id === storyId) {
        return {
          ...story,
          likes: story.isLiked ? story.likes - 1 : story.likes + 1,
          isLiked: !story.isLiked,
        };
      }
      return story;
    }));
  };

  const handleShareStory = () => {
    // Validation
    if (!newStoryTitle.trim()) {
      alert('Please add a title to your story');
      return;
    }
    if (!newStoryContent.trim()) {
      alert('Please add content to your story');
      return;
    }
    if (newStoryTitle.length < 5) {
      alert('Story title should be at least 5 characters');
      return;
    }
    if (newStoryContent.length < 20) {
      alert('Story content should be at least 20 characters');
      return;
    }

    const newStory: Story = {
      id: Date.now().toString(),
      author: 'You',
      authorAvatar: undefined,
      timeAgo: 'Just now',
      category: newStoryCategory || 'Personal Story',
      title: newStoryTitle.trim(),
      content: newStoryContent.trim(),
      likes: 0,
      commentsCount: 0,
      isLiked: false,
      comments: [],
    };

    setStories([newStory, ...stories]);
    setNewStoryTitle('');
    setNewStoryContent('');
    setNewStoryCategory('');
    setShowShareDialog(false);
  };

  const toggleComments = (storyId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(storyId)) {
      newExpanded.delete(storyId);
    } else {
      newExpanded.add(storyId);
    }
    setExpandedComments(newExpanded);
  };

  const handleAddComment = (storyId: string) => {
    const commentText = newComment[storyId];
    if (!commentText?.trim()) return;

    // Validation
    if (commentText.trim().length < 2) {
      alert('Comment must be at least 2 characters');
      return;
    }

    setStories(stories.map(story => {
      if (story.id === storyId) {
        const newCommentObj: Comment = {
          id: `c${Date.now()}`,
          author: 'You',
          content: commentText.trim(),
          timeAgo: 'Just now',
          likes: 0,
        };
        return {
          ...story,
          comments: [...story.comments, newCommentObj],
          commentsCount: story.commentsCount + 1,
        };
      }
      return story;
    }));

    setNewComment({ ...newComment, [storyId]: '' });
  };

  const filteredStories = selectedCategory
    ? stories.filter(story => story.category === selectedCategory)
    : stories;

  return (
    <>
      <Header />
      <PageLayout hasHero={false}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                Community Stories
              </h1>
              {canPostStories && (
                <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                  <DialogTrigger asChild>
                    <Button className="rounded-full">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Share Your Story
                    </Button>
                  </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Share Your Story</DialogTitle>
                    <DialogDescription>
                      Your story matters. Share your journey to inspire and connect with others.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-900 dark:text-white">
                        Category
                      </label>
                      <select
                        value={newStoryCategory}
                        onChange={(e) => setNewStoryCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      >
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-900 dark:text-white">
                        Title
                      </label>
                      <Input
                        placeholder="Give your story a title..."
                        value={newStoryTitle}
                        onChange={(e) => setNewStoryTitle(e.target.value)}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-900 dark:text-white">
                        Your Story
                      </label>
                      <Textarea
                        placeholder="Share your experience, insights, or journey..."
                        value={newStoryContent}
                        onChange={(e) => setNewStoryContent(e.target.value)}
                        rows={8}
                        className="rounded-lg resize-none"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowShareDialog(false)} className="rounded-full">
                      Cancel
                    </Button>
                    <Button onClick={handleShareStory} className="rounded-full">
                      Share Story
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              )}
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Real stories from real people. Share, connect, and find support in our community.
            </p>
          </div>

          {/* Categories Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === null ? 'default' : 'outline'}
                className="cursor-pointer rounded-full"
                onClick={() => setSelectedCategory(null)}
              >
                All Stories
              </Badge>
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className="cursor-pointer rounded-full"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Stories Feed */}
          <div className="space-y-6">
            {filteredStories.map((story) => (
              <Card key={story.id} className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl">
                {/* Story Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      {story.authorAvatar ? (
                        <AvatarImage src={story.authorAvatar} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          {story.author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{story.author}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>{story.timeAgo}</span>
                        <span>•</span>
                        <Badge variant="secondary" className="text-xs rounded-full">
                          {story.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Report</DropdownMenuItem>
                      <DropdownMenuItem>Save</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Story Content */}
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {story.title}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {story.content}
                  </p>
                </div>

                {/* Story Image */}
                {story.image && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}

                {/* Story Actions */}
                <div className="flex items-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <button
                    onClick={() => handleLike(story.id)}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors group"
                  >
                    <Heart
                      className={`w-5 h-5 transition-all ${story.isLiked ? 'fill-red-500 text-red-500' : 'group-hover:scale-110'}`}
                    />
                    <span className="text-sm font-medium">{story.likes}</span>
                  </button>
                  <button
                    onClick={() => toggleComments(story.id)}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors group"
                  >
                    <MessageCircle className={`w-5 h-5 transition-all ${expandedComments.has(story.id) ? 'fill-blue-500 text-blue-500' : 'group-hover:scale-110'}`} />
                    <span className="text-sm font-medium">{story.commentsCount}</span>
                  </button>
                </div>

                {/* Comments Section */}
                {expandedComments.has(story.id) && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 space-y-4">
                    {/* Existing Comments */}
                    {story.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-500 text-white text-xs">
                            {comment.author.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                            <p className="font-semibold text-sm text-gray-900 dark:text-white">
                              {comment.author}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                              {comment.content}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 mt-1 px-3 text-xs text-gray-600 dark:text-gray-400">
                            <span>{comment.timeAgo}</span>
                            <button className="hover:text-gray-900 dark:hover:text-white">
                              Like ({comment.likes})
                            </button>
                            <button className="hover:text-gray-900 dark:hover:text-white">Reply</button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add Comment */}
                    <div className="flex gap-3 pt-2">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex gap-2">
                        <Input
                          placeholder="Write a comment..."
                          value={newComment[story.id] || ''}
                          onChange={(e) => setNewComment({ ...newComment, [story.id]: e.target.value })}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleAddComment(story.id);
                            }
                          }}
                          className="rounded-full"
                        />
                        <Button
                          size="icon"
                          onClick={() => handleAddComment(story.id)}
                          disabled={!newComment[story.id]?.trim()}
                          className="rounded-full flex-shrink-0"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredStories.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No stories in this category yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {canPostStories ? 'Be the first to share your story' : 'Check back later for inspiring stories'}
              </p>
              {canPostStories && (
                <Button onClick={() => setShowShareDialog(true)} className="rounded-full">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Share Your Story
                </Button>
              )}
            </div>
          )}
        </div>
      </PageLayout>
    </>
  );
};

export default BlogLandingPage;
