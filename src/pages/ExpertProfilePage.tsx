// src/pages/ExpertProfilePage.tsx - Individual expert profile page
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
  Star,
  Clock,
  Video as VideoIcon,
  Award,
  BookOpen,
  Globe,
  CheckCircle2,
  Play,
  Calendar
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

      // Get videos by this expert
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
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Button
          onClick={() => navigate('/experts')}
          variant="ghost"
          className="hover:bg-muted"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Experts
        </Button>
      </div>

      {/* Expert Header */}
      <div className="bg-gradient-to-br from-primary/10 via-purple-50 to-background dark:from-primary/5 dark:via-background dark:to-background border-b">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar Section */}
            <div className="relative flex-shrink-0">
              <img
                src={expert.avatar}
                alt={expert.name}
                className="w-40 h-40 rounded-2xl border-4 border-white dark:border-gray-800 shadow-xl"
              />
              {expert.featured && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-2 shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-4xl font-bold mb-2">{expert.name}</h1>
                <p className="text-xl text-muted-foreground mb-3">
                  {expert.credentials}
                </p>
                <Badge variant="secondary" className="text-sm">
                  {expert.specialty}
                </Badge>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="text-lg font-bold text-foreground">{expert.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Rating</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-lg font-bold">{expert.yearsOfExperience}</span>
                  <span className="text-sm text-muted-foreground">Years Experience</span>
                </div>

                {expert.totalVideos && (
                  <div className="flex items-center gap-2">
                    <VideoIcon className="w-5 h-5 text-primary" />
                    <span className="text-lg font-bold">{expert.totalVideos}</span>
                    <span className="text-sm text-muted-foreground">Videos</span>
                  </div>
                )}

                {expert.totalSessions && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="text-lg font-bold">{expert.totalSessions.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">Sessions</span>
                  </div>
                )}
              </div>

              {/* Availability */}
              {expert.availability && (
                <div className="mb-6">
                  <Badge
                    variant={expert.availability === 'available' ? 'default' : 'secondary'}
                    className="text-sm"
                  >
                    {expert.availability === 'available' && <CheckCircle2 className="w-4 h-4 mr-1" />}
                    {expert.availability === 'available' ? 'Available Now' :
                     expert.availability === 'limited' ? 'Limited Availability' : 'Unavailable'}
                  </Badge>
                </div>
              )}

              {/* Short Bio */}
              <p className="text-lg text-foreground leading-relaxed">
                {expert.shortBio}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                About
              </h2>
              <p className="text-foreground leading-relaxed whitespace-pre-line">
                {expert.bio}
              </p>
            </section>

            {/* Approach */}
            {expert.approach && (
              <section className="bg-card border rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-4">My Approach</h2>
                <p className="text-foreground leading-relaxed italic">
                  "{expert.approach}"
                </p>
              </section>
            )}

            {/* Videos by this Expert */}
            {expertVideos.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <VideoIcon className="w-6 h-6 text-primary" />
                  Videos by {expert.name.split(' ')[1] || expert.name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {expertVideos.slice(0, 4).map((video) => (
                    <div
                      key={video.id}
                      onClick={() => navigate(`/watch/${video.id}`)}
                      className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                    >
                      <div className="relative aspect-video bg-muted">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {video.duration}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {expertVideos.length > 4 && (
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => navigate('/browse')}
                  >
                    View All Videos
                  </Button>
                )}
              </section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Areas of Expertise */}
            <div className="bg-card border rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Areas of Expertise</h3>
              <div className="space-y-2">
                {expert.expertise.map((exp, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{exp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            {expert.education && expert.education.length > 0 && (
              <div className="bg-card border rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Education
                </h3>
                <div className="space-y-3">
                  {expert.education.map((edu, index) => (
                    <p key={index} className="text-sm text-foreground leading-relaxed">
                      {edu}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {expert.certifications && expert.certifications.length > 0 && (
              <div className="bg-card border rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4">Certifications</h3>
                <div className="space-y-2">
                  {expert.certifications.map((cert, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {expert.languages && expert.languages.length > 0 && (
              <div className="bg-card border rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {expert.languages.map((lang, index) => (
                    <Badge key={index} variant="secondary">
                      {lang}
                    </Badge>
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
