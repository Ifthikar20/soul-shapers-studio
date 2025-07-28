import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock } from "lucide-react";

interface AdminAuthWrapperProps {
  children: React.ReactNode;
}

const AdminAuthWrapper = ({ children }: AdminAuthWrapperProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple demo authentication - replace with real auth
    if (credentials.username === "admin" && credentials.password === "admin123") {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
    } else {
      alert('Invalid credentials! Use: admin / admin123');
    }
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  useEffect(() => {
    // Check if already authenticated
    const authStatus = localStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-secondary flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[400px] bg-gradient-to-br from-primary/6 to-purple-400/4 rounded-[40%_60%_70%_30%] blur-3xl animate-pulse rotate-12"></div>
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[350px] bg-gradient-to-tl from-purple-500/6 to-primary/4 rounded-[60%_40%_30%_70%] blur-3xl animate-pulse delay-1000 -rotate-12"></div>
        </div>

        <Card className="w-full max-w-md shadow-glow relative z-10">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                Admin Access
              </h2>
              <p className="text-muted-foreground">
                Secure login to content management system
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  onKeyPress={handleKeyPress}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  onKeyPress={handleKeyPress}
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={handleLogin} 
                className="w-full h-12 rounded-2xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Access Admin Panel
                  </>
                )}
              </Button>
              
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground text-center mb-2">
                  <strong>Demo Credentials:</strong>
                </p>
                <p className="text-xs text-center font-mono">
                  Username: <span className="text-primary">admin</span><br />
                  Password: <span className="text-primary">admin123</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminAuthWrapper;