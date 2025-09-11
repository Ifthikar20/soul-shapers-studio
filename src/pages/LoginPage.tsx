// src/pages/LoginPage.tsx - PURPLE PROFESSIONAL MENTAL HEALTH DESIGN WITH SUBTLE ANIMATIONS
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Github,
  Chrome,
  Shield,
  Zap,
  Heart,
  Brain
} from "lucide-react";
import betterBlissLogo from "@/assets/betterandblisslogo.png";
import { authService } from "@/services/auth.service";

const LoginPage = () => {
  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isVisible, setIsVisible] = useState(false);
  
  // Hooks
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page user was trying to access
  const from = location.state?.from?.pathname || "/browse";
  
  console.log('🔍 Login Page - Redirect destination:', from);

  // Animation trigger on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email address";
    }
    
    // Password validation
    if (!password) {
      errors.password = "Password is required";
    } else if (mode === 'signup' && password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    
    // Sign up specific validations
    if (mode === 'signup') {
      if (!fullName.trim()) {
        errors.fullName = "Full name is required";
      }
      
      if (!confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (mode === 'signin') {
        console.log('🚀 Attempting login...');
        await login(email, password);
        console.log('✅ Login successful, redirecting to:', from);
        navigate(from, { replace: true });
      } else {
        console.log('📝 Attempting registration...');
        await register(email, password, fullName);
        console.log('✅ Registration successful, redirecting to browse');
        navigate('/browse', { replace: true });
      }
    } catch (error: any) {
      console.error('❌ Auth error:', error);
      setError(
        error.message || 
        (mode === 'signin' 
          ? "Invalid email or password. Please try again."
          : "Could not create account. Please try again.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle social login
  const handleGoogleLogin = () => {
    setIsLoading(true);
    console.log('🔍 Google login initiated');
    authService.loginWithGoogle();
  };

  const handleGithubLogin = () => {
    console.log("GitHub login not implemented yet");
  };

  // Clear errors when switching modes
  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError("");
    setValidationErrors({});
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Side - Login Form */}
      <div className={`flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 relative transition-all duration-700 ease-out ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
      }`}>
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] opacity-20"></div>
        
        <div className="w-full max-w-md relative z-10">
          {/* Back to Home Link */}
          <Link 
            to="/" 
            className={`inline-flex items-center text-slate-600 dark:text-slate-400 mb-8 transition-all duration-300 hover:translate-x-1 hover:text-purple-600 dark:hover:text-purple-400 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="ml-3 text-sm font-semibold">Back to Home</span>
          </Link>

          {/* Debug Info */}
          <div className={`mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-200/50 dark:border-purple-800/50 rounded-xl transition-all duration-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`} style={{ transitionDelay: '200ms' }}>
            <div className="flex items-center mb-1">
              <Zap className="w-4 h-4 text-purple-600 mr-2" />
              <span className="text-purple-700 dark:text-purple-300 text-sm font-semibold">Demo Mode</span>
            </div>
            <p className="text-purple-600 dark:text-purple-400 text-sm">
              Will redirect to: <code className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 rounded text-sm font-mono">{from}</code>
            </p>
          </div>

          {/* Main Card */}
          <Card className={`border border-slate-200 dark:border-slate-700 shadow-xl bg-white dark:bg-slate-800 transition-all duration-600 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`} style={{ transitionDelay: '300ms' }}>
            <CardHeader className="text-center space-y-4 pb-6">
              {/* Logo */}
              <div className={`mx-auto relative transition-all duration-600 ${
                isVisible ? 'scale-100 rotate-0' : 'scale-0 rotate-45'
              }`} style={{ transitionDelay: '400ms' }}>
                <div className="relative bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 p-3 rounded-2xl border border-purple-200/50 dark:border-purple-700/50 hover:scale-105 transition-transform duration-300">
                  <img 
                    src={betterBlissLogo} 
                    alt="Better & Bliss" 
                    className="w-12 h-12 rounded-xl"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">
                    <Brain className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              
              <div className={`space-y-2 transition-all duration-600 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`} style={{ transitionDelay: '500ms' }}>
                <CardTitle className="text-2xl font-bold">
                  <span className="bg-gradient-to-r from-purple-700 via-indigo-700 to-violet-700 bg-clip-text text-transparent">
                    {mode === 'signin' ? 'Welcome Back' : 'Begin Your Journey'}
                  </span>
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  {mode === 'signin' 
                    ? 'Access your mental health dashboard' 
                    : 'Create your account for personalized wellness'
                  }
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/30">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
                </Alert>
              )}

              {/* Social Login Buttons */}
              <div className={`space-y-3 transition-all duration-600 ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
              }`} style={{ transitionDelay: '600ms' }}>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full h-11 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                >
                  <Chrome className="w-4 h-4 mr-2 text-blue-600" />
                  Continue with Google
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={handleGithubLogin}
                  disabled={isLoading}
                  className="w-full h-11 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-950/20"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Continue with GitHub
                </Button>
              </div>
              
              {/* Divider */}
              <div className={`relative transition-all duration-600 ${
                isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
              }`} style={{ transitionDelay: '700ms' }}>
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-slate-300 dark:bg-slate-600" />
                </div>
                <div className="relative flex justify-center text-sm uppercase">
                  <span className="bg-white dark:bg-slate-800 px-4 text-slate-500 dark:text-slate-400 font-semibold tracking-wider">Or with email</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name (Sign up only) */}
                {mode === 'signup' && (
                  <div className={`space-y-2 transition-all duration-400 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`} style={{ transitionDelay: '800ms' }}>
                    <Label htmlFor="fullName" className="text-slate-700 dark:text-slate-300 font-semibold">Full Name</Label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 transition-colors duration-300 group-focus-within:text-purple-500" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className={`pl-10 h-11 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 hover:shadow-md focus:scale-[1.02] ${validationErrors.fullName ? 'border-red-400 focus:border-red-500' : ''}`}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    {validationErrors.fullName && (
                      <p className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {validationErrors.fullName}
                      </p>
                    )}
                  </div>
                )}
                
                {/* Email */}
                <div className={`space-y-2 transition-all duration-400 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`} style={{ transitionDelay: mode === 'signup' ? '900ms' : '800ms' }}>
                  <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-semibold">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 transition-colors duration-300 group-focus-within:text-purple-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-10 h-11 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 hover:shadow-md focus:scale-[1.02] ${validationErrors.email ? 'border-red-400 focus:border-red-500' : ''}`}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {validationErrors.email}
                    </p>
                  )}
                </div>
                
                {/* Password */}
                <div className={`space-y-2 transition-all duration-400 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`} style={{ transitionDelay: mode === 'signup' ? '1000ms' : '900ms' }}>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-semibold">Password</Label>
                    {mode === 'signin' && (
                      <Link 
                        to="/forgot-password" 
                        className="text-sm text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 transition-colors duration-300"
                      >
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 transition-colors duration-300 group-focus-within:text-purple-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={mode === 'signin' ? "Enter your password" : "Create a strong password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pl-10 pr-10 h-11 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 hover:shadow-md focus:scale-[1.02] ${validationErrors.password ? 'border-red-400 focus:border-red-500' : ''}`}
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 p-1 hover:text-purple-500 transition-all duration-300 hover:scale-110"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {validationErrors.password}
                    </p>
                  )}
                  {mode === 'signup' && (
                    <p className="text-slate-500 text-sm flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Must be at least 8 characters long
                    </p>
                  )}
                </div>
                
                {/* Confirm Password (Sign up only) */}
                {mode === 'signup' && (
                  <div className={`space-y-2 transition-all duration-400 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`} style={{ transitionDelay: '1100ms' }}>
                    <Label htmlFor="confirmPassword" className="text-slate-700 dark:text-slate-300 font-semibold">Confirm Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 transition-colors duration-300 group-focus-within:text-purple-500" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`pl-10 pr-10 h-11 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 hover:shadow-md focus:scale-[1.02] ${validationErrors.confirmPassword ? 'border-red-400 focus:border-red-500' : ''}`}
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 p-1 hover:text-purple-500 transition-all duration-300 hover:scale-110"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {validationErrors.confirmPassword && (
                      <p className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {validationErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                )}
                
                {/* Remember Me (Sign in only) */}
                {mode === 'signin' && (
                  <div className={`flex items-center space-x-2 pt-2 transition-all duration-400 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`} style={{ transitionDelay: '1000ms' }}>
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      className="border-slate-400 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 transition-all duration-300 hover:scale-110"
                    />
                    <Label 
                      htmlFor="remember" 
                      className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer hover:text-purple-600 transition-colors duration-300"
                    >
                      Remember me for 30 days
                    </Label>
                  </div>
                )}
                
                {/* Submit Button - Fixed flickering */}
                <Button 
                  type="submit" 
                  className={`w-full h-12 bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-bold shadow-lg border-0 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-purple-800 hover:to-indigo-800 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                  }`}
                  style={{ transitionDelay: mode === 'signup' ? '1200ms' : '1100ms' }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {mode === 'signin' ? 'Signing you in...' : 'Creating account...'}
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 mr-2" />
                      {mode === 'signin' ? 'Sign In' : 'Create Account'}
                    </>
                  )}
                </Button>
              </form>
              
              {/* Switch Mode */}
              <div className={`text-center pt-4 transition-all duration-600 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`} style={{ transitionDelay: mode === 'signup' ? '1300ms' : '1200ms' }}>
                <span className="text-slate-600 dark:text-slate-400">
                  {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 transition-all duration-300 hover:scale-105"
                  disabled={isLoading}
                >
                  {mode === 'signin' ? 'Create one now' : 'Sign in instead'}
                </button>
              </div>
              
              {/* Terms and Privacy (Sign up only) */}
              {mode === 'signup' && (
                <p className={`text-xs text-center text-slate-500 dark:text-slate-400 leading-relaxed pt-2 transition-all duration-600 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`} style={{ transitionDelay: '1400ms' }}>
                  By creating an account, you agree to our{' '}
                  <Link to="/terms" className="text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 transition-colors duration-300">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 transition-colors duration-300">
                    Privacy Policy
                  </Link>
                </p>
              )}
              
              {/* Additional Info */}
              <div className={`text-center pt-2 transition-all duration-600 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`} style={{ transitionDelay: mode === 'signup' ? '1500ms' : '1300ms' }}>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Need help?{' '}
                  <Link to="/support" className="text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 transition-colors duration-300">
                    Contact Support
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Professional Purple Artwork - Rounded background */}
      <div className={`flex-1 relative overflow-hidden bg-gradient-to-br from-purple-100 via-indigo-100 to-violet-100 dark:from-purple-950 dark:via-indigo-950 dark:to-violet-950 transition-all duration-700 ease-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
      }`} style={{ borderTopLeftRadius: '2rem', borderBottomLeftRadius: '2rem' }}>
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.1),transparent_50%)]"></div>
        </div>

        {/* Subtle Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-16 h-16 rounded-full bg-gradient-to-br from-purple-200/30 to-indigo-200/30 backdrop-blur-sm animate-float-subtle"></div>
          <div className="absolute top-1/3 left-10 w-8 h-8 rounded-full bg-gradient-to-br from-violet-200/40 to-purple-200/40 backdrop-blur-sm animate-float-subtle-delayed"></div>
          <div className="absolute bottom-1/3 right-1/3 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-200/30 to-violet-200/30 backdrop-blur-sm animate-float-gentle"></div>
          
          {/* Subtle Brain icons */}
          <div className="absolute top-1/4 left-1/4 transform rotate-12">
            <Brain className="w-6 h-6 text-purple-300/40" />
          </div>
          <div className="absolute bottom-1/4 right-1/4 transform -rotate-12">
            <Brain className="w-8 h-8 text-indigo-300/40" />
          </div>
        </div>

        {/* Main Artwork Container */}
        <div className={`absolute inset-0 flex items-center justify-center p-12 transition-all duration-800 ease-out ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`} style={{ transitionDelay: '400ms' }}>
          <div className="relative max-w-lg w-full">
            {/* SVG Illustration - Professional Mental Health Scene */}
            <div className="relative animate-float-gentle">
              <svg viewBox="0 0 400 400" className="w-full h-auto drop-shadow-xl">
                {/* Background circle */}
                <circle cx="200" cy="200" r="180" fill="url(#bgGradient)" opacity="0.12"/>
                
                {/* Abstract mountain silhouettes */}
                <path d="M50 250 L120 180 L180 220 L240 160 L300 200 L350 180 L400 220 L400 400 L0 400 Z" 
                      fill="url(#mountainGradient)" opacity="0.6"/>
                
                {/* Professional water reflection */}
                <ellipse cx="200" cy="320" rx="140" ry="40" fill="url(#waterGradient)" opacity="0.4"/>
                
                {/* Stylized trees */}
                <g>
                  <circle cx="100" cy="240" r="25" fill="url(#treeGradient)" opacity="0.7"/>
                  <rect x="95" y="240" width="10" height="30" fill="#6b46c1" opacity="0.6"/>
                </g>
                
                <g>
                  <circle cx="300" cy="220" r="30" fill="url(#treeGradient)" opacity="0.7"/>
                  <rect x="295" y="220" width="10" height="35" fill="#6b46c1" opacity="0.6"/>
                </g>
                
                {/* Professional meditation figure */}
                <g transform="translate(200, 280)">
                  <ellipse cx="0" cy="0" rx="15" ry="20" fill="url(#personGradient)" opacity="0.8"/>
                  <circle cx="0" cy="-25" r="12" fill="url(#personGradient)" opacity="0.8"/>
                  <ellipse cx="-18" cy="-5" rx="8" ry="15" fill="url(#personGradient)" opacity="0.8" transform="rotate(-30)"/>
                  <ellipse cx="18" cy="-5" rx="8" ry="15" fill="url(#personGradient)" opacity="0.8" transform="rotate(30)"/>
                  <ellipse cx="-10" cy="15" rx="8" ry="18" fill="url(#personGradient)" opacity="0.8" transform="rotate(-15)"/>
                  <ellipse cx="10" cy="15" rx="8" ry="18" fill="url(#personGradient)" opacity="0.8" transform="rotate(15)"/>
                </g>
                
                {/* Professional wellness elements */}
                <g opacity="0.6">
                  <g transform="translate(150, 120)">
                    <circle cx="0" cy="0" r="8" fill="url(#brainGradient)"/>
                    <path d="M-4,-4 Q0,-8 4,-4 Q8,0 4,4 Q0,8 -4,4 Q-8,0 -4,-4" fill="url(#brainGradient)"/>
                  </g>
                  <g transform="translate(280, 100)">
                    <circle cx="0" cy="0" r="6" fill="url(#brainGradient)"/>
                    <path d="M-3,-3 Q0,-6 3,-3 Q6,0 3,3 Q0,6 -3,3 Q-6,0 -3,-3" fill="url(#brainGradient)"/>
                  </g>
                </g>
                
                {/* Professional sun/light source */}
                <circle cx="320" cy="80" r="30" fill="url(#sunGradient)" opacity="0.5"/>
                <g transform="translate(320, 80)" opacity="0.3">
                  <line x1="-35" y1="0" x2="-25" y2="0" stroke="url(#sunGradient)" strokeWidth="2"/>
                  <line x1="25" y1="0" x2="35" y2="0" stroke="url(#sunGradient)" strokeWidth="2"/>
                  <line x1="0" y1="-35" x2="0" y2="-25" stroke="url(#sunGradient)" strokeWidth="2"/>
                  <line x1="0" y1="25" x2="0" y2="35" stroke="url(#sunGradient)" strokeWidth="2"/>
                </g>
                
                {/* Professional floating elements */}
                <g opacity="0.4">
                  <circle cx="80" cy="150" r="3" fill="url(#dotGradient)"/>
                  <circle cx="340" cy="180" r="2.5" fill="url(#dotGradient)"/>
                  <circle cx="60" cy="200" r="3" fill="url(#dotGradient)"/>
                </g>
                
                {/* Gradients */}
                <defs>
                  <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed"/>
                    <stop offset="100%" stopColor="#6366f1"/>
                  </linearGradient>
                  
                  <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6"/>
                    <stop offset="50%" stopColor="#7c3aed"/>
                    <stop offset="100%" stopColor="#6366f1"/>
                  </linearGradient>
                  
                  <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1"/>
                    <stop offset="100%" stopColor="#8b5cf6"/>
                  </linearGradient>
                  
                  <linearGradient id="treeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed"/>
                    <stop offset="100%" stopColor="#6b46c1"/>
                  </linearGradient>
                  
                  <linearGradient id="personGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7"/>
                    <stop offset="100%" stopColor="#7c3aed"/>
                  </linearGradient>
                  
                  <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#c084fc"/>
                    <stop offset="100%" stopColor="#a855f7"/>
                  </linearGradient>
                  
                  <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24"/>
                    <stop offset="100%" stopColor="#f59e0b"/>
                  </linearGradient>
                  
                  <linearGradient id="dotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#c084fc"/>
                    <stop offset="100%" stopColor="#8b5cf6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            {/* Professional Quote */}
            <div className={`mt-12 text-center transition-all duration-800 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`} style={{ transitionDelay: '800ms' }}>
              <blockquote className="text-slate-700 dark:text-slate-300 text-xl font-medium leading-relaxed">
                "Mental health is not a destination, but a process."
              </blockquote>
              <cite className="text-slate-600 dark:text-slate-400 text-sm mt-3 block font-semibold">— Noam Shpancer</cite>
            </div>
            
            {/* Professional Stats */}
            <div className={`mt-10 grid grid-cols-3 gap-6 text-center transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`} style={{ transitionDelay: '1000ms' }}>
              <div className="bg-white/25 dark:bg-slate-800/25 backdrop-blur-sm rounded-xl p-4 border border-purple-200/30 dark:border-purple-700/30 hover:scale-105 transition-all duration-300 hover:bg-white/35 dark:hover:bg-slate-800/35">
                <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">25k+</div>
                <div className="text-sm text-slate-700 dark:text-slate-400 font-semibold">Active Users</div>
              </div>
              <div className="bg-white/25 dark:bg-slate-800/25 backdrop-blur-sm rounded-xl p-4 border border-indigo-200/30 dark:border-indigo-700/30 hover:scale-105 transition-all duration-300 hover:bg-white/35 dark:hover:bg-slate-800/35">
                <div className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">98%</div>
                <div className="text-sm text-slate-700 dark:text-slate-400 font-semibold">Satisfaction</div>
              </div>
              <div className="bg-white/25 dark:bg-slate-800/25 backdrop-blur-sm rounded-xl p-4 border border-violet-200/30 dark:border-violet-700/30 hover:scale-105 transition-all duration-300 hover:bg-white/35 dark:hover:bg-slate-800/35">
                <div className="text-3xl font-bold text-violet-700 dark:text-violet-400">24/7</div>
                <div className="text-sm text-slate-700 dark:text-slate-400 font-semibold">Available</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Professional bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" className="w-full h-auto">
            <path d="M0,60 C300,120 600,0 900,60 C1050,90 1150,30 1200,60 L1200,120 L0,120 Z" 
                  fill="url(#waveGradient)" opacity="0.3"/>
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7c3aed"/>
                <stop offset="50%" stopColor="#8b5cf6"/>
                <stop offset="100%" stopColor="#6366f1"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      
      {/* Custom CSS for subtle animations */}
      <style>{`
        @keyframes float-subtle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes float-subtle-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        
        .animate-float-subtle {
          animation: float-subtle 4s ease-in-out infinite;
        }
        
        .animate-float-subtle-delayed {
          animation: float-subtle-delayed 5s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .animate-float-gentle {
          animation: float-gentle 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;