// src/pages/NewsletterOnlyPage.tsx - Clean Aesthetic Newsletter Landing Page
import React, { useState, useEffect } from 'react';
import { Mail, Check, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { newsletterService } from '@/services/newsletter.service';
import { toast } from 'sonner';
import watercolorImage from '@/assets/watercolor.png';

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

const NewsletterOnlyPage: React.FC = () => {
  const [newsletterStep, setNewsletterStep] = useState<'form' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [memberCount, setMemberCount] = useState(9247);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  // Simulate growing community counter
  useEffect(() => {
    const interval = setInterval(() => {
      setMemberCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const onNewsletterSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true);
    try {
      await newsletterService.subscribe({
        email: data.email,
        source: 'newsletter_only_page',
      });
      setNewsletterStep('success');
      setMemberCount(prev => prev + 1); // Increment count
      reset();
      toast.success('Welcome to our community!', {
        description: 'Check your inbox for your welcome email.',
      });
    } catch (error: any) {
      toast.error('Something went wrong', {
        description: error.message || 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          
          {/* Left Side - Content */}
          <div className="space-y-8">


            {newsletterStep === 'form' ? (
              <>
                {/* Main Content */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-5xl font-bold text-gray-900 leading-tight">
                      Solving mental health by building community
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed">
                      Join our community and get expert wellness tips delivered to your inbox.
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span>Weekly mental health insights from licensed professionals</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span>Practical exercises and guided meditations</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span>Early access to our wellness platform</span>
                    </div>
                  </div>

                  {/* Growing Community Counter */}
                  <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">
                      {memberCount.toLocaleString()} people joined this week
                    </span>
                  </div>
                </div>

                {/* Newsletter Form */}
                <form onSubmit={handleSubmit(onNewsletterSubmit)} className="space-y-4">
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      className={`h-14 pl-12 pr-4 text-base rounded-2xl border-2 transition-all ${
                        errors.email 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-indigo-500'
                      }`}
                      {...register('email')}
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>

                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                  )}

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-14 text-base rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        Join Our Community
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  <p className="text-sm text-gray-500">
                    Free forever. No spam. Unsubscribe anytime.
                  </p>
                </form>
              </>
            ) : (
              /* Success State */
              <div className="space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-4xl font-bold text-gray-900">You're in!</h3>
                  <p className="text-xl text-gray-600">
                    Welcome to the Better & Bliss community. Check your inbox for your first wellness tip.
                  </p>
                </div>

                <div className="bg-blue-50 rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">What's next?</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>Welcome email arriving within 5 minutes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>Weekly wellness tips every Tuesday</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>Early access when we launch</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Image */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl overflow-hidden flex items-center justify-center">
                <img
                  src={watercolorImage}
                  alt="Watercolor wellness illustration"
                  className="w-full h-full object-contain p-8"
                />
              </div>
              
              {/* Floating elements */}
              <div className="absolute -bottom-4 -left-4 w-24 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">10k+</div>
                  <div className="text-xs text-gray-500">Members</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-16 border-t border-gray-100 mt-16">
          <p className="text-sm text-gray-500">
            Better & Bliss • Mental Health & Wellness Platform • Your journey starts here
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsletterOnlyPage;