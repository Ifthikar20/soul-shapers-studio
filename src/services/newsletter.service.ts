import axios from 'axios';
import { toast } from 'sonner';
import { SubscribeRequest, NewsletterSubscriber } from '@/types/newsletter.types';
import { trackUpgradeEvent } from '@/utils/upgradeTracking'; // Reuse for analytics

class NewsletterService {
  private api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    withCredentials: true,
    timeout: 5000,
  });

  async subscribe(data: SubscribeRequest): Promise<NewsletterSubscriber> {
    try {
      const response = await this.api.post('/newsletter/subscribe', data);
      const subscriber = response.data;
      
      // Track analytics
      trackUpgradeEvent('newsletter_subscribe', {
        upgradeId: `nl-${subscriber.id}`,
        source: data.source,
        plan: 'free', // Newsletter is free tier
      });
      
      toast.success('Welcome aboard! Check your email for a confirmation.', {
        description: 'You\'ll receive weekly mental wellness tips.',
      });
      
      return subscriber;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Subscription failed. Please try again.';
      toast.error(message);
      throw error;
    }
  }
}

export const newsletterService = new NewsletterService();