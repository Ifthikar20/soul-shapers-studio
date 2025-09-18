// src/types/newsletter.types.ts

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

export interface NewsletterResponse {
  success: boolean;
  message: string;
  subscriber?: NewsletterSubscriber;
}

export interface UnsubscribeRequest {
  email: string;
  token?: string; // Optional unsubscribe token from email
}

export interface NewsletterStatusResponse {
  subscriber?: NewsletterSubscriber;
  subscribed: boolean;
}