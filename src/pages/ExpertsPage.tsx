// src/pages/ExpertsPage.tsx - Professional expert directory
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
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-3 text-foreground">
              Our Expert Team
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Connect with certified professionals dedicated to your mental health and personal growth.
            </p>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base bg-background"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground mr-2">Specialty:</span>
            <Button
              variant={selectedSpecialty === null ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedSpecialty(null)}
            >
              All
            </Button>
            {specialties.map((specialty) => {
              const Icon = SPECIALTY_ICONS[specialty as keyof typeof SPECIALTY_ICONS];
              return (
                <Button
                  key={specialty}
                  variant={selectedSpecialty === specialty ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedSpecialty(specialty)}
                  className="flex items-center gap-1.5"
                >
                  <Icon className="w-3.5 h-3.5" />
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
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No experts found</h3>
            <p className="text-muted-foreground text-sm">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                {filteredExperts.length} expert{filteredExperts.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperts.map((expert) => {
                const Icon = SPECIALTY_ICONS[expert.specialty as keyof typeof SPECIALTY_ICONS];

                return (
                  <div
                    key={expert.id}
                    onClick={() => navigate(`/experts/${expert.id}`)}
                    className="bg-card border rounded-lg p-6 hover:shadow-md transition-all cursor-pointer group"
                  >
                    {/* Expert Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={expert.avatar}
                        alt={expert.name}
                        className="w-16 h-16 rounded-lg border"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
                          {expert.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {expert.credentials}
                        </p>
                      </div>
                    </div>

                    {/* Specialty Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
                      <span className="text-xs text-muted-foreground">{expert.specialty}</span>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {expert.bio}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>{expert.yearsOfExperience}+ years</span>
                      </div>
                      {expert.totalVideos && (
                        <div className="flex items-center gap-1">
                          <Video className="w-3.5 h-3.5" />
                          <span>{expert.totalVideos} videos</span>
                        </div>
                      )}
                    </div>

                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {expert.expertise.slice(0, 3).map((exp, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs font-normal"
                        >
                          {exp}
                        </Badge>
                      ))}
                    </div>

                    {/* View Profile Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors"
                    >
                      View Profile
                    </Button>
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
