export interface ExpertData {
    id: number;
    name: string;
    email: string;
    phone: string;
    specialties: string[];
    credentials: string;
    experience: string;
    bio: string;
    avatar: string;
    coverImage: string;
    verified: boolean;
    featured: boolean;
    status: 'active' | 'inactive';
    rating: number;
    totalVideos: number;
    totalViews: string;
    joinDate: string;
    lastActive: string;
    socialLinks: SocialLinks;
    education: Education[];
    certifications: string[];
    languages: string[];
    location: string;
  }
  
  export interface SocialLinks {
    website?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  }
  
  export interface Education {
    degree: string;
    institution: string;
    year: string;
  }