// src/pages/ExpertsPage.tsx - Modern expert directory
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import PageLayout from '@/components/Layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(specialtyParam);
  const [experts, setExperts] = useState<Expert[]>([]);

  useEffect(() => {
    if (selectedSpecialty) {
      setExperts(getExpertsBySpecialty(selectedSpecialty));
    } else {
      setExperts(getAllExperts());
    }
  }, [selectedSpecialty]);

  const specialties = [
    'Clinical Psychologists',
    'Mindfulness Instructors',
    'Relationship Therapists',
    'Addiction Counselors',
    'Trauma Specialists',
    'Life Coaches'
  ];

  return (
    <>
      <Header />
      <PageLayout hasHero={false}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
              Meet Our Experts
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Connect with licensed professionals who are here to support your journey.
            </p>
          </div>

          {/* Filter Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant={selectedSpecialty === null ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedSpecialty(null)}
                className="font-medium rounded-full"
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
                    className="flex items-center gap-2 font-medium rounded-full"
                  >
                    <Icon className="w-4 h-4" />
                    {specialty}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Experts Grid */}
          {experts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No experts found</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Try a different filter
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {experts.length} {experts.length === 1 ? 'expert' : 'experts'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {experts.map((expert) => {
                const Icon = SPECIALTY_ICONS[expert.specialty as keyof typeof SPECIALTY_ICONS];

                return (
                    <div
                      key={expert.id}
                      onClick={() => navigate(`/experts/${expert.id}`)}
                      className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-primary/50"
                    >
                      {/* Expert Header */}
                      <div className="flex items-start gap-4 mb-5">
                        <div className="relative">
                          <img
                            src={expert.avatar}
                            alt={expert.name}
                            className="w-20 h-20 rounded-xl border-2 border-gray-200 dark:border-gray-800 object-cover"
                          />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary/10 dark:bg-primary/20 border-2 border-white dark:border-gray-900 flex items-center justify-center">
                            {Icon && <Icon className="w-3 h-3 text-primary" />}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                            {expert.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {expert.credentials}
                          </p>
                        </div>
                      </div>

                      {/* Specialty */}
                      <div className="mb-4">
                        <Badge
                          variant="secondary"
                          className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full"
                        >
                          {expert.specialty}
                        </Badge>
                      </div>

                      {/* Bio */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 line-clamp-3 leading-relaxed">
                        {expert.bio}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </div>
                          <span className="text-gray-900 dark:text-white font-medium">{expert.yearsOfExperience} years</span>
                        </div>
                        {expert.totalVideos && (
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                              <Video className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </div>
                            <span className="text-gray-900 dark:text-white font-medium">{expert.totalVideos} videos</span>
                          </div>
                        )}
                      </div>

                      {/* Expertise */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">
                          Expertise
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {expert.expertise.slice(0, 3).map((exp, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-900 dark:text-gray-100"
                            >
                              {exp}
                            </span>
                          ))}
                          {expert.expertise.length > 3 && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400">
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
      </PageLayout>
    </>
  );
};

export default ExpertsPage;
