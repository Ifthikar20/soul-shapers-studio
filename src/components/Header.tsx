// src/components/Header.tsx
import { useState, useEffect } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, loading } = useAuth();

  // Optimized scroll handler with throttling
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY > 10;
          setIsScrolled(scrolled);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
    <header 
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out
        ${isScrolled 
          ? 'bg-background/95 backdrop-blur-md border-b border-border/20 shadow-sm' 
          : 'bg-transparent'
        }
      `}
      style={{
        transform: 'translateZ(0)',
        willChange: 'background-color, backdrop-filter',
        backfaceVisibility: 'hidden',
        perspective: '1000px'
      }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Updated with scroll-based text color */}
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            {/* <div className="relative">
              <img 
                src={betterBlissLogo} 
                className="w-10 h-10 rounded-xl object-cover"
                alt="Better & Bliss"
                loading="eager"
                style={{ imageRendering: 'crisp-edges' }}
              />
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-1.5 h-1.5 text-white" />
              </div>
            </div> */}
            <div className="hidden sm:block">
              <h1 className={`text-lg font-semibold transition-all duration-300 ${
                isScrolled 
                  ? 'text-foreground' 
                  : 'bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent'
              }`}>
                Better & Bliss
              </h1>
            </div>
          </div>

          {/* Enhanced Search Bar - Updated with scroll-based styling */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full group">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-all duration-300 group-focus-within:text-primary ${
                isScrolled ? 'text-muted-foreground' : 'text-white/70'
              }`} />
              <Input
                placeholder="Search wellness topics, experts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-11 pr-4 h-11 rounded-2xl transition-all duration-300 text-sm ${
                  isScrolled 
                    ? 'bg-background/80 backdrop-blur-sm border border-border/40 focus:border-primary/60 text-foreground placeholder:text-muted-foreground/70' 
                    : 'bg-white/10 backdrop-blur-sm border border-white/20 focus:border-white/40 text-white placeholder:text-white/50'
                }`}
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'none'
                }}
              />
              
              {/* Search suggestions */}
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border/20 rounded-xl shadow-lg backdrop-blur-sm p-3 z-50">
                  <p className="text-xs text-muted-foreground mb-2 font-medium">Popular searches:</p>
                  <div className="flex flex-wrap gap-2">
                    {searchSuggestions.map((suggestion, index) => (
                      <Badge 
                        key={index}
                        variant="secondary" 
                        className="cursor-pointer hover:bg-primary hover:text-white transition-colors text-xs rounded-full px-3 py-1"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Navigation - Updated with scroll-based text color */}
          <nav className="hidden lg:flex items-center space-x-6">
            <a 
              href="/browse" 
              className={`font-medium flex items-center gap-2 transition-all duration-300 ${
                isScrolled 
                  ? 'text-foreground hover:text-primary' 
                  : 'text-white hover:text-white/80'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Browse
            </a>
            <a 
              href="#categories" 
              className={`font-medium transition-all duration-300 ${
                isScrolled 
                  ? 'text-foreground hover:text-primary' 
                  : 'text-white hover:text-white/80'
              }`}
            >
              Categories
            </a>
            <div className="relative group">
              <a 
                href="#experts" 
                className={`font-medium flex items-center gap-1 transition-all duration-300 ${
                  isScrolled 
                    ? 'text-foreground hover:text-primary' 
                    : 'text-white hover:text-white/80'
                }`}
              >
                Experts
                <ChevronDown className="w-3 h-3" />
              </a>
            </div>
            {user?.role === 'admin' && (
              <a 
                href="/admin" 
                className={`font-medium flex items-center gap-2 transition-all duration-300 ${
                  isScrolled 
                    ? 'text-purple-600 hover:text-purple-700' 
                    : 'text-purple-300 hover:text-purple-200'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </a>
            )}
          </nav>

          {/* User Actions - Updated with scroll-based styling */}
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`md:hidden rounded-full transition-all duration-300 ${
                isScrolled 
                  ? 'text-foreground hover:bg-accent' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Search className="w-4 h-4" />
            </Button>
            
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : isAuthenticated && user ? (
              // Authenticated user menu
              <div className="flex items-center space-x-3">
                {user.subscription_tier === 'free' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="hidden sm:flex rounded-full"
                    onClick={() => navigate('/upgrade')}
                  >
                    <Crown className="w-3 h-3 mr-2 text-yellow-500" />
                    Upgrade
                  </Button>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} />
                        <AvatarFallback className="text-xs">{getUserInitials(user.name || user.email)}</AvatarFallback>
                      </Avatar>
                      {user.subscription_tier === 'premium' && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Crown className="w-1.5 h-1.5 text-white" />
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
              </div>
            ) : (
              // Not authenticated - show login/signup buttons
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  className="hidden sm:flex rounded-full"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
                <Button 
                  variant="default" 
                  className="rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                  onClick={() => navigate('/login')}
                >
                  <Sparkles className="w-3 h-3 mr-2" />
                  Get Started
                </Button>
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              className={`lg:hidden rounded-full transition-all duration-300 ${
                isScrolled 
                  ? 'text-foreground hover:bg-accent' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;