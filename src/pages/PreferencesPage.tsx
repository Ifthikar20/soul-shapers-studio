// src/pages/PreferencesPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Moon,
  Sun,
  Monitor,
  Volume2,
  Globe,
  Type,
  Palette
} from 'lucide-react';

const PreferencesPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [nightMode, setNightMode] = useState(false);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [language, setLanguage] = useState('en');
  const [fontSize, setFontSize] = useState('medium');
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'auto'>('light');

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  React.useEffect(() => {
    // Apply night mode to document
    if (nightMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [nightMode]);

  const handleNightModeToggle = (checked: boolean) => {
    setNightMode(checked);
    setThemeMode(checked ? 'dark' : 'light');
    localStorage.setItem('theme', checked ? 'dark' : 'light');
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

        {/* Appearance Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how the app looks and feels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Night Mode Toggle */}
            <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${nightMode ? 'bg-indigo-600' : 'bg-amber-400'}`}>
                  {nightMode ? (
                    <Moon className="w-5 h-5 text-white" />
                  ) : (
                    <Sun className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="night-mode" className="text-base font-semibold">
                    Night Mode
                  </Label>
                  <p className="text-sm text-gray-600">
                    {nightMode ? 'Dark theme is active' : 'Light theme is active'}
                  </p>
                </div>
              </div>
              <Switch
                id="night-mode"
                checked={nightMode}
                onCheckedChange={handleNightModeToggle}
                className="data-[state=checked]:bg-indigo-600"
              />
            </div>

            {/* Theme Mode Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Theme Preference</Label>
              <RadioGroup value={themeMode} onValueChange={(value) => setThemeMode(value as 'light' | 'dark' | 'auto')}>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <div>
                      <p className="font-medium">Light</p>
                      <p className="text-xs text-gray-500">Always use light theme</p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Moon className="w-4 h-4 text-indigo-600" />
                    <div>
                      <p className="font-medium">Dark</p>
                      <p className="text-xs text-gray-500">Always use dark theme</p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="auto" id="auto" />
                  <Label htmlFor="auto" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Monitor className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="font-medium">Auto</p>
                      <p className="text-xs text-gray-500">Match system preference</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Font Size */}
            <div className="space-y-3">
              <Label htmlFor="font-size" className="text-base font-semibold flex items-center gap-2">
                <Type className="w-4 h-4" />
                Font Size
              </Label>
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger id="font-size">
                  <SelectValue placeholder="Select font size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="extra-large">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Audio Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Audio
            </CardTitle>
            <CardDescription>
              Control audio playback settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-play">Auto-play Next Session</Label>
                <p className="text-sm text-gray-500">
                  Automatically play the next session when current one ends
                </p>
              </div>
              <Switch
                id="auto-play"
                checked={autoPlayAudio}
                onCheckedChange={setAutoPlayAudio}
              />
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Language & Region
            </CardTitle>
            <CardDescription>
              Choose your preferred language
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="it">Italiano</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default PreferencesPage;
