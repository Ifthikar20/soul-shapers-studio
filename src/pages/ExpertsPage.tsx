// src/pages/ExpertsPage.tsx - Explore and discover our expert wellness professionals
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
  Star,
  Video,
  Clock,
  Award
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
    // Load experts based on selected specialty
    if (selectedSpecialty) {
      setExperts(getExpertsBySpecialty(selectedSpecialty));
    } else {
      setExperts(getAllExperts());
    }
  }, [selectedSpecialty]);

  // Filter experts by search query
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

  const handleExpertClick = (expertId: string) => {
    navigate(`/experts/${expertId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-purple-50 to-background dark:from-primary/5 dark:via-background dark:to-background border-b">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Meet Our Expert Wellness Professionals
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Connect with certified therapists, coaches, and mindfulness experts dedicated to your mental health and personal growth.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, specialty, or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-base rounded-full border-2 focus:border-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-foreground">Filter by Specialty:</span>
            <Button
              variant={selectedSpecialty === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSpecialty(null)}
              className="rounded-full"
            >
              All Experts
            </Button>
            {specialties.map((specialty) => {
              const Icon = SPECIALTY_ICONS[specialty as keyof typeof SPECIALTY_ICONS];
              return (
                <Button
                  key={specialty}
                  variant={selectedSpecialty === specialty ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSpecialty(specialty)}
                  className="rounded-full flex items-center gap-2"
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
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No experts found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing {filteredExperts.length} expert{filteredExperts.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperts.map((expert) => {
                const Icon = SPECIALTY_ICONS[expert.specialty as keyof typeof SPECIALTY_ICONS];

                return (
                  <div
                    key={expert.id}
                    onClick={() => handleExpertClick(expert.id)}
                    className="bg-card border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-[1.02]"
                  >
                    {/* Expert Header */}
                    <div className="relative bg-gradient-to-br from-primary/10 to-purple-100 dark:from-primary/20 dark:to-purple-900/20 p-6">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <img
                            src={expert.avatar}
                            alt={expert.name}
                            className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                          />
                          {expert.featured && (
                            <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                              <Award className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                            {expert.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {expert.credentials}
                          </p>
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-semibold text-foreground">
                              {expert.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expert Body */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        {Icon && <Icon className="w-4 h-4 text-primary" />}
                        <Badge variant="secondary" className="text-xs">
                          {expert.specialty}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {expert.shortBio}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{expert.yearsOfExperience} years</span>
                        </div>
                        {expert.totalVideos && (
                          <div className="flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            <span>{expert.totalVideos} videos</span>
                          </div>
                        )}
                      </div>

                      {/* Expertise Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {expert.expertise.slice(0, 3).map((exp, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs border-primary/30 text-primary"
                          >
                            {exp}
                          </Badge>
                        ))}
                        {expert.expertise.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{expert.expertise.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-6">
                      <Button
                        className="w-full rounded-full group-hover:bg-primary group-hover:text-white transition-colors"
                        variant="outline"
                      >
                        View Profile
                      </Button>
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
