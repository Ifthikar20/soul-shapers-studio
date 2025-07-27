import { Brain, Heart, Leaf, Target, Users, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    id: 1,
    title: "Mental Health",
    description: "Anxiety, depression, stress management",
    icon: Brain,
    videoCount: 150,
    color: "text-blue-500"
  },
  {
    id: 2,
    title: "Mindfulness & Meditation",
    description: "Meditation techniques, mindful living",
    icon: Leaf,
    videoCount: 120,
    color: "text-green-500"
  },
  {
    id: 3,
    title: "Emotional Wellness",
    description: "Emotional intelligence, relationships",
    icon: Heart,
    videoCount: 95,
    color: "text-red-500"
  },
  {
    id: 4,
    title: "Breaking Habits",
    description: "Addiction recovery, habit formation",
    icon: Target,
    videoCount: 80,
    color: "text-purple-500"
  },
  {
    id: 5,
    title: "Social Wellness",
    description: "Communication, boundaries, relationships",
    icon: Users,
    videoCount: 75,
    color: "text-orange-500"
  },
  {
    id: 6,
    title: "Personal Growth",
    description: "Self-improvement, goal setting",
    icon: Star,
    videoCount: 110,
    color: "text-yellow-500"
  }
];

const Categories = () => {
  return (
    <section className="py-20 bg-gradient-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Explore Wellness Categories
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover expert content across various mental health and wellness topics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card 
              key={category.id} 
              className="cursor-pointer group hover:scale-105 transition-smooth"
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-accent ${category.color}`}>
                    <category.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-primary font-medium">
                        {category.videoCount} videos
                      </span>
                      <span className="text-sm text-muted-foreground group-hover:text-primary transition-smooth">
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