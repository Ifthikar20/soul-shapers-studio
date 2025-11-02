// Dummy expert data for Better & Bliss
import { Expert } from '@/types/expert.types';

export const dummyExperts: Expert[] = [
  {
    id: 'expert-001',
    name: 'Dr. Sarah Johnson',
    credentials: 'Ph.D., Clinical Psychologist',
    specialty: 'Clinical Psychologists',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    shortBio: 'Specializing in anxiety, depression, and stress management with over 15 years of experience.',
    bio: 'Dr. Sarah Johnson is a licensed clinical psychologist with over 15 years of experience helping individuals overcome anxiety, depression, and stress-related challenges. She combines evidence-based cognitive behavioral therapy (CBT) with mindfulness techniques to create personalized treatment plans. Dr. Johnson is passionate about making mental health care accessible and empowering her clients to develop lifelong coping strategies.',
    expertise: ['Anxiety Disorders', 'Depression', 'Stress Management', 'CBT', 'Mindfulness-Based Therapy'],
    yearsOfExperience: 15,
    rating: 4.9,
    totalSessions: 2500,
    totalVideos: 45,
    education: [
      'Ph.D. in Clinical Psychology - Stanford University',
      'M.A. in Psychology - University of California, Berkeley',
      'B.A. in Psychology - Yale University'
    ],
    certifications: [
      'Licensed Clinical Psychologist (California)',
      'Certified CBT Therapist',
      'Mindfulness-Based Stress Reduction (MBSR) Certified'
    ],
    languages: ['English', 'Spanish'],
    approach: 'I believe in a collaborative, client-centered approach that combines evidence-based techniques with compassion and understanding. My goal is to help you develop practical tools and insights that lead to lasting positive change.',
    availability: 'available',
    featured: true
  },
  {
    id: 'expert-002',
    name: 'Dr. Michael Chen',
    credentials: 'Certified Mindfulness Instructor',
    specialty: 'Mindfulness Instructors',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    shortBio: 'Expert in meditation and mindfulness practices with 20+ years of teaching experience.',
    bio: 'Dr. Michael Chen has dedicated over 20 years to the practice and teaching of mindfulness and meditation. Trained in both Eastern contemplative traditions and Western psychology, he bridges ancient wisdom with modern neuroscience. Dr. Chen has led retreats worldwide and has helped thousands of individuals discover inner peace and mental clarity through mindfulness practices.',
    expertise: ['Meditation', 'Mindfulness', 'Stress Reduction', 'Breathwork', 'Mind-Body Connection'],
    yearsOfExperience: 20,
    rating: 4.8,
    totalSessions: 3200,
    totalVideos: 67,
    education: [
      'Ph.D. in Contemplative Studies - Naropa University',
      'M.A. in Buddhist Studies - University of Wisconsin-Madison',
      'B.A. in Philosophy - UC Santa Cruz'
    ],
    certifications: [
      'Certified MBSR Teacher',
      'Certified Yoga Instructor (RYT-500)',
      'Vipassana Meditation Teacher'
    ],
    languages: ['English', 'Mandarin', 'Cantonese'],
    approach: 'My teaching emphasizes experiential learning and gentle, non-judgmental awareness. I help students develop a sustainable daily practice that brings peace, clarity, and resilience into every aspect of life.',
    availability: 'available',
    featured: true
  },
  {
    id: 'expert-003',
    name: 'Dr. Emily Rodriguez',
    credentials: 'LMFT, Relationship Therapist',
    specialty: 'Relationship Therapists',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    shortBio: 'Marriage and family therapist specializing in communication, conflict resolution, and intimacy.',
    bio: 'Dr. Emily Rodriguez is a licensed marriage and family therapist who specializes in helping couples and families navigate relationship challenges. With 12 years of experience, she uses evidence-based approaches including Gottman Method and Emotionally Focused Therapy (EFT) to help partners strengthen their connection, improve communication, and rebuild trust. Dr. Rodriguez is known for her warm, non-judgmental approach and practical tools that couples can implement immediately.',
    expertise: ['Couples Therapy', 'Communication Skills', 'Conflict Resolution', 'Intimacy Issues', 'Premarital Counseling'],
    yearsOfExperience: 12,
    rating: 4.9,
    totalSessions: 1800,
    totalVideos: 38,
    education: [
      'Ph.D. in Marriage and Family Therapy - Alliant International University',
      'M.S. in Counseling Psychology - Northwestern University',
      'B.A. in Psychology - University of Texas at Austin'
    ],
    certifications: [
      'Licensed Marriage and Family Therapist (LMFT)',
      'Certified Gottman Therapist',
      'Certified EFT Therapist'
    ],
    languages: ['English', 'Spanish'],
    approach: 'I create a safe, supportive space where couples can explore their patterns, deepen understanding, and learn new ways of connecting. My approach is collaborative, practical, and focused on building lasting positive change in your relationship.',
    availability: 'limited',
    featured: true
  },
  {
    id: 'expert-004',
    name: 'Dr. James Thompson',
    credentials: 'CAC, Addiction Counselor',
    specialty: 'Addiction Counselors',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    shortBio: 'Certified addiction counselor with expertise in substance abuse recovery and relapse prevention.',
    bio: 'Dr. James Thompson is a certified addiction counselor with over 18 years of experience helping individuals overcome substance abuse and behavioral addictions. Drawing from both his professional training and personal recovery journey, Dr. Thompson brings deep empathy and practical wisdom to his work. He specializes in holistic recovery approaches that address the physical, emotional, and spiritual aspects of addiction.',
    expertise: ['Substance Abuse', 'Recovery Programs', 'Relapse Prevention', 'Dual Diagnosis', 'Family Support'],
    yearsOfExperience: 18,
    rating: 4.7,
    totalSessions: 2100,
    totalVideos: 42,
    education: [
      'Ph.D. in Addiction Studies - Hazelden Betty Ford Graduate School',
      'M.A. in Counseling - Columbia University',
      'B.S. in Psychology - Boston University'
    ],
    certifications: [
      'Certified Addiction Counselor (CAC)',
      'Licensed Professional Counselor (LPC)',
      'Certified Clinical Supervisor'
    ],
    languages: ['English'],
    approach: 'Recovery is a journey of self-discovery and transformation. I provide compassionate, evidence-based support while honoring each person\'s unique path. Together, we\'ll build the foundation for lasting sobriety and a fulfilling life in recovery.',
    availability: 'available',
    featured: false
  },
  {
    id: 'expert-005',
    name: 'Dr. Lisa Anderson',
    credentials: 'LCSW, Trauma Specialist',
    specialty: 'Trauma Specialists',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    shortBio: 'Trauma-informed therapist specializing in PTSD, childhood trauma, and healing from abuse.',
    bio: 'Dr. Lisa Anderson is a licensed clinical social worker and trauma specialist with 16 years of experience helping survivors heal from PTSD, childhood trauma, and abuse. She is trained in multiple evidence-based trauma therapies including EMDR, Somatic Experiencing, and Trauma-Focused CBT. Dr. Anderson creates a safe, supportive environment where clients can process traumatic experiences at their own pace and reclaim their sense of safety and empowerment.',
    expertise: ['PTSD Treatment', 'Childhood Trauma', 'EMDR Therapy', 'Somatic Experiencing', 'Complex Trauma'],
    yearsOfExperience: 16,
    rating: 4.9,
    totalSessions: 1950,
    totalVideos: 31,
    education: [
      'Ph.D. in Clinical Social Work - University of Michigan',
      'M.S.W. - University of Washington',
      'B.A. in Social Work - University of Minnesota'
    ],
    certifications: [
      'Licensed Clinical Social Worker (LCSW)',
      'Certified EMDR Therapist',
      'Certified Somatic Experiencing Practitioner'
    ],
    languages: ['English'],
    approach: 'Healing from trauma is possible. I provide a trauma-informed, body-centered approach that honors your resilience and supports your journey toward post-traumatic growth. We work at a pace that feels safe and manageable for you.',
    availability: 'available',
    featured: true
  },
  {
    id: 'expert-006',
    name: 'Dr. Robert Williams',
    credentials: 'Certified Life Coach',
    specialty: 'Life Coaches',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    shortBio: 'Professional life coach focused on personal development, goal achievement, and life transitions.',
    bio: 'Dr. Robert Williams is a certified professional life coach with 10 years of experience helping individuals navigate life transitions, achieve their goals, and unlock their full potential. With a background in positive psychology and organizational development, he specializes in helping clients create clarity, build confidence, and take strategic action toward their dreams. Dr. Williams has coached executives, entrepreneurs, and individuals across diverse backgrounds.',
    expertise: ['Personal Development', 'Goal Setting', 'Career Transitions', 'Leadership Coaching', 'Work-Life Balance'],
    yearsOfExperience: 10,
    rating: 4.6,
    totalSessions: 1200,
    totalVideos: 29,
    education: [
      'Ph.D. in Organizational Psychology - Claremont Graduate University',
      'M.A. in Counseling Psychology - Pepperdine University',
      'B.A. in Business Administration - UCLA'
    ],
    certifications: [
      'Professional Certified Coach (PCC) - ICF',
      'Certified Positive Psychology Coach',
      'Certified Executive Coach'
    ],
    languages: ['English', 'French'],
    approach: 'I partner with you to clarify your vision, overcome obstacles, and create actionable strategies for success. My coaching is results-oriented, strengths-based, and designed to help you create sustainable positive change in all areas of your life.',
    availability: 'available',
    featured: false
  },
  {
    id: 'expert-007',
    name: 'Dr. Amanda Foster',
    credentials: 'Ph.D., Burnout Prevention Specialist',
    specialty: 'Clinical Psychologists',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda',
    shortBio: 'Helping professionals prevent burnout and create sustainable work-life balance.',
    bio: 'Dr. Amanda Foster specializes in helping high-achieving professionals prevent burnout and create sustainable success. With a background in organizational psychology and clinical practice, she understands the unique pressures facing modern professionals. Dr. Foster combines evidence-based stress management techniques with practical strategies for boundary-setting, time management, and self-care. Her approach helps clients thrive both professionally and personally.',
    expertise: ['Burnout Prevention', 'Work-Life Balance', 'Stress Management', 'Professional Development', 'Self-Care Strategies'],
    yearsOfExperience: 11,
    rating: 4.7,
    totalSessions: 1450,
    totalVideos: 34,
    education: [
      'Ph.D. in Clinical Psychology - Duke University',
      'M.A. in Organizational Psychology - Columbia University',
      'B.A. in Psychology - University of Pennsylvania'
    ],
    certifications: [
      'Licensed Clinical Psychologist',
      'Certified Workplace Wellness Consultant',
      'Certified Stress Management Specialist'
    ],
    languages: ['English'],
    approach: 'Success shouldn\'t come at the cost of your well-being. I help you create a sustainable approach to work and life that honors your ambitions while protecting your health, relationships, and joy.',
    availability: 'limited',
    featured: false
  },
  {
    id: 'expert-008',
    name: 'Maya Patel',
    credentials: 'Certified Yoga & Meditation Teacher',
    specialty: 'Mindfulness Instructors',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    shortBio: 'Holistic wellness teacher combining yoga, meditation, and Ayurvedic wisdom.',
    bio: 'Maya Patel is a certified yoga and meditation teacher who brings a holistic approach to mental and physical wellness. With training in both traditional yoga philosophy and modern mindfulness science, she helps students cultivate balance, flexibility, and inner peace. Maya specializes in yoga for stress relief, restorative practices, and integrating Ayurvedic principles for optimal well-being. Her teaching style is accessible, nurturing, and adaptable to all levels.',
    expertise: ['Hatha Yoga', 'Restorative Yoga', 'Meditation', 'Ayurveda', 'Stress Relief'],
    yearsOfExperience: 8,
    rating: 4.8,
    totalSessions: 950,
    totalVideos: 56,
    education: [
      'Advanced Yoga Teacher Training (500-hour) - Kripalu Center',
      'Ayurvedic Wellness Counselor Certification',
      'B.S. in Health Sciences - University of Massachusetts'
    ],
    certifications: [
      'Registered Yoga Teacher (RYT-500)',
      'Certified Meditation Teacher',
      'Ayurvedic Wellness Counselor'
    ],
    languages: ['English', 'Hindi', 'Gujarati'],
    approach: 'I guide students toward holistic wellness by honoring the interconnection of body, mind, and spirit. My classes blend ancient wisdom with practical tools for modern life, creating space for healing, growth, and self-discovery.',
    availability: 'available',
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
