import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { newsletterService } from '@/services/newsletter.service';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  name: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
}

export const NewsletterModal = ({ isOpen, onClose, source = 'homepage' }: NewsletterModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await newsletterService.subscribe({
        email: data.email,
        name: data.name,
        source,
      });
      setStep('success');
      reset();
    } catch (error) {
      // Error handled in service
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-primary bg-clip-text text-transparent">
            Join Our Wellness Circle
          </DialogTitle>
        </DialogHeader>
        
        {step === 'form' ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className={`pl-10 ${errors.email ? 'border-destructive focus:ring-destructive' : ''}`}
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name (Optional)</Label>
              <Input id="name" placeholder="Your name" {...register('name')} />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Subscribing...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Subscribe for Free
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              No spam, ever. Unsubscribe anytime. See our <a href="/privacy" className="text-primary hover:underline">privacy policy</a>.
            </p>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mx-auto">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold">Thanks for Joining!</h3>
            <p className="text-muted-foreground">Check your inbox for a welcome email with your first wellness tip.</p>
            <Button onClick={onClose} variant="outline" className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};