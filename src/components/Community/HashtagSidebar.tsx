// src/components/community/HashtagSidebar.tsx
import { CommunityHashtag } from '@/types/community.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Hash, TrendingUp, Plus, Users } from 'lucide-react';

interface HashtagSidebarProps {
  hashtags: CommunityHashtag[];
  onHashtagClick: (hashtag: string) => void;
  activeHashtag?: string;
}

export const HashtagSidebar: React.FC<HashtagSidebarProps> = ({
  hashtags,
  onHashtagClick,
  activeHashtag
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {hashtags.slice(0, 10).map((hashtag) => (
          <button
            key={hashtag.id}
            onClick={() => onHashtagClick(hashtag.name)}
            className={`w-full text-left p-3 rounded-xl transition-colors ${
              activeHashtag === hashtag.name
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-primary" />
                <span className="font-medium">#{hashtag.name}</span>
                {hashtag.isTrending && (
                  <TrendingUp className="w-3 h-3 text-orange-500" />
                )}
              </div>
              {hashtag.isUserFollowing && (
                <Badge variant="secondary" className="text-xs">
                  Following
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{hashtag.postCount} posts</span>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{hashtag.followerCount}</span>
              </div>
            </div>
            {hashtag.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {hashtag.description}
              </p>
            )}
          </button>
        ))}
        
        <Button variant="outline" className="w-full mt-4" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          View All Topics
        </Button>
      </CardContent>
    </Card>
  );
};
