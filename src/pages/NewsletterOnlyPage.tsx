// src/pages/NewsletterOnlyPage.tsx - Minimized Security Version
import React, { useState } from 'react';
import { Mail, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { newsletterService } from '@/services/newsletter.service';
import { toast } from 'sonner';
import watercolorImage from '@/assets/watercolor.png';

// Minimal validation - server does the real validation
const emailSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type EmailFormData = z.infer<typeof emailSchema>;

const NewsletterOnlyPage: React.FC = () => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (data: EmailFormData) => {
    setLoading(true);
    
    try {
      // Minimal client code - all logic server-side
      const result = await newsletterService.subscribe({
        email: data.email,
        source: 'newsletter_landing',
      });
      
      if (result.success) {
        setStep('success');
        reset();
        toast.success('Welcome!');
      } else {
        toast.error('Failed to subscribe', {
          description: result.error?.message,
        });
      }
    } catch {
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          
          {/* Content */}
          <div className="space-y-8">
            {step === 'form' ? (
              <>
                <div className="space-y-6">
                  <h2 className="text-5xl font-bold text-gray-900 leading-tight">
                    Solving mental health by building community
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Join our community and get expert wellness tips delivered to your inbox.
                  </p>
                  
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
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    disabled={loading}
                    className="w-full h-14 text-base rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    {loading ? (
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

          {/* Image */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl overflow-hidden flex items-center justify-center">
                <img
                  src={watercolorImage}
                  alt="Wellness illustration"
                  className="w-full h-full object-contain p-8"
                />
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