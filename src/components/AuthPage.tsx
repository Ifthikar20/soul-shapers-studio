import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowRight, Github, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import betterBlissLogo from "@/assets/betterandblisslogo.png";

interface AuthPageProps {
  mode: 'signin' | 'signup';
  onModeChange: (mode: 'signin' | 'signup') => void;
  onBack?: () => void;
}

const AuthPage = ({ mode, onModeChange, onBack }: AuthPageProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Name validation for signup
    if (mode === 'signup') {
      if (!formData.name.trim()) {
        newErrors.name = 'Full name is required';
      }

      // Confirm password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, just log the data
      console.log(`${mode === 'signin' ? 'Sign in' : 'Sign up'} submitted:`, {
        email: formData.email,
        password: formData.password,
        ...(mode === 'signup' && { name: formData.name })
      });
      
      // Here you would typically redirect or update global auth state
      alert(`${mode === 'signin' ? 'Sign in' : 'Sign up'} successful!`);
      
    } catch (error) {
      console.error('Auth error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Curved Background Wallpaper */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main curved shape */}
        <div className="absolute -top-40 -left-40 w-[800px] h-[600px] bg-gradient-to-br from-primary/8 to-purple-400/6 rounded-[40%_60%_70%_30%] blur-3xl animate-pulse rotate-12"></div>
        
        {/* Secondary curved shape */}
        <div className="absolute -bottom-32 -right-32 w-[700px] h-[500px] bg-gradient-to-tl from-purple-500/8 to-primary/6 rounded-[60%_40%_30%_70%] blur-3xl animate-pulse delay-1000 -rotate-12"></div>
        
        {/* Tertiary curved overlay */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-primary/4 to-transparent rounded-[50%_30%_70%_50%] blur-2xl animate-pulse delay-500 rotate-45"></div>
        
        {/* Additional organic shapes */}
        <div className="absolute top-10 right-20 w-[300px] h-[200px] bg-gradient-to-bl from-purple-300/6 to-transparent rounded-[70%_30%_40%_60%] blur-xl animate-pulse delay-700"></div>
        <div className="absolute bottom-20 left-10 w-[250px] h-[180px] bg-gradient-to-tr from-primary/6 to-transparent rounded-[40%_60%_50%_50%] blur-xl animate-pulse delay-300"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="absolute -top-16 left-0 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        )}
        
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="relative">
              <img 
                src={betterBlissLogo} 
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
          <p className="text-muted-foreground">Your wellness destination</p>
        </div>

        {/* Auth Card */}
        <Card className="shadow-glow border-border/20">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">
              {mode === 'signin' ? 'Welcome Back' : 'Join Better & Bliss'}
            </CardTitle>
            <p className="text-muted-foreground">
              {mode === 'signin' 
                ? 'Welcome back to Better & Bliss' 
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
                <div className="relative space-y-1">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`pl-12 h-12 rounded-2xl bg-gradient-card border-border/20 focus:border-primary/40 ${
                        errors.name ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                      required
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm px-3">{errors.name}</p>
                  )}
                </div>
              )}

              <div className="relative space-y-1">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`pl-12 h-12 rounded-2xl bg-gradient-card border-border/20 focus:border-primary/40 ${
                      errors.email ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm px-3">{errors.email}</p>
                )}
              </div>

              <div className="relative space-y-1">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`pl-12 pr-12 h-12 rounded-2xl bg-gradient-card border-border/20 focus:border-primary/40 ${
                      errors.password ? 'border-red-500 focus:border-red-500' : ''
                    }`}
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
                {errors.password && (
                  <p className="text-red-500 text-sm px-3">{errors.password}</p>
                )}
              </div>

              {mode === 'signup' && (
                <div className="relative space-y-1">
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`pl-12 h-12 rounded-2xl bg-gradient-card border-border/20 focus:border-primary/40 ${
                        errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                      required
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm px-3">{errors.confirmPassword}</p>
                  )}
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
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