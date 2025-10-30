// src/pages/LoginPage.tsx - SIMPLIFIED PURPLE PROFESSIONAL MENTAL HEALTH DESIGN
import { useState } from "react";
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
  Heart,
  Brain
} from "lucide-react";
import gfLogo from "@/assets/gf-logo.svg";
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

  // Hooks
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user was trying to access
  const from = location.state?.from?.pathname || "/browse";

  console.log('🔍 Login Page - Redirect destination:', from);

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
    <div className="min-h-screen flex flex-col xl:flex-row overflow-hidden">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-6 bg-slate-50 dark:bg-slate-900">
        <div className="w-full max-w-md">
          {/* Back to Home Link */}
          <Link
            to="/"
            className="inline-flex items-center text-slate-600 dark:text-slate-400 mb-4 lg:mb-8 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="ml-3 text-sm font-semibold">Back to Home</span>
          </Link>

          {/* Main Card */}
          <Card className="border border-slate-200 dark:border-slate-700 shadow-xl bg-white dark:bg-slate-800">
            <CardHeader className="text-center space-y-3 lg:space-y-4 pb-4 lg:pb-6">
              {/* Logo */}
              <div className="mx-auto">
                <img
                  src={gfLogo}
                  alt="gf."
                  className="w-16 h-16 lg:w-20 lg:h-20 mx-auto hover:scale-105 transition-transform duration-200"
                />
              </div>

              <div className="space-y-1 lg:space-y-2">
                <CardTitle className="text-xl lg:text-2xl font-bold">
                  <span className="bg-gradient-to-r from-purple-700 via-indigo-700 to-violet-700 bg-clip-text text-transparent">
                    {mode === 'signin' ? 'Welcome Back' : 'Begin Your Journey'}
                  </span>
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 text-sm lg:text-base">
                  {mode === 'signin'
                    ? 'Access your mental health dashboard'
                    : 'Create your account for personalized wellness'
                  }
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 lg:space-y-6">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/30">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
                </Alert>
              )}

              {/* Social Login Buttons */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full h-11 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
                >
                  <Chrome className="w-4 h-4 mr-2 text-blue-600" />
                  Continue with Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGithubLogin}
                  disabled={isLoading}
                  className="w-full h-11 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-semibold hover:bg-gray-50 dark:hover:bg-gray-950/20 transition-colors"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Continue with GitHub
                </Button>
              </div>

              {/* Divider */}
              <div className="relative">
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
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-slate-700 dark:text-slate-300 font-semibold">Full Name</Label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-purple-500 transition-colors" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className={`pl-10 h-10 lg:h-11 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-purple-500 focus:ring-purple-500/20 ${validationErrors.fullName ? 'border-red-400 focus:border-red-500' : ''}`}
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
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-semibold">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-purple-500 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-10 h-10 lg:h-11 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-purple-500 focus:ring-purple-500/20 ${validationErrors.email ? 'border-red-400 focus:border-red-500' : ''}`}
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
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-semibold">Password</Label>
                    {mode === 'signin' && (
                      <Link
                        to="/forgot-password"
                        className="text-sm text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-purple-500 transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={mode === 'signin' ? "Enter your password" : "Create a strong password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pl-10 pr-10 h-10 lg:h-11 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-purple-500 focus:ring-purple-500/20 ${validationErrors.password ? 'border-red-400 focus:border-red-500' : ''}`}
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 p-1 hover:text-purple-500 transition-colors"
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
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-700 dark:text-slate-300 font-semibold">Confirm Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-purple-500 transition-colors" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`pl-10 pr-10 h-10 lg:h-11 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-purple-500 focus:ring-purple-500/20 ${validationErrors.confirmPassword ? 'border-red-400 focus:border-red-500' : ''}`}
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 p-1 hover:text-purple-500 transition-colors"
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
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      className="border-slate-400 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer hover:text-purple-600 transition-colors"
                    >
                      Remember me for 30 days
                    </Label>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-10 lg:h-12 bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-bold shadow-lg border-0 hover:from-purple-800 hover:to-indigo-800 transition-colors"
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
              <div className="text-center pt-4">
                <span className="text-slate-600 dark:text-slate-400">
                  {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 transition-colors"
                  disabled={isLoading}
                >
                  {mode === 'signin' ? 'Create one now' : 'Sign in instead'}
                </button>
              </div>

              {/* Terms and Privacy (Sign up only) */}
              {mode === 'signup' && (
                <p className="text-xs text-center text-slate-500 dark:text-slate-400 leading-relaxed pt-2">
                  By creating an account, you agree to our{' '}
                  <Link to="/terms" className="text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy-policy" className="text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 transition-colors">
                    Privacy Policy
                  </Link>
                </p>
              )}

              {/* Additional Info */}
              <div className="text-center pt-2">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Need help?{' '}
                  <Link to="/support" className="text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 transition-colors">
                    Contact Support
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Background Image with Quotes Overlay */}
      <div
        className="flex-1 relative overflow-hidden hidden xl:flex"
        style={{
          backgroundImage: 'url(/src/assets/login-page-canvas.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Cloudy/Blended Left Edge */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 dark:from-slate-900 via-slate-50/70 dark:via-slate-900/70 to-transparent z-10"></div>

        {/* Dark Overlay for Better Text Readability */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Centered Content Container */}
        <div className="relative w-full h-full flex items-center justify-center p-8">
          <div className="flex flex-col items-center justify-center max-w-2xl">
            {/* Quotes Section */}
            <div className="text-center space-y-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
              <blockquote className="text-xl font-medium text-gray-800 dark:text-gray-100 italic">
                "Your mental health is just as important as your physical health."
              </blockquote>

              <blockquote className="text-base font-medium text-gray-700 dark:text-gray-200 italic">
                "It's okay to not be okay. What matters is that you're taking steps to heal."
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;