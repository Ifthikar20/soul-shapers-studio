"use client";

import React from "react";
import { Users, Star, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Import custom logo images
import logoBrain from "@/assets/logo-brain.png";
import logoHeart from "@/assets/logo-heart.png";
import logoLeaf from "@/assets/logo-leaf.png";
import logoTarget from "@/assets/logo-target.png";

const fadeInUp = "opacity-0 translate-y-6 animate-fadeInUp";

const categories = [
  { id: 1, title: "Mental Health", description: "Anxiety, depression, stress management", icon: logoBrain, videoCount: 150, color: "text-purple-500", trending: true, isImage: true },
  { id: 2, title: "Mindfulness & Meditation", description: "Meditation techniques, mindful living", icon: logoLeaf, videoCount: 120, color: "text-green-500", trending: false, isImage: true },
  { id: 3, title: "Emotional Wellness", description: "Emotional intelligence, relationships", icon: logoHeart, videoCount: 95, color: "text-pink-500", trending: true, isImage: true },
  { id: 4, title: "Breaking Habits", description: "Addiction recovery, habit formation", icon: logoTarget, videoCount: 80, color: "text-orange-500", trending: false, isImage: true },
  { id: 5, title: "Social Wellness", description: "Communication, boundaries, relationships", icon: Users, videoCount: 75, color: "text-blue-500", trending: false, isImage: false },
  { id: 6, title: "Personal Growth", description: "Self-improvement, goal setting", icon: Star, videoCount: 110, color: "text-yellow-500", trending: true, isImage: false }
];

const Categories = () => {
  return (
    <section className="py-20 bg-gradient-secondary relative overflow-hidden">
      {/* Floating Background Glow */}
      <div className="absolute top-10 right-20 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-float-slower" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-6 py-2 bg-gradient-card border border-primary/20 text-primary rounded-full shadow-sm">
            <Zap className="w-3 h-4 mr-2" />
            Curated Categories
          </Badge>
          <h2 className="text-4xl md:text-4xl font-bold text-foreground mb-4">
            Explore Wellness{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Categories
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Discover expert content across different mental health and wellness topics.
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, i) => (
            <Card
              key={category.id}
              className={`relative overflow-hidden cursor-pointer transform transition duration-500 ease-out hover:scale-[1.02] hover:shadow-lg ${fadeInUp}`}
              style={{ animationDelay: `${i * 150}ms` }} // stagger effect
            >
              {category.trending && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-primary text-white border-0 rounded-full px-3 py-1 text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending
                  </Badge>
                </div>
              )}

              <CardContent className="p-6 group">
                <div className="flex gap-4 items-start">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {category.isImage ? (
                      <img 
                        src={category.icon as string} 
                        alt={`${category.title} icon`}
                        className="w-14 h-14"
                      />
                    ) : (
                      <category.icon className={`w-14 h-14 ${category.color}`} />
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2 transition-colors group-hover:text-primary">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="rounded-full text-xs px-3 py-1">
                        {category.videoCount} videos
                      </Badge>
                      <span className="text-sm text-primary font-medium flex items-center transform transition duration-300 group-hover:translate-x-1">
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

      {/* Inline animations to mimic Framer Motion */}
      <style>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(24px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float-slow {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float 12s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Categories;