export interface NewsletterSubscriber {
    id: string;
    email: string;
    name?: string;
    subscribedAt: string;
    status: 'active' | 'unconfirmed' | 'unsubscribed';
  }
  
  export interface SubscribeRequest {
    email: string;
    name?: string;
    source: string; // e.g., 'homepage'
  }