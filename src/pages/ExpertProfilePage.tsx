// src/pages/ExpertProfilePage.tsx - Modern expert profile
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getExpertById } from '@/data/dummyExperts';
import { getAllDummyVideos } from '@/data/dummyVideos';
import { Expert } from '@/types/expert.types';
import { Video } from '@/types/video.types';
import {
  ArrowLeft,
  Video as VideoIcon,
  Briefcase,
  GraduationCap,
  Award,
  Linkedin,
  Play
} from 'lucide-react';

const ExpertProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expert, setExpert] = useState<Expert | null>(null);
  const [expertVideos, setExpertVideos] = useState<Video[]>([]);

  useEffect(() => {
    if (id) {
      const expertData = getExpertById(id);
      setExpert(expertData || null);

      if (expertData) {
        const allVideos = getAllDummyVideos();
        const videos = allVideos.filter(video => video.expert === expertData.name);
        setExpertVideos(videos);
      }
    }
  }, [id]);

  if (!expert) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Expert not found</h2>
          <Button onClick={() => navigate('/experts')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Experts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Back Button */}
      <div className="border-b dark:border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Button
            onClick={() => navigate('/experts')}
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Experts
          </Button>
        </div>
      </div>

      {/* Expert Header */}
      <div className="border-b dark:border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={expert.avatar}
                alt={expert.name}
                className="w-32 h-32 rounded-2xl border-2 dark:border-border/50 shadow-lg object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{expert.name}</h1>
                <p className="text-lg text-muted-foreground">
                  {expert.credentials}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Badge variant="secondary" className="px-3 py-1 text-sm dark:bg-muted/50">
                  {expert.specialty}
                </Badge>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-9 h-9 rounded-lg bg-muted dark:bg-muted/50 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="font-medium">{expert.yearsOfExperience} years experience</span>
                </div>
                {expert.totalVideos && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-9 h-9 rounded-lg bg-muted dark:bg-muted/50 flex items-center justify-center">
                      <VideoIcon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="font-medium">{expert.totalVideos} videos</span>
                  </div>
                )}
              </div>

              {/* LinkedIn Button */}
              {expert.linkedIn && (
                <div>
                  <Button
                    variant="outline"
                    onClick={() => window.open(expert.linkedIn, '_blank')}
                    className="gap-2 dark:border-border/50"
                  >
                    <Linkedin className="w-4 h-4" />
                    Connect on LinkedIn
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-10">
            {/* About */}
            <section>
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-foreground/90 leading-relaxed text-base">
                {expert.bio}
              </p>
            </section>

            {/* Areas of Expertise */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Areas of Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {expert.expertise.map((exp, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-muted dark:bg-muted/50 text-sm font-medium"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </section>

            {/* Videos */}
            {expertVideos.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Content</h2>
                  <span className="text-sm text-muted-foreground">
                    {expertVideos.length} {expertVideos.length === 1 ? 'video' : 'videos'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {expertVideos.slice(0, 6).map((video) => (
                    <div
                      key={video.id}
                      onClick={() => navigate(`/watch/${video.id}`)}
                      className="group bg-card border dark:border-border/50 rounded-xl overflow-hidden hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-primary/5 transition-all duration-300 cursor-pointer hover:border-primary/50"
                    >
                      <div className="relative aspect-video bg-muted dark:bg-muted/30">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Play className="w-6 h-6 text-white ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/75 backdrop-blur-sm text-white text-xs font-medium">
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-1 line-clamp-2 text-sm group-hover:text-primary transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {video.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {expertVideos.length > 6 && (
                  <div className="mt-6 text-center">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/browse')}
                      className="dark:border-border/50"
                    >
                      View All Content
                    </Button>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Education */}
            {expert.education && expert.education.length > 0 && (
              <div className="bg-card border dark:border-border/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg">Education</h3>
                </div>
                <div className="space-y-4">
                  {expert.education.map((edu, index) => (
                    <div
                      key={index}
                      className="pb-4 last:pb-0 border-b last:border-0 dark:border-border/30"
                    >
                      <p className="text-sm leading-relaxed text-foreground/90">
                        {edu}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {expert.certifications && expert.certifications.length > 0 && (
              <div className="bg-card border dark:border-border/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg">Certifications</h3>
                </div>
                <div className="space-y-3">
                  {expert.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <p className="text-sm text-foreground/90 leading-relaxed">
                        {cert}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertProfilePage;
