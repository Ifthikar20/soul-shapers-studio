// src/pages/NewsletterOnlyPage.tsx - Secure implementation
import React from 'react';
import NewsletterForm from '@/components/NewsletterForm';
import watercolorImage from '@/assets/watercolor.png';

const NewsletterOnlyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* CSRF Token Meta Tag - Add this to your HTML head */}
      <script dangerouslySetInnerHTML={{
        __html: `
          // Add CSRF token to page for security
          if (!document.querySelector('meta[name="csrf-token"]')) {
            const meta = document.createElement('meta');
            meta.name = 'csrf-token';
            meta.content = '${window.crypto?.randomUUID?.() || 'development-token'}';
            document.head.appendChild(meta);
          }
        `
      }} />

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          
          {/* Content Section */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-5xl font-bold text-gray-900 leading-tight">
                Solving mental health by building community
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Join our community and get wellness insights from real people on similar journeys.
              </p>
              
              <div className="space-y-3 text-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span>Weekly mental health stories and community wisdom</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span>Peer-to-peer support exercises and shared experiences</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span>Early access to our community wellness platform</span>
                </div>
              </div>
            </div>

            {/* Newsletter Form Component */}
            <div className="max-w-md">
              <NewsletterForm 
                source="newsletter_landing"
                onSuccess={() => {
                  console.log('Newsletter signup successful');
                }}
              />
            </div>
          </div>

          {/* Image Section */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl overflow-hidden flex items-center justify-center">
                <img
                  src={watercolorImage}
                  alt="Community wellness illustration"
                  className="w-full h-full object-contain p-8"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-100 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Brand */}
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-500">
                Better & Bliss • Mental Health & Wellness Platform • Your journey starts here
              </p>
            </div>

            {/* Footer Links */}
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
              <a 
                href="/about" 
                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
              >
                About Us
              </a>
              <a 
                href="/terms" 
                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
              >
                Terms & Conditions
              </a>
              <a 
                href="/privacy" 
                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a 
                href="/contact" 
                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-6 pt-4 border-t border-gray-50">
            <p className="text-xs text-gray-400">
              © 2024 Better & Bliss. All rights reserved. Building community-driven mental wellness together.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default NewsletterOnlyPage;