// Expert types for Better & Bliss

export interface Expert {
  id: string;
  name: string;
  credentials: string;
  specialty: string;
  avatar: string;
  bio: string;
  shortBio: string;
  expertise: string[];
  yearsOfExperience: number;
  rating: number;
  totalSessions?: number;
  totalVideos?: number;
  education?: string[];
  certifications?: string[];
  languages?: string[];
  approach?: string;
  availability?: 'available' | 'limited' | 'unavailable';
  featured?: boolean;
}

export type ExpertSpecialty =
  | 'Clinical Psychologists'
  | 'Mindfulness Instructors'
  | 'Relationship Therapists'
  | 'Addiction Counselors'
  | 'Trauma Specialists'
  | 'Life Coaches';
