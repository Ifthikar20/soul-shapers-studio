// src/components/VideoModal/VideoModal.tsx - Main container component
import { useState, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "../VideoPlayer/VideoPlayer";
import { VideoModalTabs } from "./VideoModalTabs";
import { OverviewTab } from "./tabs/OverviewTab";
import { LessonsTab } from "./tabs/LessonsTab";
import { PracticeTab } from "./tabs/PracticeTab";
import { CommunityTab } from "./tabs/CommunityTab";
import { VideoContent } from '@/types/video.types';
import { X, Plus, ThumbsUp, Share2, User, Users, Clock } from "lucide-react";

interface VideoModalProps {
  video: VideoContent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessons?: any[]; // API data
  communityPosts?: any[]; // API data
  practiceQuestions?: any[]; // API data
}

const VideoModal = ({ 
  video, 
  open, 
  onOpenChange, 
  lessons = [], 
  communityPosts = [], 
  practiceQuestions = [] 
}: VideoModalProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentLesson, setCurrentLesson] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    // Fullscreen logic here
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab video={video} totalLessons={lessons.length || 7} />;
      case 'lessons':
        return <LessonsTab lessons={lessons} currentLesson={currentLesson} onLessonSelect={setCurrentLesson} />;
      case 'practice':
        return <PracticeTab questions={practiceQuestions} />;
      case 'community':
        return <CommunityTab posts={communityPosts} />;
      default:
        return <OverviewTab video={video} totalLessons={lessons.length || 7} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[100vw] w-full h-[100vh] m-0 p-0 bg-black border-0 rounded-none overflow-hidden">
        <div className="relative w-full h-full overflow-y-auto overflow-x-hidden bg-gradient-to-b from-zinc-900 to-black">
          
          {!isFullscreen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="fixed top-4 right-4 z-50 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white w-10 h-10"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
          
          <VideoPlayer
            videoSrc="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            poster={video.thumbnail}
            title={lessons[currentLesson - 1]?.title || "Understanding Your Mind-Body Connection"}
            currentLesson={currentLesson}
            totalLessons={lessons.length || 7}
            isFullscreen={isFullscreen}
            onFullscreenToggle={toggleFullscreen}
            onClose={() => onOpenChange(false)}
          />
          
          {!isFullscreen && (
            <div className="relative px-8 lg:px-12 pb-20">
              <div className="max-w-[1400px] mx-auto">
                {/* Title and Actions */}
                <div className="mb-8">
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                    {video.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400 mb-6">
                    <span className="text-green-500 font-semibold">95% Match</span>
                    <span>{new Date().getFullYear()}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {video.duration}
                    </span>
                    <span className="px-2 py-0.5 border border-zinc-600 rounded text-xs">HD</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {video.views}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="lg" variant="outline" className="bg-zinc-800/80 hover:bg-zinc-700 text-white border-zinc-700 rounded px-8">
                      <Plus className="w-5 h-5 mr-2" />
                      My List
                    </Button>
                    <Button size="icon" variant="outline" className="rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white border-zinc-700 w-12 h-12">
                      <ThumbsUp className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="outline" className="rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white border-zinc-700 w-12 h-12">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                
                {/* Expert Info */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{video.expert}</p>
                    <p className="text-zinc-400 text-sm">Wellness Expert</p>
                  </div>
                </div>
                
                <VideoModalTabs activeTab={activeTab} onTabChange={handleTabChange}>
                  {renderTabContent()}
                </VideoModalTabs>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;