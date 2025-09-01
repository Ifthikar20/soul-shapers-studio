// src/components/Header/ExpertDropdown.tsx
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Users } from "lucide-react";

const expertSpecialties = [
  {
    name: 'Clinical Psychologists',
    description: 'Licensed mental health professionals'
  },
  {
    name: 'Mindfulness Instructors', 
    description: 'Certified meditation teachers'
  },
  {
    name: 'Relationship Therapists',
    description: 'Marriage and family specialists'
  },
  {
    name: 'Addiction Counselors',
    description: 'Substance abuse experts'
  },
  {
    name: 'Trauma Specialists',
    description: 'PTSD and trauma recovery experts'
  },
  {
    name: 'Life Coaches',
    description: 'Personal development guides'
  }
];

interface ExpertDropdownProps {
  isScrolled: boolean;
  onExpertClick: (specialty?: string) => void;
}

const ExpertDropdown: React.FC<ExpertDropdownProps> = ({ isScrolled, onExpertClick }) => {
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
          Experts
          <ChevronDown className="w-3 h-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 dropdown-fixed"
        align="center"
        sideOffset={12}
        avoidCollisions={false}
        side="bottom"
      >
        <DropdownMenuLabel>Find Expert Help</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => onExpertClick()}>
          <Users className="w-4 h-4 mr-2 text-primary" />
          All Experts
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          By Specialty
        </DropdownMenuLabel>
        
        {expertSpecialties.map((specialty) => (
          <DropdownMenuItem
            key={specialty.name}
            onClick={() => onExpertClick(specialty.name)}
            className="cursor-pointer"
          >
            <div>
              <div className="font-medium text-sm">{specialty.name}</div>
              <div className="text-xs text-muted-foreground">{specialty.description}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExpertDropdown;