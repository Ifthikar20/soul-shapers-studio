// src/components/auth/LoginForm.tsx - Professional Design
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User,
  Sparkles, 
  AlertCircle,
  Loader2,
  Chrome,
  ArrowRight,
  Shield
} from "lucide-react";
import { Link } from "react-router-dom";
import { authService } from "@/services/auth.service";

interface LoginFormProps {
  redirectTo: string;
}

const LoginForm = ({ redirectTo }: LoginFormProps) => {
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
  
  console.log('🔍 LoginForm - Redirect destination:', redirectTo);

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
        console.log('✅ Login successful, redirecting to:', redirectTo);
        navigate(redirectTo, { replace: true });
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

  // Clear errors when switching modes
  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError("");
    setValidationErrors({});
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="w-full">
      {/* Form Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
        </h3>
        <p className="text-slate-600">
          {mode === 'signin' 
            ? 'Welcome back! Please enter your credentials to continue.' 
            : 'Join our community and start your wellness journey today.'
          }
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-4 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Social Login */}
      <div className="mb-4">
        <Button 
          type="button"
          variant="outline" 
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full h-11 rounded-xl border-2 hover:shadow-md transition-all duration-300 bg-white hover:bg-gray-50"
        >
          <Chrome className="w-5 h-5 mr-3 text-slate-600" />
          <span className="text-slate-700 font-medium">Continue with Google</span>
        </Button>
      </div>

      {/* Divider */}
      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-slate-500 font-medium">or continue with email</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name (Sign up only) */}
        {mode === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-slate-700 font-medium">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`pl-11 h-12 rounded-xl border-2 transition-all focus:border-indigo-500 ${
                  validationErrors.fullName ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
                }`}
                disabled={isLoading}
                required
              />
            </div>
            {validationErrors.fullName && (
              <p className="text-red-600 text-sm font-medium">{validationErrors.fullName}</p>
            )}
          </div>
        )}
        
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`pl-11 h-12 rounded-xl border-2 transition-all focus:border-indigo-500 ${
                validationErrors.email ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
              }`}
              disabled={isLoading}
              required
            />
          </div>
          {validationErrors.email && (
            <p className="text-red-600 text-sm font-medium">{validationErrors.email}</p>
          )}
        </div>
        
        {/* Password */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
            {mode === 'signin' && (
              <Link 
                to="/forgot-password" 
                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={mode === 'signin' ? "Enter your password" : "Create a secure password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`pl-11 pr-11 h-12 rounded-xl border-2 transition-all focus:border-indigo-500 ${
                validationErrors.password ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
              }`}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {validationErrors.password && (
            <p className="text-red-600 text-sm font-medium">{validationErrors.password}</p>
          )}
          {mode === 'signup' && (
            <p className="text-slate-500 text-sm">
              Must be at least 8 characters long
            </p>
          )}
        </div>
        
        {/* Confirm Password (Sign up only) */}
        {mode === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`pl-11 pr-11 h-12 rounded-xl border-2 transition-all focus:border-indigo-500 ${
                  validationErrors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
                }`}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="text-red-600 text-sm font-medium">{validationErrors.confirmPassword}</p>
            )}
          </div>
        )}
        
        {/* Remember Me (Sign in only) */}
        {mode === 'signin' && (
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="remember" 
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              className="rounded border-2"
            />
            <Label 
              htmlFor="remember" 
              className="text-slate-600 font-medium cursor-pointer"
            >
              Keep me signed in for 30 days
            </Label>
          </div>
        )}
        
        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {mode === 'signin' ? 'Signing you in...' : 'Creating your account...'}
            </>
          ) : (
            <>
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </form>
      
      {/* Switch Mode */}
      <div className="mt-8 text-center">
        <p className="text-slate-600">
          {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={switchMode}
            className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors"
            disabled={isLoading}
          >
            {mode === 'signin' ? 'Sign up for free' : 'Sign in instead'}
          </button>
        </p>
      </div>
      
      {/* Terms and Privacy (Sign up only) */}
      {mode === 'signup' && (
        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-600 text-center leading-relaxed">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-indigo-600 hover:text-indigo-500 font-medium">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500 font-medium">
              Privacy Policy
            </Link>.
            <br />
            Your data is protected and never shared with third parties.
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;