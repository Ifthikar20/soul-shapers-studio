// src/components/community/CommunityStats.tsx
import { CommunityStats } from '@/types/community.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageCircle, Hash, TrendingUp } from 'lucide-react';

interface CommunityStatsProps {
  stats: CommunityStats;
}

export const CommunityStats: React.FC<CommunityStatsProps> = ({ stats }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Community Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gradient-card rounded-xl">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-500/10 rounded-lg mx-auto mb-2">
              <Hash className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stats.totalPosts.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Posts</div>
          </div>
          
          <div className="text-center p-3 bg-gradient-card rounded-xl">
            <div className="flex items-center justify-center w-8 h-8 bg-green-500/10 rounded-lg mx-auto mb-2">
              <MessageCircle className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stats.totalComments.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Comments</div>
          </div>
        </div>
        
        <div className="text-center p-3 bg-gradient-card rounded-xl">
          <div className="flex items-center justify-center w-8 h-8 bg-purple-500/10 rounded-lg mx-auto mb-2">
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">{stats.activeUsers.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Active Users</div>
        </div>
      </CardContent>
    </Card>
  );
};