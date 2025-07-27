import { Brain, Heart, Leaf, Target, Users, Star, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = [
  {
    id: 1,
    title: "Mental Health",
    description: "Anxiety, depression, stress management",
    icon: Brain,
    videoCount: 150,
    color: "text-purple-500",
    trending: true
  },
  {
    id: 2,
    title: "Mindfulness & Meditation",
    description: "Meditation techniques, mindful living",
    icon: Leaf,
    videoCount: 120,
    color: "text-green-500",
    trending: false
  },
  {
    id: 3,
    title: "Emotional Wellness",
    description: "Emotional intelligence, relationships",
    icon: Heart,
    videoCount: 95,
    color: "text-pink-500",
    trending: true
  },
  {
    id: 4,
    title: "Breaking Habits",
    description: "Addiction recovery, habit formation",
    icon: Target,
    videoCount: 80,
    color: "text-orange-500",
    trending: false
  },
  {
    id: 5,
    title: "Social Wellness",
    description: "Communication, boundaries, relationships",
    icon: Users,
    videoCount: 75,
    color: "text-blue-500",
    trending: false
  },
  {
    id: 6,
    title: "Personal Growth",
    description: "Self-improvement, goal setting",
    icon: Star,
    videoCount: 110,
    color: "text-yellow-500",
    trending: true
  }
];

const Categories = () => {
  return (
    <section className="py-24 bg-gradient-secondary relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-60 h-60 bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <Badge className="mb-6 px-6 py-2 bg-gradient-card border border-primary/20 text-primary font-medium rounded-full shadow-soft">
            <Zap className="w-4 h-4 mr-2" />
            Curated Categories
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Explore Wellness
            <span className="bg-gradient-primary bg-clip-text text-transparent block">
              Categories
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover expert content across various mental health and wellness topics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Card 
              key={category.id} 
              className="cursor-pointer group hover:scale-[1.02] transition-smooth relative overflow-hidden"
            >
              {category.trending && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-gradient-primary text-white border-0 rounded-full px-3 py-1 text-xs font-medium">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending
                  </Badge>
                </div>
              )}
              
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className={`p-4 rounded-2xl bg-gradient-card shadow-soft group-hover:shadow-hover transition-smooth ${category.color} relative`}>
                    <category.icon className="w-8 h-8" />
                    <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 rounded-2xl transition-smooth"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-smooth">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="rounded-full text-xs font-medium px-3 py-1">
                        {category.videoCount} videos
                      </Badge>
                      <span className="text-sm text-primary font-medium group-hover:translate-x-1 transition-smooth flex items-center">
                        Explore →
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;