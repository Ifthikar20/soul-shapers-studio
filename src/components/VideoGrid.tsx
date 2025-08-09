import { useState } from "react";
import { 
  Play, Clock, User, Star, TrendingUp, Bookmark, X, 
  Calendar, BookOpen, ChevronRight, Filter, Search, 
  Heart, Share2, MoreVertical, Eye, Users, Award, 
  Target, Zap, Pause, Volume2, Settings, Plus, 
  ThumbsUp, Check 
} from "lucide-react";
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

// [Keep all your videos array data as is]

// [Keep your VideoModal component as is]

// [Keep your VideoGrid component as is]


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
// const VideoModal = ({ 
//   video, 
//   open, 
//   onOpenChange 
// }: { 
//   video: VideoContent, 
//   open: boolean, 
//   onOpenChange: (open: boolean) => void 
// }) => {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0">
//         {/* Fixed Header */}
//         <DialogHeader className="p-6 pb-4 border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
//           <div className="flex items-start justify-between">
//             <DialogTitle className="text-2xl font-bold pr-8 leading-tight">
//               {video.title}
//             </DialogTitle>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => onOpenChange(false)}
//               className="h-8 w-8 p-0 rounded-full hover:bg-accent"
//             >
//               <X className="h-4 w-4" />
//             </Button>
//           </div>
//         </DialogHeader>
        
//         {/* Scrollable Content */}
//         <div className="overflow-y-auto max-h-[calc(90vh-100px)] scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
//           <div className="p-6">
//             {/* Video Player */}
//             {video.videoUrl && (
//               <div className="w-full aspect-video rounded-lg overflow-hidden mb-6 bg-black">
//                 <iframe 
//                   width="100%" 
//                   height="100%" 
//                   src={video.videoUrl} 
//                   title={video.title}
//                   frameBorder="0"
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                   allowFullScreen
//                   className="w-full h-full"
//                 ></iframe>
//               </div>
//             )}
            
//             {/* Video Details */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               {/* Left Column: Video Info */}
//               <div className="lg:col-span-2">
//                 <div className="flex items-center justify-between mb-6">
//                   <div className="flex items-center space-x-4">
//                     <Badge variant="secondary" className="text-xs px-3 py-1">
//                       {video.category}
//                     </Badge>
//                     <div className="flex items-center text-muted-foreground">
//                       <Clock className="w-4 h-4 mr-2" />
//                       <span>{video.duration}</span>
//                     </div>
//                     <div className="flex items-center text-muted-foreground">
//                       <span>{video.views} views</span>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Button variant="outline" size="sm" className="rounded-full">
//                       <Bookmark className="w-4 h-4 mr-2" />
//                       Save
//                     </Button>
//                   </div>
//                 </div>
                
//                 {/* Expert Information */}
//                 <div className="flex items-center mb-6 space-x-4 p-4 bg-accent/30 rounded-lg">
//                   {video.expertAvatar && (
//                     <img 
//                       src={video.expertAvatar} 
//                       alt={video.expert} 
//                       className="w-14 h-14 rounded-full object-cover"
//                     />
//                   )}
//                   <div className="flex-1">
//                     <div className="flex items-center">
//                       <User className="w-5 h-5 mr-2 text-primary" />
//                       <span className="font-semibold text-lg">{video.expert}</span>
//                     </div>
//                     {video.expertCredentials && (
//                       <p className="text-sm text-muted-foreground mt-1">
//                         {video.expertCredentials}
//                       </p>
//                     )}
//                   </div>
//                   <div className="flex items-center">
//                     <Star className="w-5 h-5 mr-1 text-yellow-500 fill-current" />
//                     <span className="font-semibold">{video.rating}</span>
//                   </div>
//                 </div>
                
//                 <div className="prose prose-sm max-w-none mb-8">
//                   <p className="text-muted-foreground text-base leading-relaxed">
//                     {video.fullDescription || video.description}
//                   </p>
//                 </div>
                
//                 {/* Learning Objectives */}
//                 {video.learningObjectives && (
//                   <div className="mb-8 relative overflow-hidden">
//                     {/* Background Pattern */}
//                     <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 rounded-2xl"></div>
//                     <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-200/30 to-transparent rounded-full blur-2xl"></div>
//                     <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full blur-xl"></div>
                    
//                     {/* Content */}
//                     <div className="relative p-8 border border-emerald-100/50 rounded-2xl backdrop-blur-sm">
//                       <div className="flex items-center mb-6">
//                         <div className="p-3 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl shadow-lg">
//                           <Star className="w-6 h-6 text-white" />
//                         </div>
//                         <div className="ml-4">
//                           <h4 className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-blue-700 bg-clip-text text-transparent">
//                             What You'll Learn
//                           </h4>
//                           <p className="text-sm text-muted-foreground">Key outcomes from this session</p>
//                         </div>
//                       </div>
                      
//                       <div className="grid gap-4">
//                         {video.learningObjectives.map((objective, index) => (
//                           <div key={index} className="flex items-start group">
//                             <div className="flex-shrink-0 mr-4 mt-1">
//                               <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-lg flex items-center justify-center group-hover:from-emerald-200 group-hover:to-blue-200 transition-all duration-300">
//                                 <span className="text-sm font-bold text-emerald-700">{index + 1}</span>
//                               </div>
//                             </div>
//                             <div className="flex-1 pt-1">
//                               <span className="text-foreground font-medium leading-relaxed group-hover:text-emerald-800 transition-colors duration-300">
//                                 {objective}
//                               </span>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
                      
//                       {/* Progress indicator */}
//                       <div className="mt-6 pt-6 border-t border-emerald-100/50">
//                         <div className="flex items-center text-sm text-muted-foreground">
//                           <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
//                           <span>Complete all objectives to master this topic</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
                
//                 {/* Related Topics */}
//                 {video.relatedTopics && (
//                   <div>
//                     <h4 className="text-lg font-semibold mb-4">
//                       Related Topics
//                     </h4>
//                     <div className="flex flex-wrap gap-2">
//                       {video.relatedTopics.map((topic, index) => (
//                         <Badge 
//                           key={index} 
//                           variant="secondary" 
//                           className="cursor-pointer hover:bg-primary hover:text-white transition-all duration-300 px-3 py-1"
//                         >
//                           {topic}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
              
//               {/* Right Column: Video Chapters */}
//               <div className="lg:border-l lg:pl-8">
//                 <h4 className="text-lg font-semibold mb-6 flex items-center">
//                   <Play className="w-5 h-5 mr-2 text-primary" />
//                   Video Chapters
//                 </h4>
//                 <div className="space-y-3">
//                   {/* Chapter 1 */}
//                   <div className="flex items-start bg-primary/5 rounded-lg p-3 hover:bg-primary/10 transition-all duration-300 cursor-pointer group border border-primary/20">
//                     <div className="flex-shrink-0 mr-3 relative">
//                       <img 
//                         src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=60&fit=crop&crop=center"
//                         alt="Behavioral patterns discussion"
//                         className="w-16 h-12 object-cover rounded-md"
//                       />
//                       <div className="absolute inset-0 bg-black/20 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                         <Play className="w-4 h-4 text-white" />
//                       </div>
//                       <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
//                         3:45
//                       </span>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between mb-1">
//                         <h5 className="font-semibold text-sm group-hover:text-primary transition-colors">
//                           Understanding Behavioral Patterns
//                         </h5>
//                         <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded font-medium">
//                           Playing
//                         </span>
//                       </div>
//                       <p className="text-xs text-muted-foreground leading-relaxed">
//                         Explore how behavioral patterns form and their impact on anxiety responses
//                       </p>
//                       <div className="mt-2 flex items-center text-xs text-muted-foreground">
//                         <div className="w-1 h-1 bg-primary rounded-full mr-1"></div>
//                         <span>0:00 - 3:45</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Chapter 2 */}
//                   <div className="flex items-start bg-accent/20 rounded-lg p-3 hover:bg-accent/40 transition-all duration-300 cursor-pointer group">
//                     <div className="flex-shrink-0 mr-3 relative">
//                       <img 
//                         src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=80&h=60&fit=crop&crop=center"
//                         alt="Wellness facts discussion"
//                         className="w-16 h-12 object-cover rounded-md"
//                       />
//                       <div className="absolute inset-0 bg-black/20 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                         <Play className="w-4 h-4 text-white" />
//                       </div>
//                       <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
//                         1:35
//                       </span>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between mb-1">
//                         <h5 className="font-semibold text-sm group-hover:text-emerald-700 transition-colors">
//                           Unknown Facts About Wellness
//                         </h5>
//                         <span className="text-xs text-muted-foreground bg-white/80 px-2 py-1 rounded">
//                           Next
//                         </span>
//                       </div>
//                       <p className="text-xs text-muted-foreground leading-relaxed">
//                         Surprising wellness insights that challenge common misconceptions
//                       </p>
//                       <div className="mt-2 flex items-center text-xs text-muted-foreground">
//                         <div className="w-1 h-1 bg-emerald-500 rounded-full mr-1"></div>
//                         <span>3:45 - 5:20</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Chapter 3 */}
//                   <div className="flex items-start bg-accent/20 rounded-lg p-3 hover:bg-accent/40 transition-all duration-300 cursor-pointer group">
//                     <div className="flex-shrink-0 mr-3 relative">
//                       <img 
//                         src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=60&fit=crop&crop=center"
//                         alt="Coping strategies demonstration"
//                         className="w-16 h-12 object-cover rounded-md"
//                       />
//                       <div className="absolute inset-0 bg-black/20 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                         <Play className="w-4 h-4 text-white" />
//                       </div>
//                       <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
//                         3:55
//                       </span>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between mb-1">
//                         <h5 className="font-semibold text-sm group-hover:text-orange-700 transition-colors">
//                           Practical Coping Strategies
//                         </h5>
//                       </div>
//                       <p className="text-xs text-muted-foreground leading-relaxed">
//                         Actionable techniques you can implement immediately for anxiety relief
//                       </p>
//                       <div className="mt-2 flex items-center text-xs text-muted-foreground">
//                         <div className="w-1 h-1 bg-orange-500 rounded-full mr-1"></div>
//                         <span>5:20 - 9:15</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Chapter 4 */}
//                   <div className="flex items-start bg-accent/20 rounded-lg p-3 hover:bg-accent/40 transition-all duration-300 cursor-pointer group">
//                     <div className="flex-shrink-0 mr-3 relative">
//                       <img 
//                         src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=80&h=60&fit=crop&crop=center"
//                         alt="Building resilience discussion"
//                         className="w-16 h-12 object-cover rounded-md"
//                       />
//                       <div className="absolute inset-0 bg-black/20 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                         <Play className="w-4 h-4 text-white" />
//                       </div>
//                       <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
//                         3:25
//                       </span>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between mb-1">
//                         <h5 className="font-semibold text-sm group-hover:text-purple-700 transition-colors">
//                           Building Long-term Resilience
//                         </h5>
//                       </div>
//                       <p className="text-xs text-muted-foreground leading-relaxed">
//                         Developing sustainable practices for lasting mental health improvement
//                       </p>
//                       <div className="mt-2 flex items-center text-xs text-muted-foreground">
//                         <div className="w-1 h-1 bg-purple-500 rounded-full mr-1"></div>
//                         <span>9:15 - 12:40</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Chapter 5 */}
//                   <div className="flex items-start bg-accent/20 rounded-lg p-3 hover:bg-accent/40 transition-all duration-300 cursor-pointer group">
//                     <div className="flex-shrink-0 mr-3 relative">
//                       <img 
//                         src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=80&h=60&fit=crop&crop=center"
//                         alt="Q&A session"
//                         className="w-16 h-12 object-cover rounded-md"
//                       />
//                       <div className="absolute inset-0 bg-black/20 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                         <Play className="w-4 h-4 text-white" />
//                       </div>
//                       <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
//                         5:50
//                       </span>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between mb-1">
//                         <h5 className="font-semibold text-sm group-hover:text-indigo-700 transition-colors">
//                           Q&A and Final Thoughts
//                         </h5>
//                       </div>
//                       <p className="text-xs text-muted-foreground leading-relaxed">
//                         Common questions answered and key takeaways for your journey
//                       </p>
//                       <div className="mt-2 flex items-center text-xs text-muted-foreground">
//                         <div className="w-1 h-1 bg-indigo-500 rounded-full mr-1"></div>
//                         <span>12:40 - 18:30</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>


//               </div>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };
// Video Modal Component - Netflix/Streaming Style
const VideoModal = ({ 
  video, 
  open, 
  onOpenChange 
}: { 
  video: VideoContent, 
  open: boolean, 
  onOpenChange: (open: boolean) => void 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentLesson, setCurrentLesson] = useState(1);
  
  // Mock lessons data
  const lessons = [
    {
      id: 1,
      title: "Understanding Your Triggers",
      description: "Identify what causes your cravings and learn to recognize patterns",
      duration: "12:30",
      thumbnail: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=250&fit=crop"
    },
    {
      id: 2,
      title: "Breaking the Sugar Cycle",
      description: "Learn the science behind sugar addiction and how to break free",
      duration: "15:45",
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      title: "Mindful Eating Techniques",
      description: "Develop awareness around your eating habits and food choices",
      duration: "18:20",
      thumbnail: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=250&fit=crop"
    },
    {
      id: 4,
      title: "Healthy Alternatives",
      description: "Discover satisfying alternatives to sugary foods and drinks",
      duration: "14:15",
      thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=250&fit=crop"
    },
    {
      id: 5,
      title: "Managing Withdrawal",
      description: "Navigate the challenges of sugar withdrawal with proven strategies",
      duration: "16:40",
      thumbnail: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=250&fit=crop"
    },
    {
      id: 6,
      title: "Building New Habits",
      description: "Create sustainable habits that support your sugar-free lifestyle",
      duration: "20:10",
      thumbnail: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=250&fit=crop"
    },
    {
      id: 7,
      title: "Long-term Success Strategies",
      description: "Maintain your progress and prevent relapse with these techniques",
      duration: "22:55",
      thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop"
    }
  ];

  // Mock community posts
  const communityPosts = [
    {
      id: 1,
      author: "Sarah M.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      timeAgo: "2 hours ago",
      content: "Day 30 sugar-free! This course changed my life. The withdrawal was tough but the strategies in lesson 5 really helped.",
      likes: 124,
      replies: 18
    },
    {
      id: 2,
      author: "John D.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      timeAgo: "5 hours ago",
      content: "Just finished lesson 3 about mindful eating. Never realized how much I was eating on autopilot. Anyone else have this revelation?",
      likes: 89,
      replies: 12
    },
    {
      id: 3,
      author: "Emily R.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      timeAgo: "1 day ago",
      content: "Success story: Lost 15 pounds in 2 months after breaking my sugar addiction. Energy levels are through the roof! 🚀",
      likes: 256,
      replies: 34
    }
  ];

  // Mock practice questions
  const practiceQuestions = [
    {
      id: 1,
      question: "What is the primary hormone responsible for sugar cravings?",
      options: ["Insulin", "Ghrelin", "Dopamine", "Cortisol"],
      correctAnswer: 2
    },
    {
      id: 2,
      question: "How long does it typically take to break a sugar addiction?",
      options: ["3-5 days", "1 week", "21-30 days", "6 months"],
      correctAnswer: 2
    },
    {
      id: 3,
      question: "Which strategy is most effective for managing sugar withdrawal symptoms?",
      options: ["Cold turkey approach", "Gradual reduction", "Substitution with artificial sweeteners", "Increased protein intake"],
      correctAnswer: 1
    }
  ];

  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [showResults, setShowResults] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[100vw] w-full h-[100vh] m-0 p-0 bg-black border-0 rounded-none overflow-hidden">
        {/* Make this container scrollable */}
        <div className="relative w-full h-full overflow-y-auto overflow-x-hidden bg-gradient-to-b from-zinc-900 to-black">
          
          {/* Close button - now fixed position */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="fixed top-4 right-4 z-50 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white w-10 h-10"
          >
            <X className="h-5 w-5" />
          </Button>
          
          {/* Video Player Section */}
          <div className="relative w-full">
            {video.videoUrl ? (
              <div className="relative w-full bg-black">
                <div className="relative mx-auto" style={{ maxWidth: '1400px' }}>
                  <div className="relative aspect-video w-full">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={video.videoUrl} 
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      allowFullScreen
                      className="w-full h-full"
                    />
                    
                    {/* Video Controls Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-8 pb-12">
                      <div className="max-w-[1400px] mx-auto">
                        {/* Current Lesson Indicator */}
                        <div className="mb-4">
                          <p className="text-white/80 text-sm">Lesson {currentLesson} of {lessons.length}</p>
                          <h2 className="text-white text-2xl font-bold">{lessons[currentLesson - 1].title}</h2>
                        </div>
                        {/* Playback controls */}
                        <div className="flex items-center gap-3">
                          <Button 
                            size="icon" 
                            className="rounded-full bg-white/20 backdrop-blur hover:bg-white/30 text-white"
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            className="rounded-full bg-white/20 backdrop-blur hover:bg-white/30 text-white"
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            className="rounded-full bg-white/20 backdrop-blur hover:bg-white/30 text-white"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-[50vh] bg-gradient-to-b from-zinc-800 to-zinc-900 flex items-center justify-center">
                <Play className="w-20 h-20 text-white/50" />
              </div>
            )}
          </div>
          
          {/* Content Section */}
          <div className="relative px-8 lg:px-12 pb-20">
            <div className="max-w-[1400px] mx-auto">
              
              {/* Title and Actions Row */}
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
                  <span className="px-2 py-0.5 border border-zinc-600 rounded text-xs">
                    HD
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {video.views}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <Button 
                    size="lg"
                    className="bg-white hover:bg-white/90 text-black font-bold rounded px-8"
                  >
                    <Play className="w-5 h-5 mr-2 fill-black" />
                    Play
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="bg-zinc-800/80 hover:bg-zinc-700 text-white border-zinc-700 rounded px-8"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    My List
                  </Button>
                  <Button 
                    size="icon"
                    variant="outline"
                    className="rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white border-zinc-700 w-12 h-12"
                  >
                    <ThumbsUp className="w-5 h-5" />
                  </Button>
                  <Button 
                    size="icon"
                    variant="outline"
                    className="rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white border-zinc-700 w-12 h-12"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              {/* Expert/Instructor Info */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">{video.expert}</p>
                  <p className="text-zinc-400 text-sm">Wellness Expert</p>
                </div>
              </div>
              
              {/* Tabs Navigation - Updated */}
              <div className="border-b border-zinc-800 mb-8">
                <div className="flex gap-8 overflow-x-auto">
                  {['Overview', 'Lessons', 'Practice', 'Community'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase())}
                      className={`pb-4 px-1 text-lg font-semibold transition-all relative whitespace-nowrap ${
                        activeTab === tab.toLowerCase()
                          ? 'text-white'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {tab}
                      {activeTab === tab.toLowerCase() && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500 rounded-t" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Tab Content */}
              <div className="pb-12">
                {activeTab === 'overview' && (
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Stats Cards - Updated */}
                    <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                      <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-6 border border-zinc-800">
                        <div className="flex items-center gap-3 mb-2">
                          <BookOpen className="w-5 h-5 text-purple-400" />
                          <span className="text-2xl font-bold text-white">{lessons.length} Lessons</span>
                        </div>
                        <p className="text-zinc-500 text-sm">Interactive content</p>
                      </div>
                      <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-6 border border-zinc-800">
                        <div className="flex items-center gap-3 mb-2">
                          <ThumbsUp className="w-5 h-5 text-blue-400" />
                          <span className="text-2xl font-bold text-white">80K Liked</span>
                        </div>
                        <p className="text-zinc-500 text-sm">Community approved</p>
                      </div>
                      <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-6 border border-zinc-800">
                        <div className="flex items-center gap-3 mb-2">
                          <Users className="w-5 h-5 text-green-400" />
                          <span className="text-2xl font-bold text-white">88,800 Enrolled</span>
                        </div>
                        <p className="text-zinc-500 text-sm">Active learners</p>
                      </div>
                    </div>
                    
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                      <h2 className="text-3xl font-bold text-white mb-4">
                        Stop craving, start living!
                      </h2>
                      <p className="text-zinc-300 text-lg leading-relaxed mb-6">
                        {video.fullDescription || video.description}
                      </p>
                      
                      <div className="prose prose-invert max-w-none">
                        <p className="text-zinc-400 leading-relaxed">
                          This program uses behavioural psychology and pattern interruption to modify the way 
                          your mind craves sugar. Transform your habits and enhance your life—start today!
                        </p>
                      </div>
                      
                      {/* Learning Points */}
                      {video.learningObjectives && (
                        <div className="mt-8">
                          <h3 className="text-xl font-bold text-white mb-4">What you'll learn</h3>
                          <div className="space-y-3">
                            {video.learningObjectives.map((objective, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Check className="w-3 h-3 text-purple-400" />
                                </div>
                                <span className="text-zinc-300">{objective}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                      <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-6 border border-zinc-800">
                        <h3 className="text-lg font-bold text-white mb-4">Course Details</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Category</span>
                            <span className="text-white">{video.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Level</span>
                            <span className="text-white">All Levels</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Rating</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-white">{video.rating}</span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Last Updated</span>
                            <span className="text-white">Dec 2024</span>
                          </div>
                        </div>
                        
                        <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white">
                          Start Learning
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'lessons' && (
                  <div className="space-y-4">
                    {lessons.map((lesson, index) => (
                      <div 
                        key={lesson.id}
                        onClick={() => setCurrentLesson(lesson.id)}
                        className={`flex gap-4 p-4 rounded-lg cursor-pointer transition-all ${
                          currentLesson === lesson.id 
                            ? 'bg-zinc-800/80 border border-purple-500/50' 
                            : 'bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800/50'
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
                            <Play className="w-8 h-8 text-white/80" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-1">{lesson.title}</h3>
                          <p className="text-zinc-400 text-sm mb-2">{lesson.description}</p>
                          <span className="text-zinc-500 text-xs">{lesson.duration}</span>
                        </div>
                        {currentLesson === lesson.id && (
                          <div className="text-purple-400 text-sm self-center">
                            Currently Playing
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* New Practice Tab */}
                {activeTab === 'practice' && (
                  <div className="space-y-6">
                    <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
                      <h3 className="text-xl font-bold text-white mb-4">Test Your Knowledge</h3>
                      <p className="text-zinc-400 mb-6">Answer these questions to reinforce your learning</p>
                      
                      {practiceQuestions.map((q, index) => (
                        <div key={q.id} className="mb-8 pb-8 border-b border-zinc-800 last:border-0">
                          <h4 className="text-white font-semibold mb-4">
                            Question {index + 1}: {q.question}
                          </h4>
                          <div className="space-y-3">
                            {q.options.map((option, optionIndex) => (
                              <label
                                key={optionIndex}
                                className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                                  selectedAnswers[q.id] === optionIndex
                                    ? 'bg-purple-900/30 border-purple-500'
                                    : 'bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${q.id}`}
                                  className="mr-3"
                                  checked={selectedAnswers[q.id] === optionIndex}
                                  onChange={() => setSelectedAnswers({...selectedAnswers, [q.id]: optionIndex})}
                                />
                                <span className="text-white">{option}</span>
                                {showResults && q.correctAnswer === optionIndex && (
                                  <Check className="w-5 h-5 text-green-500 ml-auto" />
                                )}
                                {showResults && selectedAnswers[q.id] === optionIndex && q.correctAnswer !== optionIndex && (
                                  <X className="w-5 h-5 text-red-500 ml-auto" />
                                )}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      <div className="flex gap-4">
                        <Button 
                          onClick={() => setShowResults(!showResults)}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          {showResults ? 'Hide Results' : 'Check Answers'}
                        </Button>
                        {showResults && (
                          <Button 
                            onClick={() => {
                              setSelectedAnswers({});
                              setShowResults(false);
                            }}
                            variant="outline"
                            className="border-zinc-700 text-white hover:bg-zinc-800"
                          >
                            Reset Quiz
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* New Community Tab */}
                {activeTab === 'community' && (
                  <div className="space-y-6">
                    {/* Post Input */}
                    <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500"></div>
                        <div className="flex-1">
                          <textarea 
                            placeholder="Share your thoughts, experiences, or success story..."
                            className="w-full bg-zinc-800 text-white placeholder-zinc-500 rounded-lg p-3 border border-zinc-700 focus:border-purple-500 focus:outline-none resize-none"
                            rows={3}
                          />
                          <div className="flex justify-end mt-3">
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Community Posts */}
                    {communityPosts.map((post) => (
                      <div key={post.id} className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
                        <div className="flex gap-4">
                          <img 
                            src={post.avatar} 
                            alt={post.author}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <span className="text-white font-semibold">{post.author}</span>
                                <span className="text-zinc-500 text-sm ml-2">{post.timeAgo}</span>
                              </div>
                            </div>
                            <p className="text-zinc-300 mb-4">{post.content}</p>
                            <div className="flex items-center gap-6 text-sm">
                              <button className="flex items-center gap-2 text-zinc-400 hover:text-purple-400 transition-colors">
                                <ThumbsUp className="w-4 h-4" />
                                <span>{post.likes}</span>
                              </button>
                              <button className="flex items-center gap-2 text-zinc-400 hover:text-purple-400 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span>{post.replies} replies</span>
                              </button>
                              <button className="flex items-center gap-2 text-zinc-400 hover:text-purple-400 transition-colors ml-auto">
                                <Share2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="text-center">
                      <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                        Load More Posts
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Episodes/Lessons Section - Netflix Style */}
              <div className="mt-16 border-t border-zinc-800 pt-12">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-white">Episodes</h2>
                  <span className="text-zinc-400">{lessons.length} lessons</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {lessons.map((lesson, index) => (
                    <div 
                      key={lesson.id}
                      onClick={() => setCurrentLesson(lesson.id)}
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                        <img 
                          src={lesson.thumbnail} 
                          alt={lesson.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Play overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/90 rounded-full p-3">
                              <Play className="w-6 h-6 text-black fill-black" />
                            </div>
                          </div>
                        </div>
                        {/* Duration badge */}
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                          {lesson.duration}
                        </div>
                        {/* Episode number */}
                        <div className="absolute top-2 left-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">
                          {index + 1}
                        </div>
                        {/* Progress bar (for watched episodes) */}
                        {currentLesson > lesson.id && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-700">
                            <div className="h-full bg-purple-500 w-full"></div>
                          </div>
                        )}
                        {currentLesson === lesson.id && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-700">
                            <div className="h-full bg-purple-500 w-1/3"></div>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-white font-semibold mb-1 group-hover:text-purple-400 transition-colors line-clamp-1">
                          {index + 1}. {lesson.title}
                        </h3>
                        <p className="text-zinc-500 text-sm line-clamp-2">
                          {lesson.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* More Like This Section */}
              <div className="mt-16 border-t border-zinc-800 pt-12">
                <h2 className="text-2xl font-bold text-white mb-8">More Like This</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {videos.slice(0, 4).map((relatedVideo) => (
                    <div key={relatedVideo.id} className="group cursor-pointer">
                      <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                        <img 
                          src={relatedVideo.thumbnail} 
                          alt={relatedVideo.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-sm font-semibold line-clamp-1">{relatedVideo.title}</p>
                        </div>
                      </div>
                    </div>
                  ))}
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