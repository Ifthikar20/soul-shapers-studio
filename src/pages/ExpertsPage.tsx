// src/pages/ExpertsPage.tsx - Modern expert directory
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getAllExperts, getExpertsBySpecialty } from '@/data/dummyExperts';
import { Expert } from '@/types/expert.types';
import {
  Brain,
  Sparkles,
  Heart,
  Activity,
  Shield,
  Lightbulb,
  Search,
  Video,
  Briefcase
} from 'lucide-react';

const SPECIALTY_ICONS = {
  'Clinical Psychologists': Brain,
  'Mindfulness Instructors': Sparkles,
  'Relationship Therapists': Heart,
  'Addiction Counselors': Activity,
  'Trauma Specialists': Shield,
  'Life Coaches': Lightbulb,
};

const ExpertsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const specialtyParam = searchParams.get('specialty');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(specialtyParam);
  const [experts, setExperts] = useState<Expert[]>([]);

  useEffect(() => {
    if (selectedSpecialty) {
      setExperts(getExpertsBySpecialty(selectedSpecialty));
    } else {
      setExperts(getAllExperts());
    }
  }, [selectedSpecialty]);

  const filteredExperts = experts.filter(expert =>
    expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expert.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expert.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const specialties = [
    'Clinical Psychologists',
    'Mindfulness Instructors',
    'Relationship Therapists',
    'Addiction Counselors',
    'Trauma Specialists',
    'Life Coaches'
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Meet Our Experts
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Connect with licensed professionals who are here to support your journey.
            </p>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search experts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base border-2 dark:bg-background/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="border-b dark:border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={selectedSpecialty === null ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedSpecialty(null)}
              className="font-medium"
            >
              All Specialties
            </Button>
            {specialties.map((specialty) => {
              const Icon = SPECIALTY_ICONS[specialty as keyof typeof SPECIALTY_ICONS];
              return (
                <Button
                  key={specialty}
                  variant={selectedSpecialty === specialty ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedSpecialty(specialty)}
                  className="flex items-center gap-2 font-medium"
                >
                  <Icon className="w-4 h-4" />
                  {specialty}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Experts Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {filteredExperts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No experts found</h3>
            <p className="text-muted-foreground text-sm">
              Try a different search or filter
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-sm text-muted-foreground">
                Showing {filteredExperts.length} {filteredExperts.length === 1 ? 'expert' : 'experts'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredExperts.map((expert) => {
                const Icon = SPECIALTY_ICONS[expert.specialty as keyof typeof SPECIALTY_ICONS];

                return (
                  <div
                    key={expert.id}
                    onClick={() => navigate(`/experts/${expert.id}`)}
                    className="group bg-card border dark:border-border/50 rounded-xl p-6 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-primary/5 transition-all duration-300 cursor-pointer hover:border-primary/50"
                  >
                    {/* Expert Header */}
                    <div className="flex items-start gap-4 mb-5">
                      <div className="relative">
                        <img
                          src={expert.avatar}
                          alt={expert.name}
                          className="w-20 h-20 rounded-xl border-2 dark:border-border/50 object-cover"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary/10 dark:bg-primary/20 border-2 border-card flex items-center justify-center">
                          {Icon && <Icon className="w-3 h-3 text-primary" />}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                          {expert.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {expert.credentials}
                        </p>
                      </div>
                    </div>

                    {/* Specialty */}
                    <div className="mb-4">
                      <Badge
                        variant="secondary"
                        className="text-xs font-medium dark:bg-muted/50"
                      >
                        {expert.specialty}
                      </Badge>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-muted-foreground mb-5 line-clamp-3 leading-relaxed">
                      {expert.bio}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-5 pb-5 border-b dark:border-border/30">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-muted dark:bg-muted/50 flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <span className="text-foreground font-medium">{expert.yearsOfExperience} years</span>
                      </div>
                      {expert.totalVideos && (
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-8 h-8 rounded-lg bg-muted dark:bg-muted/50 flex items-center justify-center">
                            <Video className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <span className="text-foreground font-medium">{expert.totalVideos} videos</span>
                        </div>
                      )}
                    </div>

                    {/* Expertise */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Expertise
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {expert.expertise.slice(0, 3).map((exp, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted/50 dark:bg-muted/30 text-xs font-medium text-foreground"
                          >
                            {exp}
                          </span>
                        ))}
                        {expert.expertise.length > 3 && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted/50 dark:bg-muted/30 text-xs font-medium text-muted-foreground">
                            +{expert.expertise.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExpertsPage;
