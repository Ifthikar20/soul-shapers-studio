import { Play, Clock, User, Star, TrendingUp, Bookmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
    isNew: true,
    isTrending: true
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
    isNew: false,
    isTrending: false
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
    isNew: false,
    isTrending: true
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
    isNew: true,
    isTrending: false
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
    isNew: false,
    isTrending: false
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
    isNew: false,
    isTrending: true
  }
];

const VideoGrid = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-between items-center mb-16">
          <div className="text-center md:text-left">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Featured
              <span className="bg-gradient-primary bg-clip-text text-transparent block">
                Content
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl">
              Expert-curated videos for your wellness needs
            </p>
          </div>
          <div className="hidden lg:flex space-x-3">
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-smooth px-4 py-2 rounded-full">
              All
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-smooth px-4 py-2 rounded-full">
              Most Popular
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-smooth px-4 py-2 rounded-full">
              New Releases
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <Card 
              key={video.id} 
              className="cursor-pointer group overflow-hidden hover:scale-[1.02] transition-smooth"
            >
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-52 object-cover group-hover:scale-110 transition-smooth"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                  <div className="bg-white/95 rounded-full p-4 shadow-glow">
                    <Play className="w-8 h-8 text-primary" />
                  </div>
                </div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {video.isNew && (
                    <Badge className="bg-gradient-primary text-white border-0 rounded-full px-3 py-1 text-xs font-medium">
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

                <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-smooth hover:bg-white">
                  <Bookmark className="w-4 h-4 text-primary" />
                </button>
              </div>
              
              <CardContent className="p-6">
                <div className="mb-3">
                  <Badge variant="secondary" className="text-xs rounded-full px-3 py-1">
                    {video.category}
                  </Badge>
                </div>
                
                <h3 className="font-bold text-lg text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-smooth leading-tight">
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
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-smooth text-primary hover:bg-primary/10 rounded-full">
                    Watch
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Button 
            variant="outline" 
            size="lg"
            className="rounded-full px-8 py-3 text-base hover:bg-primary hover:text-white transition-smooth"
          >
            Load More Videos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VideoGrid;