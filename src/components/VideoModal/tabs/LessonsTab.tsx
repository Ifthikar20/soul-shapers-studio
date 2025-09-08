// src/components/VideoModal/tabs/LessonsTab.tsx
import { Play, Lock, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  accessTier: 'free' | 'premium';
  isFirstEpisode?: boolean;
}

interface LessonsTabProps {
  lessons: Lesson[];
  currentLesson: number;
  onLessonSelect: (lessonId: number) => void;
}

export const LessonsTab = ({ lessons, currentLesson, onLessonSelect }: LessonsTabProps) => {
  // Default lessons if none provided from API
  const defaultLessons: Lesson[] = [
    {
      id: 1,
      title: "Understanding Your Mind-Body Connection",
      description: "Explore how thoughts, emotions, and physical sensations interact to influence your mental wellness",
      duration: "16:45",
      thumbnail: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=250&fit=crop",
      accessTier: 'free',
      isFirstEpisode: true
    },
    {
      id: 2,
      title: "Identifying Personal Triggers & Patterns",
      description: "Learn to recognize the situations, thoughts, and emotions that impact your well-being",
      duration: "19:30",
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
      accessTier: 'premium',
      isFirstEpisode: false
    },
    {
      id: 3,
      title: "Building Emotional Resilience",
      description: "Develop practical skills to manage stress, anxiety, and challenging emotions effectively",
      duration: "22:15",
      thumbnail: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=250&fit=crop",
      accessTier: 'premium',
      isFirstEpisode: false
    }
  ];

  const lessonsToRender = lessons.length > 0 ? lessons : defaultLessons;

  return (
    <div className="space-y-4">
      {lessonsToRender.map((lesson, index) => {
        const canWatchLesson = lesson.accessTier === 'free' || lesson.isFirstEpisode;
        return (
          <div 
            key={lesson.id}
            onClick={() => canWatchLesson && onLessonSelect(lesson.id)}
            className={`flex gap-4 p-4 rounded-lg transition-all ${
              currentLesson === lesson.id 
                ? 'bg-zinc-800/80 border border-purple-500/50' 
                : canWatchLesson
                ? 'bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800/50 cursor-pointer'
                : 'bg-zinc-900/30 border border-zinc-800 opacity-60'
            }`}
          >
            <div className="text-2xl font-bold text-zinc-600 w-12">{index + 1}</div>
            <div className="relative flex-shrink-0">
              <img 
                src={lesson.thumbnail} 
                alt={lesson.title}
                className="w-32 h-20 object-cover rounded"
              />
              <div className="absolute inset-0 bg-black/40 rounded flex items-center justify-center">
                {canWatchLesson ? (
                  <Play className="w-8 h-8 text-white/80" />
                ) : (
                  <Lock className="w-6 h-6 text-white/60" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">{lesson.title}</h3>
              <p className="text-zinc-400 text-sm mb-2">{lesson.description}</p>
              <div className="flex items-center gap-3">
                <span className="text-zinc-500 text-xs">{lesson.duration}</span>
                {lesson.accessTier === 'premium' && !lesson.isFirstEpisode && (
                  <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
                {lesson.isFirstEpisode && (
                  <Badge className="bg-green-500/20 text-green-400 text-xs">
                    Free
                  </Badge>
                )}
              </div>
            </div>
            {currentLesson === lesson.id && canWatchLesson && (
              <div className="text-purple-400 text-sm self-center">Currently Playing</div>
            )}
            {!canWatchLesson && (
              <div className="text-orange-400 text-sm self-center">
                <Crown className="w-5 h-5" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
