// src/components/Browse/VideoCardSkeleton.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const VideoCardSkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="h-44 w-full" />
    <CardContent className="p-5 space-y-3">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-6 w-full" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
    </CardContent>
  </Card>
);

export default VideoCardSkeleton;