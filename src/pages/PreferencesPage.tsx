// src/pages/PreferencesPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Moon,
  Sun
} from 'lucide-react';

const PreferencesPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [nightMode, setNightMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Apply night mode to document
    if (nightMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [nightMode]);

  const handleToggleTheme = () => {
    const newMode = !nightMode;
    setNightMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Preferences</h1>
          <p className="text-gray-600">Customize your experience</p>
        </div>

        {/* Theme Toggle Card */}
        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>
              Choose between light and dark mode
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <Button
                onClick={handleToggleTheme}
                size="lg"
                className={`relative w-64 h-20 rounded-2xl transition-all duration-300 ${
                  nightMode
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                    : 'bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500'
                }`}
              >
                <div className="flex items-center justify-between w-full px-4">
                  <div className="flex items-center gap-3">
                    {nightMode ? (
                      <Moon className="w-8 h-8 text-white" />
                    ) : (
                      <Sun className="w-8 h-8 text-white" />
                    )}
                    <div className="text-left">
                      <p className="text-lg font-bold text-white">
                        {nightMode ? 'Night Mode' : 'Light Mode'}
                      </p>
                      <p className="text-xs text-white/80">
                        {nightMode ? 'Dark theme is active' : 'Light theme is active'}
                      </p>
                    </div>
                  </div>
                  <div className={`w-14 h-8 rounded-full transition-all duration-300 ${
                    nightMode ? 'bg-white/20' : 'bg-white/30'
                  } flex items-center px-1`}>
                    <div className={`w-6 h-6 rounded-full bg-white transition-all duration-300 ${
                      nightMode ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default PreferencesPage;
