import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import FullPageVideoPlayer from '@/components/VideoPlayer/FullPageVideoPlayer';
import { VideoContent } from '@/types/video.types';

const WatchPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<VideoContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      // TODO: Replace with API call
      // const response = await fetch(`/api/videos/${id}`);
      // const videoData = await response.json();
      
      // Mock data for now
      const mockVideo: VideoContent = {
        id: Number(id),
        title: "Understanding Anxiety",
        expert: "Dr. Sarah Johnson",
        expertCredentials: "Clinical Psychologist, PhD",
        expertAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2",
        duration: "18:30",
        category: "Mental Health",
        rating: 4.9,
        views: "12.5k",
        thumbnail: "https://images.unsplash.com/photo-1544027993-37dbfe43562a",
        videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        description: "Learn about anxiety management",
        fullDescription: "A comprehensive guide to understanding and managing anxiety.",
        isNew: true,
        isTrending: true,
        relatedTopics: [],
        learningObjectives: [
          "Understand anxiety triggers",
          "Learn coping mechanisms",
          "Build resilience"
        ],
        accessTier: 'free'
      };

      setVideo(mockVideo);
      setLoading(false);
    };

    fetchVideo();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!video) {
    navigate('/browse');
    return null;
  }

  return <FullPageVideoPlayer video={video} />;
};

export default WatchPage;