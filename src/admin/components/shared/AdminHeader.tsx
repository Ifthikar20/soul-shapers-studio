import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import betterBlissLogo from "@/assets/betterandblisslogo.png";

const AdminHeader = () => {
  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    window.location.reload();
  };

  return (
    <header className="bg-gradient-card/90 backdrop-blur-xl border-b border-border/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={betterBlissLogo} 
              alt="Better & Bliss" 
              className="w-10 h-10 rounded-xl object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-sm text-muted-foreground">Content Management System</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-green-500/10 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              System Online
            </Badge>
            <Button variant="outline" size="sm">
              <User className="w-4 h-4 mr-2" />
              Admin User
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;