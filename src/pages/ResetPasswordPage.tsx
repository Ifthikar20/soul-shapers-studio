// src/pages/ResetPasswordPage.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Shield,
  ArrowRight
} from "lucide-react";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Redirect countdown
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Password validation
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])/.test(password)) {
      errors.password = "Password must contain at least one lowercase letter";
    } else if (!/(?=.*[A-Z])/.test(password)) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (!/(?=.*\d)/.test(password)) {
      errors.password = "Password must contain at least one number";
    }

    // Confirm password validation
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Check if token exists
  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset link.");
    }
  }, [token]);

  // Countdown and redirect after success
  useEffect(() => {
    if (success && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (success && redirectCountdown === 0) {
      navigate("/login");
    }
  }, [success, redirectCountdown, navigate]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid reset token");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
    } catch (error: any) {
      console.error('Password reset error:', error);
      setError(
        error.message ||
        "Could not reset your password. The link may have expired. Please request a new one."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
              <Shield className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {success ? "Password Reset Complete" : "Set New Password"}
            </h1>
            <p className="text-slate-600">
              {success
                ? "Your password has been successfully changed"
                : "Choose a strong password for your account"
              }
            </p>
          </div>

          {/* Success Message */}
          {success ? (
            <div className="space-y-6">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong className="font-semibold">Success!</strong>
                  <br />
                  Your password has been reset successfully. You can now log in with your new password.
                </AlertDescription>
              </Alert>

              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-center">
                <p className="text-slate-600 text-sm">
                  Redirecting to login page in{" "}
                  <strong className="text-indigo-600 font-semibold text-lg">
                    {redirectCountdown}
                  </strong>{" "}
                  seconds...
                </p>
              </div>

              <Button
                onClick={() => navigate("/login")}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Go to Login Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          ) : (
            <>
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-800">
                    {error}
                    {error.toLowerCase().includes("expired") && (
                      <>
                        <br />
                        <Link
                          to="/forgot-password"
                          className="underline font-semibold hover:text-red-900"
                        >
                          Request a new reset link
                        </Link>
                      </>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a secure password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setValidationErrors({});
                      }}
                      className={`pl-11 pr-11 h-12 rounded-xl border-2 transition-all focus:border-indigo-500 ${
                        validationErrors.password ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
                      }`}
                      disabled={isLoading || !token}
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
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <p className="text-xs text-slate-600 font-medium mb-2">Password must contain:</p>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li className={password.length >= 8 ? "text-green-600" : ""}>
                        • At least 8 characters
                      </li>
                      <li className={/(?=.*[a-z])/.test(password) ? "text-green-600" : ""}>
                        • One lowercase letter
                      </li>
                      <li className={/(?=.*[A-Z])/.test(password) ? "text-green-600" : ""}>
                        • One uppercase letter
                      </li>
                      <li className={/(?=.*\d)/.test(password) ? "text-green-600" : ""}>
                        • One number
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setValidationErrors({});
                      }}
                      className={`pl-11 pr-11 h-12 rounded-xl border-2 transition-all focus:border-indigo-500 ${
                        validationErrors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
                      }`}
                      disabled={isLoading || !token}
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

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isLoading || !token}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Resetting password...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-slate-600 text-sm">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
            >
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
