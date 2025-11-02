// Expert types for Better & Bliss

export interface Expert {
  id: string;
  name: string;
  credentials: string;
  specialty: string;
  avatar: string;
  bio: string;
  expertise: string[];
  yearsOfExperience: number;
  totalVideos?: number;
  education?: string[];
  certifications?: string[];
  linkedIn?: string;
  featured?: boolean;
}

export type ExpertSpecialty =
  | 'Clinical Psychologists'
  | 'Mindfulness Instructors'
  | 'Relationship Therapists'
  | 'Addiction Counselors'
  | 'Trauma Specialists'
  | 'Life Coaches';
