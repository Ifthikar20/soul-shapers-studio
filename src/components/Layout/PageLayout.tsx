// src/components/Layout/PageLayout.tsx
import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  hasHero?: boolean; // For pages with hero sections that should start at top
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  className = '', 
  hasHero = false 
}) => {
  return (
    <div 
      className={`
        ${hasHero ? 'pt-0' : 'pt-20'} 
        min-h-screen 
        ${className}
      `}
      style={{
        // Ensure content starts below the fixed header
        marginTop: hasHero ? '0' : '0',
        paddingTop: hasHero ? '80px' : '80px', // Header height
      }}
    >
      {children}
    </div>
  );
};

export default PageLayout;