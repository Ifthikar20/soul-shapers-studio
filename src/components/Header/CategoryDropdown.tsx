// src/components/Header/CategoryDropdown.tsx
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Brain, Leaf, Heart, Users, Star, Target } from "lucide-react";

const categories = [
  {
    id: 'mental-health',
    name: 'Mental Health',
    icon: Brain,
    subcategories: [
      'Anxiety & Stress',
      'Depression Support', 
      'Panic Disorders',
      'Trauma Recovery',
      'Cognitive Behavioral Therapy'
    ]
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness & Meditation',
    icon: Leaf,
    subcategories: [
      'Guided Meditation',
      'Breathing Techniques',
      'Body Scan',
      'Walking Meditation',
      'Loving Kindness'
    ]
  },
  {
    id: 'emotional-wellness',
    name: 'Emotional Wellness',
    icon: Heart,
    subcategories: [
      'Emotional Intelligence',
      'Mood Management',
      'Self-Compassion',
      'Emotional Regulation',
      'Inner Child Work'
    ]
  },
  {
    id: 'relationships',
    name: 'Relationships',
    icon: Users,
    subcategories: [
      'Communication Skills',
      'Boundary Setting',
      'Conflict Resolution',
      'Dating & Romance',
      'Family Dynamics'
    ]
  },
  {
    id: 'personal-growth',
    name: 'Personal Growth',
    icon: Star,
    subcategories: [
      'Goal Setting',
      'Habit Formation',
      'Self-Discovery',
      'Confidence Building',
      'Life Transitions'
    ]
  },
  {
    id: 'breaking-habits',
    name: 'Breaking Habits',
    icon: Target,
    subcategories: [
      'Addiction Recovery',
      'Smoking Cessation',
      'Digital Detox',
      'Negative Patterns',
      'Compulsive Behaviors'
    ]
  }
];

interface CategoryDropdownProps {
  isScrolled: boolean;
  onCategoryClick: (categorySlug: string, subcategory?: string) => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ isScrolled, onCategoryClick }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className={`font-medium flex items-center gap-1 transition-all duration-300 focus:outline-none hover-stable ${
            isScrolled
              ? 'text-foreground hover:text-primary'
              : 'text-white hover:text-white/80'
          }`}
        >
          Categories
          <ChevronDown className="w-3 h-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 max-h-96 overflow-y-auto dropdown-fixed"
        align="center"
        sideOffset={12}
        avoidCollisions={false}
        side="bottom"
      >
        <DropdownMenuLabel className="text-center font-semibold">Browse by Category</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="grid grid-cols-2 gap-1 p-2">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div key={category.id} className="space-y-1">
                <DropdownMenuItem
                  onClick={() => onCategoryClick(category.id)}
                  className="font-semibold text-primary hover:bg-primary/10 p-2 rounded-md cursor-pointer"
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {category.name}
                </DropdownMenuItem>
                
                <div className="ml-6 space-y-0.5">
                  {category.subcategories.slice(0, 3).map((subcategory) => (
                    <DropdownMenuItem
                      key={subcategory}
                      onClick={() => onCategoryClick(category.id, subcategory)}
                      className="text-xs text-muted-foreground hover:text-foreground cursor-pointer py-1"
                    >
                      {subcategory}
                    </DropdownMenuItem>
                  ))}
                  {category.subcategories.length > 3 && (
                    <DropdownMenuItem
                      onClick={() => onCategoryClick(category.id)}
                      className="text-xs text-primary hover:underline cursor-pointer py-1"
                    >
                      View all {category.subcategories.length} topics →
                    </DropdownMenuItem>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoryDropdown;