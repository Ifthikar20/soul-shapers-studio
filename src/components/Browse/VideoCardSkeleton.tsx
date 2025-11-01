// src/components/Browse/VideoCardSkeleton.tsx - Netflix-style skeleton
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const VideoCardSkeleton = () => (
  <Card className="overflow-hidden border-0 rounded-lg">
    <div className="relative aspect-video w-full">
      <Skeleton className="w-full h-full" />
    </div>
  </Card>
);

export default VideoCardSkeleton;