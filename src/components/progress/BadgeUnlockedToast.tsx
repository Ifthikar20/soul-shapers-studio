// ============================================
// FILE: src/components/progress/BadgeUnlockedToast.tsx
// Badge Achievement Notification Component
// ============================================

import React from 'react';
import { Award, Sparkles } from 'lucide-react';
import type { Badge } from '@/types/progress.types';
import { getBadgeColor } from '@/types/progress.types';

interface BadgeUnlockedToastProps {
  badge: Badge;
  onClose?: () => void;
}

const BadgeUnlockedToast: React.FC<BadgeUnlockedToastProps> = ({ badge, onClose }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg shadow-2xl max-w-md animate-in slide-in-from-bottom-5">
      {/* Sparkle Effect */}
      <div className="absolute top-2 right-2">
        <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
      </div>

      {/* Content */}
      <div className="flex items-start gap-4">
        {/* Badge Icon */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl border-2 border-white/30">
            {badge.icon}
          </div>
        </div>

        {/* Text */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4" />
            <span className="text-sm font-semibold uppercase tracking-wide">
              Achievement Unlocked!
            </span>
          </div>
          <h3 className="text-xl font-bold mb-1">{badge.name}</h3>
          <p className="text-sm text-white/90 mb-2">{badge.description}</p>
          <div className="inline-block px-2 py-1 rounded text-xs font-semibold bg-white/20 backdrop-blur-sm">
            {badge.tier.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}

      {/* Decorative Elements */}
      <div className="absolute -bottom-2 -left-2 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
      <div className="absolute -top-2 -right-2 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
    </div>
  );
};

export default BadgeUnlockedToast;
