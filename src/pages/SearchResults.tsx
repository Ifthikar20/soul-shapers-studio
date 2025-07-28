import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, Play, Clock, User, Star, Filter, Grid, List, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import betterBlissLogo from "@/assets/betterandblisslogo.png";

const mockVideos = [
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
    description: "Learn the fundamentals of anxiety disorders and effective coping strategies."
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
    description: "Start your day with mindful meditation practices for inner peace."
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
    description: "Transform negative thought patterns with cognitive behavioral techniques."
  }
];

const mockExperts = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Anxiety & Depression",
    experience: "15+ years",
    rating: 4.9,
    videos: 45,
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
    verified: true
  },
  {
    id: 2,
    name: "Michael Chen",
    specialty: "Mindfulness & Meditation",
    experience: "12+ years",
    rating: 4.8,
    videos: 32,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    verified: true
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Cognitive Behavioral Therapy",
    experience: "18+ years",
    rating: 4.9,
    videos: 67,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c0763c95?w=100&h=100&fit=crop&crop=face",
    verified: true
  }
];

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [currentQuery, setCurrentQuery] = useState(query);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'videos' | 'experts'>('all');

  const handleBack = () => {
    navigate('/');
  };

  const filteredVideos = mockVideos.filter(video => 
    video.title.toLowerCase().includes(currentQuery.toLowerCase()) ||
    video.expert.toLowerCase().includes(currentQuery.toLowerCase()) ||
    video.category.toLowerCase().includes(currentQuery.toLowerCase())
  );

  const filteredExperts = mockExperts.filter(expert =>
    expert.name.toLowerCase().includes(currentQuery.toLowerCase()) ||
    expert.specialty.toLowerCase().includes(currentQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-secondary relative overflow-hidden">
      {/* Curved Background Wallpaper */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[400px] bg-gradient-to-br from-primary/6 to-purple-400/4 rounded-[40%_60%_70%_30%] blur-3xl animate-pulse rotate-12"></div>
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[350px] bg-gradient-to-tl from-purple-500/6 to-primary/4 rounded-[60%_40%_30%_70%] blur-3xl animate-pulse delay-1000 -rotate-12"></div>
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-gradient-to-r from-primary/3 to-transparent rounded-[50%_30%_70%_50%] blur-2xl animate-pulse delay-500 rotate-45"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-gradient-card/80 backdrop-blur-xl border-b border-border/20 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="text-muted-foreground hover:text-foreground mr-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div className="relative">
                  <img 
                    src={betterBlissLogo} 
                    alt="Better & Bliss" 
                    className="w-12 h-12 rounded-2xl object-cover shadow-soft"
                  />
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-2xl mx-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search wellness topics, experts, case studies..."
                    value={currentQuery}
                    onChange={(e) => setCurrentQuery(e.target.value)}
                    className="pl-12 pr-4 h-12 rounded-2xl bg-gradient-card border-2 border-border/20 focus:border-primary/40 shadow-card text-base"
                  />
                </div>
              </div>

              {/* View Controls */}
              <div className="flex items-center space-x-3">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-full"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-full"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Results */}
        <main className="container mx-auto px-4 py-8">
          {/* Search Info */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Search Results
              {query && (
                <span className="text-muted-foreground text-xl ml-2">
                  for "{query}"
                </span>
              )}
            </h2>
            <p className="text-muted-foreground">
              Found {filteredVideos.length} videos and {filteredExperts.length} experts
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-4 mb-8">
            <Button
              variant={activeTab === 'all' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('all')}
              className="rounded-full"
            >
              All Results
            </Button>
            <Button
              variant={activeTab === 'videos' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('videos')}
              className="rounded-full"
            >
              Videos ({filteredVideos.length})
            </Button>
            <Button
              variant={activeTab === 'experts' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('experts')}
              className="rounded-full"
            >
              Experts ({filteredExperts.length})
            </Button>
          </div>

          {/* Videos Section */}
          {(activeTab === 'all' || activeTab === 'videos') && filteredVideos.length > 0 && (
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-foreground mb-6">Videos</h3>
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredVideos.map((video) => (
                  <Card 
                    key={video.id} 
                    className={`group hover:shadow-hover transition-smooth cursor-pointer border-border/20 overflow-hidden ${
                      viewMode === 'list' ? 'flex flex-row' : ''
                    }`}
                  >
                    <div className={`relative ${viewMode === 'list' ? 'w-80 flex-shrink-0' : ''}`}>
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className={`w-full object-cover transition-smooth group-hover:scale-105 ${
                          viewMode === 'list' ? 'h-full' : 'h-48'
                        }`}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-glow">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>
                      <div className="absolute top-3 left-3 flex gap-2">
                        {video.isNew && (
                          <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                            New
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-xs px-2 py-1 rounded-full">
                          {video.category}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <Badge variant="secondary" className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                          <Clock className="w-3 h-3 mr-1" />
                          {video.duration}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <h4 className="font-bold text-foreground mb-2 group-hover:text-primary transition-smooth line-clamp-2">
                        {video.title}
                      </h4>
                      {viewMode === 'list' && (
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {video.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          <span>{video.expert}</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                          <span>{video.rating}</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {video.views} views
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Experts Section */}
          {(activeTab === 'all' || activeTab === 'experts') && filteredExperts.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-foreground mb-6">Experts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExperts.map((expert) => (
                  <Card key={expert.id} className="group hover:shadow-hover transition-smooth cursor-pointer border-border/20">
                    <CardContent className="p-6 text-center">
                      <div className="relative inline-block mb-4">
                        <img 
                          src={expert.avatar} 
                          alt={expert.name}
                          className="w-20 h-20 rounded-full object-cover mx-auto shadow-soft"
                        />
                        {expert.verified && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <h4 className="font-bold text-foreground mb-2 group-hover:text-primary transition-smooth">
                        {expert.name}
                      </h4>
                      
                      <p className="text-muted-foreground text-sm mb-3">
                        {expert.specialty}
                      </p>
                      
                      <div className="flex items-center justify-center text-sm text-muted-foreground mb-3">
                        <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                        <span className="mr-4">{expert.rating}</span>
                        <span>{expert.experience}</span>
                      </div>
                      
                      <Badge variant="secondary" className="text-xs px-3 py-1 rounded-full">
                        {expert.videos} videos
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* No Results */}
          {filteredVideos.length === 0 && filteredExperts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">No results found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or browse our featured content
              </p>
              <Button variant="outline" className="rounded-full">
                Browse All Content
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchResults;