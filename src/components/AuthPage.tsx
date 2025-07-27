import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowRight, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import betterBlissLogo from "@/assets/better-bliss-logo.jpg";

interface AuthPageProps {
  mode: 'signin' | 'signup';
  onModeChange: (mode: 'signin' | 'signup') => void;
}

const AuthPage = ({ mode, onModeChange }: AuthPageProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle authentication logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-secondary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-80 h-80 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="relative">
              <img 
                src={betterBlissLogo} 
                alt="Better & Bliss" 
                className="w-16 h-16 rounded-3xl object-cover shadow-glow"
              />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Better & Bliss
          </h1>
          <p className="text-muted-foreground">Transform your mental wellness journey</p>
        </div>

        {/* Auth Card */}
        <Card className="shadow-glow border-border/20">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">
              {mode === 'signin' ? 'Welcome Back' : 'Join Better & Bliss'}
            </CardTitle>
            <p className="text-muted-foreground">
              {mode === 'signin' 
                ? 'Sign in to continue your wellness journey' 
                : 'Start your transformation today'
              }
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="rounded-full h-12">
                <span className="text-lg mr-2">G</span>
                Google
              </Button>
              <Button variant="outline" className="rounded-full h-12">
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground">or continue with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="pl-12 h-12 rounded-2xl bg-gradient-card border-border/20 focus:border-primary/40"
                    required
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-12 h-12 rounded-2xl bg-gradient-card border-border/20 focus:border-primary/40"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-12 pr-12 h-12 rounded-2xl bg-gradient-card border-border/20 focus:border-primary/40"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {mode === 'signup' && (
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-12 h-12 rounded-2xl bg-gradient-card border-border/20 focus:border-primary/40"
                    required
                  />
                </div>
              )}

              {mode === 'signin' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-primary hover:text-primary/80 transition-smooth"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button 
                type="submit" 
                variant="futuristic" 
                className="w-full h-12 rounded-2xl text-base font-medium"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>

            {/* Switch Mode */}
            <div className="text-center pt-4 border-t border-border/20">
              <p className="text-muted-foreground text-sm">
                {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => onModeChange(mode === 'signin' ? 'signup' : 'signin')}
                  className="text-primary hover:text-primary/80 font-medium transition-smooth"
                >
                  {mode === 'signin' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            {mode === 'signup' && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  By creating an account, you agree to our{' '}
                  <a href="#" className="text-primary hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Benefits Badge */}
        <div className="mt-8 text-center">
          <Badge className="px-6 py-2 bg-gradient-card border border-primary/20 text-primary font-medium rounded-full shadow-soft">
            <Sparkles className="w-4 h-4 mr-2" />
            Join 10,000+ users transforming their lives
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;