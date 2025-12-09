// ============================================
// FILE: src/contexts/GreatFeelPointsContext.tsx
// Great Feel Points Context for managing user points
// ============================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GreatFeelPointsContextType {
  points: number;
  isAnimating: boolean;
  addPoints: (amount: number) => void;
  resetPoints: () => void;
}

const GreatFeelPointsContext = createContext<GreatFeelPointsContextType | undefined>(undefined);

export const useGreatFeelPoints = () => {
  const context = useContext(GreatFeelPointsContext);
  if (!context) {
    throw new Error('useGreatFeelPoints must be used within a GreatFeelPointsProvider');
  }
  return context;
};

interface GreatFeelPointsProviderProps {
  children: ReactNode;
}

export const GreatFeelPointsProvider: React.FC<GreatFeelPointsProviderProps> = ({ children }) => {
  const [points, setPoints] = useState<number>(() => {
    // Load points from localStorage
    const saved = localStorage.getItem('greatFeelPoints');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isAnimating, setIsAnimating] = useState(false);

  // Save points to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('greatFeelPoints', points.toString());
  }, [points]);

  const addPoints = (amount: number) => {
    setPoints((prev) => prev + amount);
    setIsAnimating(true);

    // Stop animation after 1 second
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  const resetPoints = () => {
    setPoints(0);
    localStorage.removeItem('greatFeelPoints');
  };

  return (
    <GreatFeelPointsContext.Provider value={{ points, isAnimating, addPoints, resetPoints }}>
      {children}
    </GreatFeelPointsContext.Provider>
  );
};
