import { useState } from "react";
import { Play, Clock, User, Star, TrendingUp, Bookmark, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Enhanced Video Content Interface
interface VideoContent {
  id: number;
  title: string;
  expert: string;
  expertCredentials?: string;
  duration: string;
  category: string;
  rating: number;
  views: string;
  thumbnail: string;
  videoUrl?: string;
  isNew: boolean;
  isTrending: boolean;
  description: string;
  fullDescription?: string;
  relatedTopics?: string[];
  learningObjectives?: string[];
  expertAvatar?: string;
}

const videos: VideoContent[] = [
  {
    id: 1,
    title: "Understanding Anxiety: A Complete Guide",
    expert: "Dr. Sarah Johnson",
    expertCredentials: "Clinical Psychologist, PhD in Mental Health",
    expertAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
    duration: "18:30",
    category: "Mental Health",
    rating: 4.9,
    views: "12.5k",
    thumbnail: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=250&fit=crop",
    isNew: true,
    isTrending: true,
    description: "A comprehensive guide to understanding anxiety disorders.",
    fullDescription: "Dive deep into the complexities of anxiety, exploring its psychological and physiological impacts. Learn evidence-based strategies for managing and overcoming anxiety in your daily life.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    relatedTopics: ["Stress Management", "Cognitive Behavioral Techniques", "Mindfulness"],
    learningObjectives: [
      "Understand the different types of anxiety disorders",
      "Identify personal anxiety triggers",
      "Learn practical coping mechanisms"
    ]
  },
  {
    id: 2,
    title: "Stress Management Techniques",
    expert: "Dr. Michael Chen",
    expertCredentials: "Wellness Coach, PhD in Psychology",
    expertAvatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face",
    duration: "22:15",
    category: "Wellness",
    rating: 4.8,
    views: "8.3k",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    isNew: false,
    isTrending: true,
    description: "Learn effective techniques to manage daily stress.",
    fullDescription: "Discover proven methods to reduce stress and improve your overall well-being through practical techniques you can implement immediately.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    relatedTopics: ["Meditation", "Time Management", "Work-Life Balance"],
    learningObjectives: [
      "Master breathing techniques for instant stress relief",
      "Develop a personal stress management toolkit",
      "Create healthy boundaries in daily life"
    ]
  },
  {
    id: 3,
    title: "Building Healthy Relationships",
    expert: "Dr. Emily Rodriguez",
    expertCredentials: "Relationship Therapist, LMFT",
    expertAvatar: "https://images.unsplash.com/photo-1594824388853-d0b8ccbfbb3d?w=100&h=100&fit=crop&crop=face",
    duration: "25:40",
    category: "Relationships",
    rating: 4.7,
    views: "15.2k",
    thumbnail: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=250&fit=crop",
    isNew: true,
    isTrending: false,
    description: "Essential skills for maintaining healthy relationships.",
    fullDescription: "Explore the fundamentals of building and maintaining strong, healthy relationships in all areas of your life.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    relatedTopics: ["Communication", "Emotional Intelligence", "Conflict Resolution"],
    learningObjectives: [
      "Improve communication skills",
      "Set healthy boundaries",
      "Resolve conflicts constructively"
    ]
  },
  {
    id: 4,
    title: "Mindfulness for Beginners",
    expert: "Dr. James Park",
    expertCredentials: "Mindfulness Instructor, PhD in Neuroscience",
    expertAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    duration: "16:20",
    category: "Mindfulness",
    rating: 4.9,
    views: "20.1k",
    thumbnail: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=250&fit=crop",
    isNew: false,
    isTrending: true,
    description: "Start your mindfulness journey with simple practices.",
    fullDescription: "Begin your mindfulness practice with gentle, accessible techniques designed for complete beginners.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    relatedTopics: ["Meditation", "Present Moment Awareness", "Breathing Exercises"],
    learningObjectives: [
      "Learn basic mindfulness techniques",
      "Establish a daily practice",
      "Reduce mental chatter and increase focus"
    ]
  },
  {
    id: 5,
    title: "Sleep Optimization Guide",
    expert: "Dr. Lisa Thompson",
    expertCredentials: "Sleep Specialist, MD",
    expertAvatar: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=100&h=100&fit=crop&crop=face",
    duration: "19:45",
    category: "Sleep Health",
    rating: 4.8,
    views: "11.7k",
    thumbnail: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=250&fit=crop",
    isNew: true,
    isTrending: false,
    description: "Improve your sleep quality with science-based methods.",
    fullDescription: "Transform your sleep using evidence-based strategies that address common sleep challenges and optimize rest quality.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    relatedTopics: ["Sleep Hygiene", "Circadian Rhythms", "Relaxation Techniques"],
    learningObjectives: [
      "Understand sleep science basics",
      "Create an optimal sleep environment",
      "Develop a consistent sleep routine"
    ]
  },
  {
    id: 6,
    title: "Nutrition for Mental Health",
    expert: "Dr. Maria Garcia",
    expertCredentials: "Nutritional Psychiatrist, MD, PhD",
    expertAvatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face",
    duration: "21:30",
    category: "Nutrition",
    rating: 4.6,
    views: "9.8k",
    thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=250&fit=crop",
    isNew: false,
    isTrending: false,
    description: "How food choices impact your mental wellbeing.",
    fullDescription: "Discover the powerful connection between nutrition and mental health, learning which foods support optimal brain function.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    relatedTopics: ["Brain Health", "Mood Foods", "Nutritional Psychology"],
    learningObjectives: [
      "Understand the gut-brain connection",
      "Identify mood-supporting nutrients",
      "Plan meals for mental wellness"
    ]
  }
];

// Video Modal Component with Fixed Scrolling
const VideoModal = ({ 
  video, 
  open, 
  onOpenChange 
}: { 
  video: VideoContent, 
  open: boolean, 
  onOpenChange: (open: boolean) => void 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0">
        {/* Fixed Header */}
        <DialogHeader className="p-6 pb-4 border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-2xl font-bold pr-8 leading-tight">
              {video.title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0 rounded-full hover:bg-accent"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-100px)] scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          <div className="p-6">
            {/* Video Player */}
            {video.videoUrl && (
              <div className="w-full aspect-video rounded-lg overflow-hidden mb-6 bg-black">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={video.videoUrl} 
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            )}
            
            {/* Video Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Video Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary" className="text-xs px-3 py-1">
                      {video.category}
                    </Badge>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{video.duration}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <span>{video.views} views</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Bookmark className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
                
                {/* Expert Information */}
                <div className="flex items-center mb-6 space-x-4 p-4 bg-accent/30 rounded-lg">
                  {video.expertAvatar && (
                    <img 
                      src={video.expertAvatar} 
                      alt={video.expert} 
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center">
                      <User className="w-5 h-5 mr-2 text-primary" />
                      <span className="font-semibold text-lg">{video.expert}</span>
                    </div>
                    {video.expertCredentials && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {video.expertCredentials}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 mr-1 text-yellow-500 fill-current" />
                    <span className="font-semibold">{video.rating}</span>
                  </div>
                </div>
                
                <div className="prose prose-sm max-w-none mb-8">
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {video.fullDescription || video.description}
                  </p>
                </div>
                
                {/* Learning Objectives */}
                {video.learningObjectives && (
                  <div className="mb-8 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 rounded-2xl"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-200/30 to-transparent rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full blur-xl"></div>
                    
                    {/* Content */}
                    <div className="relative p-8 border border-emerald-100/50 rounded-2xl backdrop-blur-sm">
                      <div className="flex items-center mb-6">
                        <div className="p-3 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl shadow-lg">
                          <Star className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-blue-700 bg-clip-text text-transparent">
                            What You'll Learn
                          </h4>
                          <p className="text-sm text-muted-foreground">Key outcomes from this session</p>
                        </div>
                      </div>
                      
                      <div className="grid gap-4">
                        {video.learningObjectives.map((objective, index) => (
                          <div key={index} className="flex items-start group">
                            <div className="flex-shrink-0 mr-4 mt-1">
                              <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-lg flex items-center justify-center group-hover:from-emerald-200 group-hover:to-blue-200 transition-all duration-300">
                                <span className="text-sm font-bold text-emerald-700">{index + 1}</span>
                              </div>
                            </div>
                            <div className="flex-1 pt-1">
                              <span className="text-foreground font-medium leading-relaxed group-hover:text-emerald-800 transition-colors duration-300">
                                {objective}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Progress indicator */}
                      <div className="mt-6 pt-6 border-t border-emerald-100/50">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                          <span>Complete all objectives to master this topic</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Related Topics */}
                {video.relatedTopics && (
                  <div>
                    <h4 className="text-lg font-semibold mb-4">
                      Related Topics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {video.relatedTopics.map((topic, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="cursor-pointer hover:bg-primary hover:text-white transition-all duration-300 px-3 py-1"
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right Column: Video Chapters */}
              <div className="lg:border-l lg:pl-8">
                <h4 className="text-lg font-semibold mb-6 flex items-center">
                  <Play className="w-5 h-5 mr-2 text-primary" />
                  Video Chapters
                </h4>
                <div className="space-y-3">
                  {/* Chapter 1 */}
                  <div className="flex items-start bg-primary/5 rounded-lg p-3 hover:bg-primary/10 transition-all duration-300 cursor-pointer group border border-primary/20">
                    <div className="flex-shrink-0 mr-3 relative">
                      <img 
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=60&fit=crop&crop=center"
                        alt="Behavioral patterns discussion"
                        className="w-16 h-12 object-cover rounded-md"
                      />
                      <div className="absolute inset-0 bg-black/20 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                      <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                        3:45
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-semibold text-sm group-hover:text-primary transition-colors">
                          Understanding Behavioral Patterns
                        </h5>
                        <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded font-medium">
                          Playing
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Explore how behavioral patterns form and their impact on anxiety responses
                      </p>
                      <div className="mt-2 flex items-center text-xs text-muted-foreground">
                        <div className="w-1 h-1 bg-primary rounded-full mr-1"></div>
                        <span>0:00 - 3:45</span>
                      </div>
                    </div>
                  </div>

                  {/* Chapter 2 */}
                  <div className="flex items-start bg-accent/20 rounded-lg p-3 hover:bg-accent/40 transition-all duration-300 cursor-pointer group">
                    <div className="flex-shrink-0 mr-3 relative">
                      <img 
                        src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=80&h=60&fit=crop&crop=center"
                        alt="Wellness facts discussion"
                        className="w-16 h-12 object-cover rounded-md"
                      />
                      <div className="absolute inset-0 bg-black/20 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                      <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                        1:35
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-semibold text-sm group-hover:text-emerald-700 transition-colors">
                          Unknown Facts About Wellness
                        </h5>
                        <span className="text-xs text-muted-foreground bg-white/80 px-2 py-1 rounded">
                          Next
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Surprising wellness insights that challenge common misconceptions
                      </p>
                      <div className="mt-2 flex items-center text-xs text-muted-foreground">
                        <div className="w-1 h-1 bg-emerald-500 rounded-full mr-1"></div>
                        <span>3:45 - 5:20</span>
                      </div>
                    </div>
                  </div>

                  {/* Chapter 3 */}
                  <div className="flex items-start bg-accent/20 rounded-lg p-3 hover:bg-accent/40 transition-all duration-300 cursor-pointer group">
                    <div className="flex-shrink-0 mr-3 relative">
                      <img 
                        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=60&fit=crop&crop=center"
                        alt="Coping strategies demonstration"
                        className="w-16 h-12 object-cover rounded-md"
                      />
                      <div className="absolute inset-0 bg-black/20 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                      <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                        3:55
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-semibold text-sm group-hover:text-orange-700 transition-colors">
                          Practical Coping Strategies
                        </h5>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Actionable techniques you can implement immediately for anxiety relief
                      </p>
                      <div className="mt-2 flex items-center text-xs text-muted-foreground">
                        <div className="w-1 h-1 bg-orange-500 rounded-full mr-1"></div>
                        <span>5:20 - 9:15</span>
                      </div>
                    </div>
                  </div>

                  {/* Chapter 4 */}
                  <div className="flex items-start bg-accent/20 rounded-lg p-3 hover:bg-accent/40 transition-all duration-300 cursor-pointer group">
                    <div className="flex-shrink-0 mr-3 relative">
                      <img 
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=80&h=60&fit=crop&crop=center"
                        alt="Building resilience discussion"
                        className="w-16 h-12 object-cover rounded-md"
                      />
                      <div className="absolute inset-0 bg-black/20 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                      <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                        3:25
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-semibold text-sm group-hover:text-purple-700 transition-colors">
                          Building Long-term Resilience
                        </h5>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Developing sustainable practices for lasting mental health improvement
                      </p>
                      <div className="mt-2 flex items-center text-xs text-muted-foreground">
                        <div className="w-1 h-1 bg-purple-500 rounded-full mr-1"></div>
                        <span>9:15 - 12:40</span>
                      </div>
                    </div>
                  </div>

                  {/* Chapter 5 */}
                  <div className="flex items-start bg-accent/20 rounded-lg p-3 hover:bg-accent/40 transition-all duration-300 cursor-pointer group">
                    <div className="flex-shrink-0 mr-3 relative">
                      <img 
                        src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=80&h=60&fit=crop&crop=center"
                        alt="Q&A session"
                        className="w-16 h-12 object-cover rounded-md"
                      />
                      <div className="absolute inset-0 bg-black/20 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                      <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                        5:50
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-semibold text-sm group-hover:text-indigo-700 transition-colors">
                          Q&A and Final Thoughts
                        </h5>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Common questions answered and key takeaways for your journey
                      </p>
                      <div className="mt-2 flex items-center text-xs text-muted-foreground">
                        <div className="w-1 h-1 bg-indigo-500 rounded-full mr-1"></div>
                        <span>12:40 - 18:30</span>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const VideoGrid = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoContent | null>(null);
  const [visibleVideos, setVisibleVideos] = useState(6);

  const handleVideoPlay = (video: VideoContent) => {
    setSelectedVideo(video);
  };

  const handleLoadMore = () => {
    setVisibleVideos(prev => prev + 3);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-16">
          <div className="text-center md:text-left">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Featured
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent block">
                Content
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl">
              Expert-curated videos for your wellness needs
            </p>
          </div>
          
          {/* Filter Badges */}
          <div className="hidden lg:flex space-x-3">
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-all duration-300 px-4 py-2 rounded-full">
              All
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-all duration-300 px-4 py-2 rounded-full">
              Most Popular
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-all duration-300 px-4 py-2 rounded-full">
              New Releases
            </Badge>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.slice(0, visibleVideos).map((video) => (
            <Card 
              key={video.id} 
              className="cursor-pointer group overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-52 object-cover group-hover:scale-110 transition-all duration-500"
                />
                {/* Hover Play Overlay */}
                <div 
                  onClick={() => handleVideoPlay(video)}
                  className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer"
                >
                  <div className="bg-white/20 rounded-full p-4 backdrop-blur-sm shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {video.isNew && (
                    <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white border-0 rounded-full px-3 py-1 text-xs font-medium">
                      New
                    </Badge>
                  )}
                  {video.isTrending && (
                    <Badge className="bg-white/90 text-primary border-0 rounded-full px-3 py-1 text-xs font-medium">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>
                
                <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center backdrop-blur-sm">
                  <Clock className="w-3 h-3 mr-1" />
                  {video.duration}
                </div>

                <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white transform translate-y-2 group-hover:translate-y-0">
                  <Bookmark className="w-4 h-4 text-primary" />
                </button>
              </div>
              
              <CardContent className="p-6">
                <div className="mb-3">
                  <Badge variant="secondary" className="text-xs rounded-full px-3 py-1">
                    {video.category}
                  </Badge>
                </div>
                
                <h3 className="font-bold text-lg text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
                  {video.title}
                </h3>
                
                <div className="flex items-center text-muted-foreground text-sm mb-4">
                  <User className="w-4 h-4 mr-2" />
                  <span className="font-medium">{video.expert}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    <span className="font-medium">{video.rating}</span>
                    <span className="mx-2">•</span>
                    <span>{video.views} views</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleVideoPlay(video)}
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-primary hover:bg-primary/10 rounded-full"
                  >
                    Watch
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Load More Button */}
        {visibleVideos < videos.length && (
          <div className="text-center mt-16">
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleLoadMore}
              className="rounded-full px-8 py-3 text-base hover:bg-primary hover:text-white transition-all duration-300"
            >
              Load More Videos
            </Button>
          </div>
        )}

        {/* Video Modal */}
        {selectedVideo && (
          <VideoModal 
            video={selectedVideo} 
            open={!!selectedVideo} 
            onOpenChange={() => setSelectedVideo(null)} 
          />
        )}
      </div>
    </section>
  );
};

export default VideoGrid;