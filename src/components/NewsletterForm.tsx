// src/components/NewsletterForm.tsx - Form with honeypot security
import React, { useState } from 'react';
import { Mail, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { newsletterService } from '@/services/newsletter.service';
import { toast } from 'sonner';

// Basic email validation - server does comprehensive validation
const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  name: z.string().optional(),
  // Honeypot fields - should remain empty
  website: z.string().max(0, 'Invalid submission'),
  phone: z.string().max(0, 'Invalid submission'),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

interface NewsletterFormProps {
  source?: string;
  onSuccess?: () => void;
  compact?: boolean;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({ 
  source = 'newsletter_form',
  onSuccess,
  compact = false 
}) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: '',
      name: '',
      website: '', // Honeypot - must remain empty
      phone: '',   // Honeypot - must remain empty
    },
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setLoading(true);
    
    try {
      // Check honeypot fields
      if (data.website || data.phone) {
        // Bot detected - fail silently or show generic error
        await new Promise(resolve => setTimeout(resolve, 1000)); // Fake delay
        toast.error('Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      const result = await newsletterService.subscribe({
        email: data.email,
        name: data.name,
        source,
      });
      
      if (result.success) {
        setStep('success');
        reset();
        toast.success('Welcome to our community!', {
          description: 'Check your inbox for a welcome email.',
        });
        onSuccess?.();
      } else {
        toast.error('Subscription failed', {
          description: result.error?.message || 'Please try again later.',
        });
      }
    } catch (error) {
      toast.error('Connection error', {
        description: 'Please check your internet connection and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className={`space-y-4 text-center ${compact ? 'p-4' : 'p-6'}`}>
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
          <Check className="w-6 h-6 text-green-600" />
        </div>
        
        <div className="space-y-2">
          <h3 className={`font-bold text-gray-900 ${compact ? 'text-lg' : 'text-xl'}`}>
            You're in!
          </h3>
          <p className={`text-gray-600 ${compact ? 'text-sm' : 'text-base'}`}>
            Welcome to the Better & Bliss community. Check your inbox for your welcome email.
          </p>
        </div>

        {!compact && (
          <div className="bg-blue-50 rounded-lg p-4 text-left">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">What's next?</h4>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Welcome email arriving within 5 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Weekly wellness tips every Tuesday</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Early access when we launch new features</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Visible fields */}
      <div className="space-y-3">
        {!compact && (
          <div>
            <Input
              type="text"
              placeholder="Your name (optional)"
              className="h-12 rounded-xl border-2 border-gray-200 focus:border-purple-500 transition-all"
              {...register('name')}
            />
          </div>
        )}
        
        <div className="relative">
          <Input
            type="email"
            placeholder="Enter your email address"
            className={`${compact ? 'h-11' : 'h-12'} pl-12 pr-4 rounded-xl border-2 transition-all ${
              errors.email 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-gray-200 focus:border-purple-500'
            }`}
            {...register('email')}
          />
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>

        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Honeypot fields - hidden from users, visible to bots */}
      <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
        <label htmlFor="website">Website (leave blank)</label>
        <input
          type="text"
          id="website"
          tabIndex={-1}
          autoComplete="off"
          {...register('website')}
        />
        
        <label htmlFor="phone">Phone (leave blank)</label>
        <input
          type="text"
          id="phone"
          tabIndex={-1}
          autoComplete="off"
          {...register('phone')}
        />
      </div>

      <Button 
        type="submit" 
        disabled={loading}
        className={`w-full ${compact ? 'h-11' : 'h-12'} rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all`}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Joining...
          </>
        ) : (
          <>
            Join Our Community
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Free forever. No spam. Unsubscribe anytime.
      </p>
    </form>
  );
};

export default NewsletterForm;