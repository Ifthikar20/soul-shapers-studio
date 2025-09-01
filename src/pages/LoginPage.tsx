// src/pages/LoginPage.tsx - FIXED REDIRECT LOGIC
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
  Sparkles, 
  ArrowLeft,
  AlertCircle,
  Loader2,
  Github,
  Chrome
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
  
  // Hooks
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page user was trying to access - THIS IS THE KEY FIX
  const from = location.state?.from?.pathname || "/browse"; // Default to browse, not home
  
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
        // Navigate to where they were trying to go
        navigate(from, { replace: true });
      } else {
        console.log('📝 Attempting registration...');
        await register(email, password, fullName);
        console.log('✅ Registration successful, redirecting to browse');
        // After signup, go to browse page
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
    <div className="min-h-screen bg-gradient-secondary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[800px] h-[600px] bg-gradient-to-br from-primary/10 to-purple-400/5 rounded-[40%_60%_70%_30%] blur-3xl animate-pulse rotate-12"></div>
        <div className="absolute -bottom-32 -right-32 w-[700px] h-[500px] bg-gradient-to-tl from-purple-500/10 to-primary/5 rounded-[60%_40%_30%_70%] blur-3xl animate-pulse delay-1000 -rotate-12"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-primary/5 to-transparent rounded-[50%_30%_70%_50%] blur-2xl animate-pulse delay-500 rotate-45"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Home Link */}
        <Link 
          to="/" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Debug Info - REMOVE IN PRODUCTION */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 text-sm">
            <strong>Debug:</strong> Will redirect to: <code>{from}</code>
          </p>
          <p className="text-blue-600 text-xs mt-1">
            Demo mode: Use any email/password to login
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-glow border-border/50">
          <CardHeader className="text-center space-y-1 pb-4">
            {/* Logo */}
            <div className="mx-auto mb-4 relative">
              <img 
                src={betterBlissLogo} 
                alt="Better & Bliss" 
                className="w-20 h-20 rounded-3xl shadow-soft"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            
            <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {mode === 'signin' ? 'Welcome Back' : 'Join Better & Bliss'}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {mode === 'signin' 
                ? 'Sign in to continue your wellness journey' 
                : 'Create an account to start your transformation'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name (Sign up only) */}
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`pl-10 ${validationErrors.fullName ? 'border-red-500' : ''}`}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  {validationErrors.fullName && (
                    <p className="text-red-500 text-sm">{validationErrors.fullName}</p>
                  )}
                </div>
              )}
              
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 ${validationErrors.email ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                    required
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-red-500 text-sm">{validationErrors.email}</p>
                )}
              </div>
              
              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  {mode === 'signin' && (
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={mode === 'signin' ? "Enter your password" : "Create a password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 pr-10 ${validationErrors.password ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-red-500 text-sm">{validationErrors.password}</p>
                )}
                {mode === 'signup' && (
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters long
                  </p>
                )}
              </div>
              
              {/* Confirm Password (Sign up only) */}
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`pl-10 pr-10 ${validationErrors.confirmPassword ? 'border-red-500' : ''}`}
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="text-red-500 text-sm">{validationErrors.confirmPassword}</p>
                  )}
                </div>
              )}
              
              {/* Remember Me (Sign in only) */}
              {mode === 'signin' && (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label 
                    htmlFor="remember" 
                    className="text-sm font-normal cursor-pointer"
                  >
                    Remember me for 30 days
                  </Label>
                </div>
              )}
              
              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-11" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  </>
                )}
              </Button>
            </form>
            
            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            
            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button 
                type="button"
                variant="outline" 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="h-11"
              >
                <Chrome className="w-4 h-4 mr-2" />
                Google
              </Button>
              <Button 
                type="button"
                variant="outline" 
                onClick={handleGithubLogin}
                disabled={isLoading}
                className="h-11"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>
            
            {/* Switch Mode */}
            <div className="text-center text-sm mt-6">
              <span className="text-muted-foreground">
                {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                type="button"
                onClick={switchMode}
                className="text-primary hover:underline font-medium"
                disabled={isLoading}
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </div>
            
            {/* Terms and Privacy (Sign up only) */}
            {mode === 'signup' && (
              <p className="text-xs text-center text-muted-foreground mt-4">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
        
        {/* Additional Info */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Need help? <Link to="/support" className="text-primary hover:underline">Contact Support</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;