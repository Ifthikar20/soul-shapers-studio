// src/components/community/PostCard.tsx
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CommunityPost } from '@/types/community.types';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Flag,
  Trash2,
  Edit,
  Crown,
  Shield,
  Hash,
  Pin,
  Eye
} from 'lucide-react';

interface PostCardProps {
  post: CommunityPost;
  onVote: (postId: string, voteType: 'up' | 'down') => void;
  onHashtagClick: (hashtag: string) => void;
  onCommentClick?: (postId: string) => void;
  showFullContent?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onVote,
  onHashtagClick,
  onCommentClick,
  showFullContent = false
}) => {
  const { user } = useAuth();
  const [showFullPost, setShowFullPost] = useState(showFullContent);
  const [bookmarked, setBookmarked] = useState(false);

  const isOwner = user?.id === post.author.id;
  const canModerate = user?.role === 'admin' || user?.permissions?.includes('moderate_community');

  const handleVote = (voteType: 'up' | 'down') => {
    onVote(post.id, voteType);
  };

  const handleHashtagClick = (hashtag: string) => {
    onHashtagClick(hashtag.replace('#', ''));
  };

  const handleCommentClick = () => {
    if (onCommentClick) {
      onCommentClick(post.id);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content.slice(0, 100) + '...',
          url: `${window.location.origin}/community/post/${post.id}`
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/community/post/${post.id}`);
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    // API call would go here
  };

  const handleReport = () => {
    // Open report modal
    console.log('Report post:', post.id);
  };

  const handleDelete = () => {
    // Confirm and delete post
    console.log('Delete post:', post.id);
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'premium':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'basic':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const truncatedContent = post.content.length > 300 
    ? post.content.slice(0, 300) + '...' 
    : post.content;

  return (
    <Card className="hover:shadow-hover transition-shadow duration-300 cursor-pointer">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <Avatar className="w-10 h-10">
              <AvatarImage 
                src={post.isAnonymous ? undefined : post.author.avatar} 
                alt={post.isAnonymous ? 'Anonymous' : post.author.name}
              />
              <AvatarFallback className="bg-gradient-primary text-white text-sm">
                {post.isAnonymous ? '?' : getUserInitials(post.author.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm truncate">
                  {post.isAnonymous ? 'Anonymous' : post.author.name}
                </p>
                {!post.isAnonymous && getTierIcon(post.author.tier)}
                {post.author.verified && (
                  <Shield className="w-4 h-4 text-green-500" />
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                {post.isSticky && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1 text-primary">
                      <Pin className="w-3 h-3" />
                      <span>Pinned</span>
                    </div>
                  </>
                )}
                {post.isFeatured && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Crown className="w-3 h-3" />
                      <span>Featured</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleBookmark}>
                <Bookmark className="mr-2 h-4 w-4" />
                {bookmarked ? 'Remove Bookmark' : 'Bookmark'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isOwner ? (
                <>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Post
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Post
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={handleReport} className="text-red-600">
                  <Flag className="mr-2 h-4 w-4" />
                  Report Post
                </DropdownMenuItem>
              )}
              {canModerate && !isOwner && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-orange-600">
                    <Shield className="mr-2 h-4 w-4" />
                    Moderate
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Post Title */}
        <h3 className="text-lg font-semibold text-foreground leading-tight mt-3">
          {post.title}
        </h3>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-2 mt-2">
          {post.hashtags.map((hashtag) => (
            <button
              key={hashtag}
              onClick={() => handleHashtagClick(hashtag)}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <Hash className="w-3 h-3" />
              {hashtag}
            </button>
          ))}
          <Badge variant="outline" className="text-xs">
            {post.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Post Content */}
        <div className="prose prose-sm max-w-none text-foreground mb-4">
          <p className="whitespace-pre-wrap">
            {showFullPost ? post.content : truncatedContent}
          </p>
          {!showFullPost && post.content.length > 300 && (
            <button
              onClick={() => setShowFullPost(true)}
              className="text-primary hover:text-primary/80 text-sm font-medium mt-2"
            >
              Read more
            </button>
          )}
        </div>

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border/20">
          <div className="flex items-center space-x-4">
            {/* Voting */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('up')}
                className={`h-8 px-2 ${
                  post.votes.userVote === 'up' 
                    ? 'text-green-600 bg-green-50 hover:bg-green-100' 
                    : 'text-muted-foreground hover:text-green-600'
                }`}
              >
                <ArrowUp className="w-4 h-4 mr-1" />
                {post.votes.upvotes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('down')}
                className={`h-8 px-2 ${
                  post.votes.userVote === 'down' 
                    ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                    : 'text-muted-foreground hover:text-red-600'
                }`}
              >
                <ArrowDown className="w-4 h-4 mr-1" />
                {post.votes.downvotes}
              </Button>
            </div>

            {/* Comments */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCommentClick}
              className="h-8 px-2 text-muted-foreground hover:text-primary"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              {post.commentCount}
            </Button>

            {/* Share */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="h-8 px-2 text-muted-foreground hover:text-primary"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Bookmark */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={`h-8 px-2 ${
              bookmarked 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-primary'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};