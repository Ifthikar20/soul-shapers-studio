// Dummy expert data for Better & Bliss
import { Expert } from '@/types/expert.types';

export const dummyExperts: Expert[] = [
  {
    id: 'expert-001',
    name: 'Dr. Sarah Johnson',
    credentials: 'Ph.D., Clinical Psychologist',
    specialty: 'Clinical Psychologists',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    bio: 'Dr. Sarah Johnson is a licensed clinical psychologist with over 15 years of experience helping individuals overcome anxiety, depression, and stress-related challenges. She combines evidence-based cognitive behavioral therapy (CBT) with mindfulness techniques to create personalized treatment plans.',
    expertise: ['Anxiety Disorders', 'Depression', 'Stress Management', 'CBT'],
    yearsOfExperience: 15,
    totalVideos: 45,
    education: [
      'Ph.D. in Clinical Psychology - Stanford University',
      'M.A. in Psychology - University of California, Berkeley'
    ],
    certifications: [
      'Licensed Clinical Psychologist (California)',
      'Certified CBT Therapist'
    ],
    linkedIn: 'https://linkedin.com/in/sarah-johnson-phd',
    featured: true
  },
  {
    id: 'expert-002',
    name: 'Dr. Michael Chen',
    credentials: 'Ph.D., Mindfulness Instructor',
    specialty: 'Mindfulness Instructors',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    bio: 'Dr. Michael Chen has dedicated over 20 years to the practice and teaching of mindfulness and meditation. Trained in both Eastern contemplative traditions and Western psychology, he bridges ancient wisdom with modern neuroscience.',
    expertise: ['Meditation', 'Mindfulness', 'Stress Reduction', 'Breathwork'],
    yearsOfExperience: 20,
    totalVideos: 67,
    education: [
      'Ph.D. in Contemplative Studies - Naropa University',
      'M.A. in Buddhist Studies - University of Wisconsin-Madison'
    ],
    certifications: [
      'Certified MBSR Teacher',
      'Vipassana Meditation Teacher'
    ],
    linkedIn: 'https://linkedin.com/in/michael-chen-mindfulness',
    featured: true
  },
  {
    id: 'expert-003',
    name: 'Dr. Emily Rodriguez',
    credentials: 'LMFT, Relationship Therapist',
    specialty: 'Relationship Therapists',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    bio: 'Dr. Emily Rodriguez is a licensed marriage and family therapist who specializes in helping couples and families navigate relationship challenges. With 12 years of experience, she uses evidence-based approaches including Gottman Method and Emotionally Focused Therapy (EFT).',
    expertise: ['Couples Therapy', 'Communication Skills', 'Conflict Resolution', 'Intimacy'],
    yearsOfExperience: 12,
    totalVideos: 38,
    education: [
      'Ph.D. in Marriage and Family Therapy - Alliant International University',
      'M.S. in Counseling Psychology - Northwestern University'
    ],
    certifications: [
      'Licensed Marriage and Family Therapist (LMFT)',
      'Certified Gottman Therapist'
    ],
    linkedIn: 'https://linkedin.com/in/emily-rodriguez-lmft',
    featured: true
  },
  {
    id: 'expert-004',
    name: 'Dr. James Thompson',
    credentials: 'CAC, Addiction Counselor',
    specialty: 'Addiction Counselors',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    bio: 'Dr. James Thompson is a certified addiction counselor with over 18 years of experience helping individuals overcome substance abuse and behavioral addictions. He specializes in holistic recovery approaches that address the physical, emotional, and spiritual aspects of addiction.',
    expertise: ['Substance Abuse', 'Recovery Programs', 'Relapse Prevention', 'Dual Diagnosis'],
    yearsOfExperience: 18,
    totalVideos: 42,
    education: [
      'Ph.D. in Addiction Studies - Hazelden Betty Ford Graduate School',
      'M.A. in Counseling - Columbia University'
    ],
    certifications: [
      'Certified Addiction Counselor (CAC)',
      'Licensed Professional Counselor (LPC)'
    ],
    linkedIn: 'https://linkedin.com/in/james-thompson-cac',
    featured: false
  },
  {
    id: 'expert-005',
    name: 'Dr. Lisa Anderson',
    credentials: 'LCSW, Trauma Specialist',
    specialty: 'Trauma Specialists',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    bio: 'Dr. Lisa Anderson is a licensed clinical social worker and trauma specialist with 16 years of experience helping survivors heal from PTSD, childhood trauma, and abuse. She is trained in multiple evidence-based trauma therapies including EMDR and Somatic Experiencing.',
    expertise: ['PTSD Treatment', 'Childhood Trauma', 'EMDR Therapy', 'Complex Trauma'],
    yearsOfExperience: 16,
    totalVideos: 31,
    education: [
      'Ph.D. in Clinical Social Work - University of Michigan',
      'M.S.W. - University of Washington'
    ],
    certifications: [
      'Licensed Clinical Social Worker (LCSW)',
      'Certified EMDR Therapist'
    ],
    linkedIn: 'https://linkedin.com/in/lisa-anderson-lcsw',
    featured: true
  },
  {
    id: 'expert-006',
    name: 'Dr. Robert Williams',
    credentials: 'PCC, Certified Life Coach',
    specialty: 'Life Coaches',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    bio: 'Dr. Robert Williams is a certified professional life coach with 10 years of experience helping individuals navigate life transitions, achieve their goals, and unlock their full potential. With a background in positive psychology and organizational development, he helps clients create clarity and build confidence.',
    expertise: ['Personal Development', 'Goal Setting', 'Career Transitions', 'Leadership'],
    yearsOfExperience: 10,
    totalVideos: 29,
    education: [
      'Ph.D. in Organizational Psychology - Claremont Graduate University',
      'M.A. in Counseling Psychology - Pepperdine University'
    ],
    certifications: [
      'Professional Certified Coach (PCC) - ICF',
      'Certified Positive Psychology Coach'
    ],
    linkedIn: 'https://linkedin.com/in/robert-williams-pcc',
    featured: false
  },
  {
    id: 'expert-007',
    name: 'Dr. Amanda Foster',
    credentials: 'Ph.D., Clinical Psychologist',
    specialty: 'Clinical Psychologists',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda',
    bio: 'Dr. Amanda Foster specializes in helping high-achieving professionals prevent burnout and create sustainable success. With a background in organizational psychology and clinical practice, she understands the unique pressures facing modern professionals.',
    expertise: ['Burnout Prevention', 'Work-Life Balance', 'Stress Management', 'Professional Development'],
    yearsOfExperience: 11,
    totalVideos: 34,
    education: [
      'Ph.D. in Clinical Psychology - Duke University',
      'M.A. in Organizational Psychology - Columbia University'
    ],
    certifications: [
      'Licensed Clinical Psychologist',
      'Certified Workplace Wellness Consultant'
    ],
    linkedIn: 'https://linkedin.com/in/amanda-foster-phd',
    featured: false
  },
  {
    id: 'expert-008',
    name: 'Maya Patel',
    credentials: 'RYT-500, Certified Yoga & Meditation Teacher',
    specialty: 'Mindfulness Instructors',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    bio: 'Maya Patel is a certified yoga and meditation teacher who brings a holistic approach to mental and physical wellness. With training in both traditional yoga philosophy and modern mindfulness science, she helps students cultivate balance, flexibility, and inner peace.',
    expertise: ['Hatha Yoga', 'Restorative Yoga', 'Meditation', 'Stress Relief'],
    yearsOfExperience: 8,
    totalVideos: 56,
    education: [
      'Advanced Yoga Teacher Training (500-hour) - Kripalu Center',
      'B.S. in Health Sciences - University of Massachusetts'
    ],
    certifications: [
      'Registered Yoga Teacher (RYT-500)',
      'Certified Meditation Teacher'
    ],
    linkedIn: 'https://linkedin.com/in/maya-patel-yoga',
    featured: false
  }
];

// Helper functions
export const getAllExperts = (): Expert[] => {
  return dummyExperts;
};

export const getExpertById = (id: string): Expert | undefined => {
  return dummyExperts.find(expert => expert.id === id);
};

export const getExpertsBySpecialty = (specialty: string): Expert[] => {
  return dummyExperts.filter(expert => expert.specialty === specialty);
};

export const getFeaturedExperts = (): Expert[] => {
  return dummyExperts.filter(expert => expert.featured);
};
