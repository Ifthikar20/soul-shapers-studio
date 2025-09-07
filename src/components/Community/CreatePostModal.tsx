// src/components/community/CreatePostModal.tsx
import { useState } from 'react';
import { communityService } from '@/services/community.service';
import { CommunityPost, CommunityCategory, CreatePostRequest } from '@/types/community.types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Hash, 
  X, 
  Plus, 
  Eye, 
  EyeOff, 
  Sparkles,
  AlertTriangle,
  Heart,
  Brain,
  Users
} from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: CommunityPost) => void;
  categories: CommunityCategory[];
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
  categories
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<CreatePostRequest>({
    title: '',
    content: '',
    hashtags: [],
    category: '',
    isAnonymous: false
  });
  
  const [hashtagInput, setHashtagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const suggestedHashtags = [
    'anxiety', 'depression', 'selfcare', 'therapy', 'mindfulness', 
    'mentalhealth', 'wellness', 'recovery', 'support', 'meditation',
    'stress', 'healing', 'journey', 'breakthrough', 'gratitude'
  ];

  const handleInputChange = (field: keyof CreatePostRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addHashtag = (hashtag: string) => {
    const cleanTag = hashtag.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanTag && !formData.hashtags.includes(cleanTag) && formData.hashtags.length < 10) {
      handleInputChange('hashtags', [...formData.hashtags, cleanTag]);
    }
    setHashtagInput('');
  };

  const removeHashtag = (hashtag: string) => {
    handleInputChange('hashtags', formData.hashtags.filter(tag => tag !== hashtag));
  };

  const handleHashtagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
      e.preventDefault();
      if (hashtagInput.trim()) {
        addHashtag(hashtagInput);
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim() || formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }

    if (!formData.content.trim() || formData.content.trim().length < 10) {
      newErrors.content = 'Content must be at least 10 characters long';
    }

    if (formData.hashtags.length === 0) {
      newErrors.hashtags = 'At least one hashtag is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newPost = await communityService.createPost(formData);
      
      toast({
        title: 'Post created successfully!',
        description: 'Your post has been shared with the community.',
      });
      
      onPostCreated(newPost);
      handleReset();
    } catch (error: any) {
      toast({
        title: 'Failed to create post',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      content: '',
      hashtags: [],
      category: '',
      isAnonymous: false
    });
    setHashtagInput('');
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Share Your Story
          </DialogTitle>
          <DialogDescription>
            Connect with the community by sharing your wellness journey, insights, or seeking support.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Anonymous Toggle */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {formData.isAnonymous ? (
                    <EyeOff className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Eye className="w-5 h-5 text-primary" />
                  )}
                  <div>
                    <Label className="text-sm font-medium">
                      Post {formData.isAnonymous ? 'Anonymously' : 'with Your Name'}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {formData.isAnonymous 
                        ? 'Your identity will be hidden from other users'
                        : 'Your name and profile will be visible'
                      }
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.isAnonymous}
                  onCheckedChange={(checked) => handleInputChange('isAnonymous', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="What's on your mind? (e.g., My journey with anxiety management)"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={errors.title ? 'border-red-500' : ''}
              maxLength={200}
            />
            {errors.title && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {errors.title}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.title.length}/200 characters
            </p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleInputChange('category', value)}
            >
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Hashtags */}
          <div className="space-y-2">
            <Label htmlFor="hashtags">Hashtags * (help others find your post)</Label>
            <div className="space-y-3">
              {/* Hashtag Input */}
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="hashtags"
                  placeholder="Type hashtags and press Enter (e.g., anxiety, selfcare)"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={handleHashtagKeyPress}
                  className={`pl-10 ${errors.hashtags ? 'border-red-500' : ''}`}
                  maxLength={50}
                />
                {hashtagInput.trim() && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addHashtag(hashtagInput)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 px-2"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                )}
              </div>

              {/* Selected Hashtags */}
              {formData.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.hashtags.map((hashtag) => (
                    <Badge
                      key={hashtag}
                      variant="secondary"
                      className="px-3 py-1 rounded-full cursor-pointer hover:bg-red-100 transition-colors group"
                      onClick={() => removeHashtag(hashtag)}
                    >
                      #{hashtag}
                      <X className="w-3 h-3 ml-1 group-hover:text-red-500" />
                    </Badge>
                  ))}
                </div>
              )}

              {/* Suggested Hashtags */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Suggested hashtags:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedHashtags
                    .filter(tag => !formData.hashtags.includes(tag))
                    .slice(0, 8)
                    .map((hashtag) => (
                      <button
                        key={hashtag}
                        type="button"
                        onClick={() => addHashtag(hashtag)}
                        className="text-xs px-2 py-1 bg-muted hover:bg-primary/10 rounded-full transition-colors"
                        disabled={formData.hashtags.length >= 10}
                      >
                        #{hashtag}
                      </button>
                    ))}
                </div>
              </div>

              {errors.hashtags && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  {errors.hashtags}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {formData.hashtags.length}/10 hashtags
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Your Story *</Label>
            <Textarea
              id="content"
              placeholder="Share your thoughts, experiences, or questions. Be authentic and supportive..."
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              className={`min-h-32 ${errors.content ? 'border-red-500' : ''}`}
              maxLength={5000}
            />
            {errors.content && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {errors.content}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.content.length}/5000 characters
            </p>
          </div>

          {/* Community Guidelines Reminder */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 mb-1">
                    Community Guidelines Reminder
                  </p>
                  <ul className="text-xs text-yellow-700 space-y-1">
                    <li>• Be supportive and respectful to all community members</li>
                    <li>• Share personal experiences rather than giving medical advice</li>
                    <li>• Respect others' privacy and maintain confidentiality</li>
                    <li>• Report inappropriate content to help keep our community safe</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
              className="min-w-32"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Share Post
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};