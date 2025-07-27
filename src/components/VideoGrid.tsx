import { Play, Clock, User, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const videos = [
  {
    id: 1,
    title: "Understanding Anxiety: A Complete Guide",
    expert: "Dr. Sarah Johnson",
    duration: "18:30",
    category: "Mental Health",
    rating: 4.9,
    views: "12.5k",
    thumbnail: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=250&fit=crop",
    isNew: true
  },
  {
    id: 2,
    title: "5-Minute Morning Meditation for Peace",
    expert: "Michael Chen",
    duration: "5:12",
    category: "Mindfulness",
    rating: 4.8,
    views: "8.3k",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    isNew: false
  },
  {
    id: 3,
    title: "Breaking the Cycle of Negative Thinking",
    expert: "Dr. Emily Rodriguez",
    duration: "22:45",
    category: "Mental Health",
    rating: 4.9,
    views: "15.2k",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
    isNew: false
  },
  {
    id: 4,
    title: "How Economic Stress Affects Mental Health",
    expert: "Prof. David Williams",
    duration: "28:15",
    category: "Social Wellness",
    rating: 4.7,
    views: "6.8k",
    thumbnail: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=250&fit=crop",
    isNew: true
  },
  {
    id: 5,
    title: "Building Healthy Relationships",
    expert: "Dr. Lisa Parker",
    duration: "16:20",
    category: "Emotional Wellness",
    rating: 4.8,
    views: "9.7k",
    thumbnail: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=250&fit=crop",
    isNew: false
  },
  {
    id: 6,
    title: "Overcoming Addiction: First Steps",
    expert: "Dr. Mark Thompson",
    duration: "31:40",
    category: "Breaking Habits",
    rating: 4.9,
    views: "11.4k",
    thumbnail: "https://images.unsplash.com/photo-1559757175-0eb4d9f64d29?w=400&h=250&fit=crop",
    isNew: false
  }
];

const VideoGrid = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Featured Content
            </h2>
            <p className="text-xl text-muted-foreground">
              Expert-curated videos to transform your mental wellness journey
            </p>
          </div>
          <div className="hidden md:flex space-x-4">
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-smooth">
              All
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-smooth">
              Most Popular
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-smooth">
              New Releases
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card 
              key={video.id} 
              className="cursor-pointer group overflow-hidden"
            >
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-smooth flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-white/90 rounded-full p-3">
                    <Play className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="absolute top-3 left-3">
                  {video.isNew && (
                    <Badge className="bg-primary text-primary-foreground">
                      New
                    </Badge>
                  )}
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {video.duration}
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {video.category}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-smooth">
                  {video.title}
                </h3>
                
                <div className="flex items-center text-muted-foreground text-sm mb-3">
                  <User className="w-3 h-3 mr-1" />
                  <span>{video.expert}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Star className="w-3 h-3 mr-1 text-yellow-500" />
                    <span>{video.rating}</span>
                    <span className="mx-2">•</span>
                    <span>{video.views} views</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Badge 
            variant="outline" 
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-smooth px-6 py-2"
          >
            Load More Videos
          </Badge>
        </div>
      </div>
    </section>
  );
};

export default VideoGrid;