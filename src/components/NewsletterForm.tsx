// src/components/NewsletterForm.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { newsletterService } from '@/services/newsletter.service';

interface NewsletterFormProps {
  source: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({ 
  source, 
  onSuccess, 
  onError 
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Debug logging in development
    if (import.meta.env.DEV) {
      console.log('📧 Starting newsletter subscription...', {
        email: email.replace(/(.{2}).*(@.*)/, '$1***$2'), // Mask email for logging
        name: name || '(empty)',
        source
      });
    }

    try {
      const result = await newsletterService.subscribe({
        email: email.trim(),
        name: name.trim() || undefined,
        source
      });

      if (result.success) {
        setIsSuccess(true);
        setEmail('');
        setName('');
        onSuccess?.();
        
        if (import.meta.env.DEV) {
          console.log('✅ Newsletter subscription successful!');
        }
        
        // Reset success message after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        const errorMessage = result.error?.message || 'Failed to subscribe. Please try again.';
        setError(errorMessage);
        onError?.(errorMessage);
        
        if (import.meta.env.DEV) {
          console.error('❌ Newsletter subscription failed:', errorMessage);
        }
      }
    } catch (err) {
      const errorMessage = 'Connection failed. Please check your internet and try again.';
      setError(errorMessage);
      onError?.(errorMessage);
      
      if (import.meta.env.DEV) {
        console.error('❌ Newsletter subscription error:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-4">
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Welcome to our community! Check your email to confirm your subscription.
          </AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          onClick={() => setIsSuccess(false)}
          className="w-full"
        >
          Subscribe Another Email
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        <div>
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="h-12 text-base"
            required
          />
        </div>
        
        <div>
          <Input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            className="h-12 text-base"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isLoading || !email.trim()}
        className="w-full h-12 text-base bg-indigo-600 hover:bg-indigo-700"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Subscribing...
          </>
        ) : (
          <>
            <Mail className="w-4 h-4 mr-2" />
            Join Our Community
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        We'll never spam you. Unsubscribe anytime.
      </p>
    </form>
  );
};

export default NewsletterForm;