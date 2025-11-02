// src/pages/ExpertProfilePage.tsx - Professional expert profile
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
  ExternalLink,
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
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Button
            onClick={() => navigate('/experts')}
            variant="ghost"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Experts
          </Button>
        </div>
      </div>

      {/* Expert Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={expert.avatar}
                alt={expert.name}
                className="w-32 h-32 rounded-lg border shadow-sm"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{expert.name}</h1>
              <p className="text-lg text-muted-foreground mb-4">
                {expert.credentials}
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="secondary" className="text-sm">
                  {expert.specialty}
                </Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="w-4 h-4" />
                  <span>{expert.yearsOfExperience} years experience</span>
                </div>
                {expert.totalVideos && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <VideoIcon className="w-4 h-4" />
                    <span>{expert.totalVideos} videos</span>
                  </div>
                )}
              </div>

              {/* LinkedIn Button */}
              {expert.linkedIn && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(expert.linkedIn, '_blank')}
                  className="gap-2"
                >
                  <Linkedin className="w-4 h-4" />
                  View LinkedIn Profile
                  <ExternalLink className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <section>
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-foreground leading-relaxed">
                {expert.bio}
              </p>
            </section>

            {/* Areas of Expertise */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Areas of Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {expert.expertise.map((exp, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-sm"
                  >
                    {exp}
                  </Badge>
                ))}
              </div>
            </section>

            {/* Videos */}
            {expertVideos.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <VideoIcon className="w-5 h-5" />
                  Content by {expert.name.split(' ')[1] || expert.name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {expertVideos.slice(0, 6).map((video) => (
                    <div
                      key={video.id}
                      onClick={() => navigate(`/watch/${video.id}`)}
                      className="bg-card border rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="relative aspect-video bg-muted">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play className="w-10 h-10 text-white" />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-1 line-clamp-2 text-sm">
                          {video.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {video.duration}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Education */}
            {expert.education && expert.education.length > 0 && (
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Education
                </h3>
                <div className="space-y-3">
                  {expert.education.map((edu, index) => (
                    <p key={index} className="text-sm text-foreground">
                      {edu}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {expert.certifications && expert.certifications.length > 0 && (
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Certifications
                </h3>
                <div className="space-y-2">
                  {expert.certifications.map((cert, index) => (
                    <p key={index} className="text-sm text-foreground">
                      {cert}
                    </p>
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
