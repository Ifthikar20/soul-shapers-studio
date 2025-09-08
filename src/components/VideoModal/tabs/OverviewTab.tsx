// src/components/VideoModal/tabs/OverviewTab.tsx
import { Check, Star, BookOpen, ThumbsUp, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoContent } from '@/types/video.types';

interface OverviewTabProps {
  video: VideoContent;
  totalLessons: number;
}

export const OverviewTab = ({ video, totalLessons }: OverviewTabProps) => {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Enhanced Stats Cards */}
      <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <span className="text-2xl font-bold text-white">{totalLessons} Lessons</span>
          </div>
          <p className="text-zinc-500 text-sm">Interactive content</p>
          <p className="text-purple-400 text-xs mt-1">~2.5 hours total</p>
        </div>
        <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center gap-3 mb-2">
            <ThumbsUp className="w-5 h-5 text-blue-400" />
            <span className="text-2xl font-bold text-white">4.8/5</span>
          </div>
          <p className="text-zinc-500 text-sm">Average rating</p>
          <p className="text-blue-400 text-xs mt-1">Based on 12,847 reviews</p>
        </div>
        <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-green-400" />
            <span className="text-2xl font-bold text-white">88,800</span>
          </div>
          <p className="text-zinc-500 text-sm">Active learners</p>
          <p className="text-green-400 text-xs mt-1">3,200 this month</p>
        </div>
        <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-2xl font-bold text-white">92%</span>
          </div>
          <p className="text-zinc-500 text-sm">Completion rate</p>
          <p className="text-yellow-400 text-xs mt-1">Above industry average</p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="lg:col-span-2">
        <h2 className="text-3xl font-bold text-white mb-4">Evidence-Based Wellness Program</h2>
        <p className="text-zinc-300 text-lg leading-relaxed mb-6">
          {video.fullDescription || video.description}
        </p>
        
        {/* Program Methodology */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-6 mb-8 border border-blue-500/20">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-500" />
            Research-Backed Approach
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <div>
                <p className="text-white font-medium">Cognitive Behavioral Techniques</p>
                <p className="text-zinc-400 text-sm">Proven methods from clinical psychology research</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
              <div>
                <p className="text-white font-medium">Mindfulness-Based Interventions</p>
                <p className="text-zinc-400 text-sm">Techniques validated in peer-reviewed studies</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
              <div>
                <p className="text-white font-medium">Neuroplasticity Principles</p>
                <p className="text-zinc-400 text-sm">Brain training based on neuroscience research</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
              <div>
                <p className="text-white font-medium">Behavioral Change Science</p>
                <p className="text-zinc-400 text-sm">Habit formation strategies from behavioral economics</p>
              </div>
            </div>
          </div>
        </div>

        {/* What Makes This Different */}
        <div className="bg-zinc-900/30 rounded-lg p-6 mb-8 border border-zinc-800">
          <h3 className="text-xl font-bold text-white mb-4">What Sets This Program Apart</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full mt-1"></div>
              <div>
                <p className="text-white font-medium mb-1">Personalized Learning Path</p>
                <p className="text-zinc-400 text-sm">AI-powered recommendations based on your progress and preferences</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-green-500 rounded-full mt-1"></div>
              <div>
                <p className="text-white font-medium mb-1">Interactive Practice Sessions</p>
                <p className="text-zinc-400 text-sm">Guided exercises with real-time feedback and progress tracking</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-yellow-500 rounded-full mt-1"></div>
              <div>
                <p className="text-white font-medium mb-1">Community Integration</p>
                <p className="text-zinc-400 text-sm">Connect with peers and access professional support when needed</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full mt-1"></div>
              <div>
                <p className="text-white font-medium mb-1">Measurable Outcomes</p>
                <p className="text-zinc-400 text-sm">Track your progress with validated wellness assessment tools</p>
              </div>
            </div>
          </div>
        </div>

        {/* Time Investment & Expectations */}
        <div className="bg-zinc-900/30 rounded-lg p-6 mb-8 border border-zinc-800">
          <h3 className="text-xl font-bold text-white mb-4">Time Investment & Expected Outcomes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-medium mb-2">Recommended Schedule</h4>
              <ul className="text-zinc-400 text-sm space-y-1">
                <li>• 20-30 minutes per lesson</li>
                <li>• 2-3 lessons per week</li>
                <li>• 5-10 minutes daily practice</li>
                <li>• Complete program in 3-4 weeks</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Typical Results Timeline</h4>
              <ul className="text-zinc-400 text-sm space-y-1">
                <li>• Week 1: Increased awareness</li>
                <li>• Week 2: Initial habit formation</li>
                <li>• Week 3: Noticeable improvements</li>
                <li>• Week 4+: Sustained positive changes</li>
              </ul>
            </div>
          </div>
        </div>
        
        {video.learningObjectives && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-4">Learning Outcomes</h3>
            <div className="space-y-3">
              {video.learningObjectives.map((objective, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-purple-400" />
                  </div>
                  <span className="text-zinc-300">{objective}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prerequisites & Requirements */}
        <div className="mt-8 bg-zinc-900/30 rounded-lg p-6 border border-zinc-800">
          <h3 className="text-xl font-bold text-white mb-4">Prerequisites & Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-medium mb-2 text-green-400">What You Need</h4>
              <ul className="text-zinc-400 text-sm space-y-1">
                <li>• Open mind and willingness to practice</li>
                <li>• 20-30 minutes of dedicated time</li>
                <li>• Quiet space for reflection exercises</li>
                <li>• Journal or note-taking app</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2 text-blue-400">No Experience Required</h4>
              <ul className="text-zinc-400 text-sm space-y-1">
                <li>• Suitable for complete beginners</li>
                <li>• Self-paced learning approach</li>
                <li>• Optional advanced techniques included</li>
                <li>• Lifetime access to materials</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Expert Credentials */}
        <div className="mt-8 bg-zinc-900/30 rounded-lg p-6 border border-zinc-800">
          <h3 className="text-xl font-bold text-white mb-4">About Your Instructor</h3>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">{video.expert}</h4>
              <p className="text-purple-400 text-sm mb-2">{video.expertCredentials}</p>
              <p className="text-zinc-400 text-sm leading-relaxed mb-3">
                15+ years specializing in evidence-based mental health interventions. Published researcher in behavioral psychology 
                with 40+ peer-reviewed articles. Former clinical director at leading wellness centers.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">Licensed Psychologist</span>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">CBT Specialist</span>
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">Mindfulness Teacher</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-6 border border-zinc-800 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">Program Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-zinc-500">Category</span>
              <span className="text-white">{video.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Difficulty</span>
              <span className="text-white">Beginner-Friendly</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Duration</span>
              <span className="text-white">2.5 hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Format</span>
              <span className="text-white">Video + Practice</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Language</span>
              <span className="text-white">English</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Rating</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-white">{video.rating}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Access</span>
              <span className="text-white capitalize">{video.accessTier}</span>
            </div>
          </div>
          
          <Button 
            className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => window.location.href = '/programs'}
          >
            <Users className="w-4 h-4 mr-2" />
            Join Program
          </Button>
        </div>

        {/* Money-Back Guarantee */}
        <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-lg p-6 border border-green-500/20 mb-6">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Check className="w-5 h-5 text-green-400" />
            30-Day Guarantee
          </h3>
          <p className="text-zinc-300 text-sm">
            Not satisfied? Get a full refund within 30 days. No questions asked.
          </p>
        </div>

        {/* Support Options */}
        <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
          <h3 className="text-lg font-bold text-white mb-4">Support Included</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-zinc-300 text-sm">24/7 Community Access</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-zinc-300 text-sm">Expert Q&A Sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-zinc-300 text-sm">Progress Tracking Tools</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-zinc-300 text-sm">Mobile App Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};