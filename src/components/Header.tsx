// src/components/Header.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Search, 
  User, 
  Menu, 
  Sparkles, 
  BookOpen, 
  ChevronDown,
  LogOut,
  Crown,
  Settings,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import betterBlissLogo from "@/assets/betterandblisslogo.png";

interface HeaderProps {
  onShowAuth?: (mode: 'signin' | 'signup') => void;
}

const searchSuggestions = [
  "anxiety relief techniques",
  "meditation for beginners", 
  "stress management",
  "building confidence",
  "healthy habits"
];

const Header = ({ onShowAuth }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, loading } = useAuth();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-gradient-card/80 backdrop-blur-xl border-b border-border/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-4 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <img 
                src={betterBlissLogo} 
                className="w-12 h-12 rounded-2xl object-cover shadow-soft"
                alt="Better & Bliss"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-primary rounded-full flex items-center justify-center">
                <Sparkles className="w-2 h-2 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">
                Better & Bliss
              </h1>
            </div>
          </div>

          {/* Enhanced Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-smooth" />
              <Input
                placeholder="Search wellness topics, experts, case studies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 h-14 rounded-3xl bg-gradient-card border-2 border-border/20 focus:border-primary/40 shadow-card text-base placeholder:text-muted-foreground/70"
              />
              
              {/* Search Suggestions */}
              <div className="absolute top-full left-0 right-0 mt-2 opacity-0 group-focus-within:opacity-100 transition-smooth pointer-events-none group-focus-within:pointer-events-auto">
                <div className="bg-gradient-card border border-border/20 rounded-2xl shadow-hover p-3 backdrop-blur-sm">
                  <p className="text-xs text-muted-foreground mb-2 font-medium">Popular searches:</p>
                  <div className="flex flex-wrap gap-2">
                    {searchSuggestions.map((suggestion, index) => (
                      <Badge 
                        key={index}
                        variant="secondary" 
                        className="cursor-pointer hover:bg-primary hover:text-white transition-smooth text-xs rounded-full"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="/browse" className="text-foreground hover:text-primary transition-smooth font-medium flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Browse
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-smooth font-medium">
              Categories
            </a>
            <div className="relative group">
              <a href="#" className="text-foreground hover:text-primary transition-smooth font-medium flex items-center gap-1">
                Case Studies
                <ChevronDown className="w-4 h-4" />
              </a>
            </div>
            <a href="#" className="text-foreground hover:text-primary transition-smooth font-medium">
              Experts
            </a>
            {/* Show Admin link for admin users */}
            {user?.role === 'admin' && (
              <a 
                href="/admin" 
                className="text-purple-600 hover:text-purple-700 transition-smooth font-medium flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Admin
              </a>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="md:hidden rounded-full">
              <Search className="w-5 h-5" />
            </Button>
            
            {loading ? (
              // Loading state
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : isAuthenticated && user ? (
              // Authenticated user menu
              <>
                {/* Upgrade button for free users */}
                {user.subscription_tier === 'free' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="hidden sm:flex rounded-full"
                    onClick={() => navigate('/upgrade')}
                  >
                    <Crown className="w-4 h-4 mr-2 text-yellow-500" />
                    Upgrade
                  </Button>
                )}
                
                {/* User dropdown menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} />
                        <AvatarFallback>{getUserInitials(user.name || user.email)}</AvatarFallback>
                      </Avatar>
                      {user.subscription_tier === 'premium' && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Crown className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                        <Badge 
                          variant="secondary" 
                          className="mt-2 w-fit text-xs"
                        >
                          {user.subscription_tier === 'premium' ? '👑 Premium' : 
                           user.subscription_tier === 'basic' ? '⭐ Basic' : 
                           '🆓 Free'} Member
                        </Badge>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    
                    {user.subscription_tier === 'free' && (
                      <DropdownMenuItem 
                        onClick={() => navigate('/upgrade')}
                        className="text-primary"
                      >
                        <Crown className="mr-2 h-4 w-4" />
                        <span>Upgrade to Premium</span>
                      </DropdownMenuItem>
                    )}
                    
                    {user.role === 'admin' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => navigate('/admin')}
                          className="text-purple-600"
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Admin Panel</span>
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              // Not authenticated - show login/signup buttons
              <>
                <Button 
                  variant="outline" 
                  className="hidden sm:flex rounded-full"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
                <Button 
                  variant="futuristic" 
                  className="rounded-full"
                  onClick={() => navigate('/login')}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </>
            )}
            
            <Button variant="ghost" size="icon" className="lg:hidden rounded-full">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;