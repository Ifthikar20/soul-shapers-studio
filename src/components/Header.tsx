// src/components/Header.tsx - Updated with secure search
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSecureSearch } from "@/hooks/useSecureSearch";
import {
  Search,
  User,
  Menu,
  Sparkles,
  ChevronDown,
  LogOut,
  Crown,
  Settings,
  Shield,
  BookOpen,
  PenTool,
  MessageCircle,
  Users,
  X,
  Moon,
  Sun
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
import bbLogo from "@/assets/b-b-logo.png";

interface HeaderProps {
  onShowAuth?: (mode: 'signin' | 'signup') => void;
}

const NAVIGATION_CONFIG = {
  expertSpecialties: [
    'Clinical Psychologists',
    'Mindfulness Instructors', 
    'Relationship Therapists',
    'Addiction Counselors',
    'Trauma Specialists',
    'Life Coaches'
  ],
  
  searchSuggestions: [
    "anxiety relief techniques",
    "meditation for beginners", 
    "stress management",
    "building confidence",
    "healthy habits"
  ],
  
  mainNavItems: {
    authenticated: [
      { label: 'Browse', href: '/browse' },
      { label: 'Audio', href: '/audio' },
      { label: 'Read', href: '/read' },
    ],
    guest: [
      { label: 'Browse', href: '/browse' },
      { label: 'Audio', href: '/audio' },
      { label: 'Blog', href: '/blog' }
    ]
  }
};

const Header = ({ onShowAuth }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, loading } = useAuth();

  // Theme state - read from cookie on mount
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const themeCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('theme='));
    return themeCookie?.split('=')[1] === 'dark';
  });

  // Secure search hook with validation and rate limiting
  const {
    searchState,
    setQuery,
    performSearch,
    canSearch,
    isRateLimited,
  } = useSecureSearch({
    autoValidate: true,
    onSearchError: (errors) => {
      console.error('Search validation failed:', errors);
    },
    debounceMs: 300,
  });

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleToggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    // Save to cookie (expires in 1 year)
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    document.cookie = `theme=${newMode ? 'dark' : 'light'}; expires=${expiryDate.toUTCString()}; path=/`;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSearchSuggestions(false);

    if (!canSearch) {
      if (isRateLimited) {
        alert('Too many search requests. Please wait a moment before searching again.');
      }
      return;
    }

    performSearch('/browse');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSearchSuggestions(false);

    // Small delay to allow state to update
    setTimeout(() => {
      if (canSearch) {
        performSearch('/browse');
      }
    }, 100);
  };

  const handleLogout = async () => {
    await logout();
    // Force a full page reload to clear all state
    window.location.href = '/';
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getHeaderClasses = () => {
    return `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-background/95 backdrop-blur-md border-b border-border/20 shadow-sm'
        : 'bg-transparent'
    }`;
  };

  const getTextClasses = (variant: 'primary' | 'secondary' = 'primary') => {
    if (variant === 'secondary') {
      return isScrolled ? 'text-muted-foreground' : 'text-black/70';
    }
    return isScrolled ? 'text-foreground hover:text-primary' : 'text-black hover:text-black/80';
  };

  const LogoSection = () => {
    return (
      <div 
        className="flex items-center space-x-4 cursor-pointer group"
        onClick={() => navigate(isAuthenticated ? '/browse' : '/')}
      >
        <div className="w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform">
          <img 
            src={bbLogo} 
            alt="Better & Bliss Logo" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    );
  };

  const SearchSection = () => {
    // Show search only when authenticated
    if (!isAuthenticated) {
      return null;
    }

    return (
      <div className="relative max-w-md mx-auto">
        <form onSubmit={handleSearchSubmit} className="relative group">
          <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
            getTextClasses('secondary')
          }`} />
          <Input
            placeholder="Search wellness topics, experts..."
            value={searchState.query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSearchSuggestions(!!e.target.value.trim());
            }}
            onFocus={() => setShowSearchSuggestions(!!searchState.query.trim())}
            onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
            disabled={isRateLimited}
            className={`pl-12 pr-4 h-12 text-base rounded-full transition-all duration-300 focus:ring-2 focus:ring-primary/30 shadow-md ${
              isScrolled
                ? 'bg-background/90 border-2 border-primary/40 text-foreground placeholder:text-muted-foreground/70'
                : 'bg-white/20 border-2 border-white/40 text-black placeholder:text-black/50'
            } ${searchState.errors.length > 0 ? 'border-red-500' : ''} ${isRateLimited ? 'opacity-50 cursor-not-allowed' : ''}`}
          />

          {/* Rate limit warning */}
          {isRateLimited && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-red-50 border border-red-200 rounded-xl p-3 z-50 animate-in slide-in-from-top-2">
              <p className="text-xs text-red-600 font-medium">
                Too many searches. Please wait a moment before searching again.
              </p>
            </div>
          )}

          {/* Validation errors */}
          {!isRateLimited && searchState.errors.length > 0 && searchState.query && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-red-50 border border-red-200 rounded-xl p-3 z-50 animate-in slide-in-from-top-2">
              <p className="text-xs text-red-600 font-medium mb-1">Search Error:</p>
              {searchState.errors.map((error, index) => (
                <p key={index} className="text-xs text-red-600">{error}</p>
              ))}
            </div>
          )}

          {/* Search suggestions */}
          {!isRateLimited && showSearchSuggestions && searchState.errors.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border/20 rounded-xl shadow-lg p-3 z-50 animate-in slide-in-from-top-2">
              <p className="text-xs text-muted-foreground mb-2">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {NAVIGATION_CONFIG.searchSuggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-white text-s rounded-full transition-colors"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Warning messages */}
          {searchState.warnings.length > 0 && searchState.query && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-yellow-50 border border-yellow-200 rounded-xl p-3 z-50 animate-in slide-in-from-top-2">
              {searchState.warnings.map((warning, index) => (
                <p key={index} className="text-xs text-yellow-700">{warning}</p>
              ))}
            </div>
          )}
        </form>
      </div>
    );
  };

  const ExpertsDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`font-medium text-base flex items-center gap-1 transition-all hover:scale-105 ${getTextClasses()}`}>
          Experts
          <ChevronDown className="w-3 h-3 transition-transform" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/experts')}
          className="flex items-center gap-2 p-2 w-full justify-start mb-2 hover:bg-accent text-foreground"
        >
          <Users className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">All Experts</span>
        </Button>
        
        <div className="border-t pt-2">
          <p className="text-xs text-muted-foreground mb-2 px-2">By Specialty:</p>
          <div className="space-y-1">
            {NAVIGATION_CONFIG.expertSpecialties.map((specialty) => (
              <Button
                key={specialty}
                variant="ghost"
                onClick={() => navigate(`/experts?specialty=${encodeURIComponent(specialty)}`)}
                className="w-full justify-start text-sm hover:bg-accent p-2 h-auto text-foreground"
              >
                {specialty}
              </Button>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const MainNavigation = () => {
    const navItems = isAuthenticated 
      ? NAVIGATION_CONFIG.mainNavItems.authenticated 
      : NAVIGATION_CONFIG.mainNavItems.guest;

    return (
      <nav className="hidden lg:flex items-center gap-6">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            onClick={() => navigate(item.href)}
            className={`font-medium text-base transition-all hover:scale-105 ${getTextClasses()}`}
          >
            {item.label}
          </Button>
        ))}

        {isAuthenticated && (
          <>
            <ExpertsDropdown />
          </>
        )}
      </nav>
    );
  };

  const UserActions = () => {
    if (loading) {
      return <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />;
    }

    if (isAuthenticated && user) {
      return (
        <div className="flex items-center gap-3">
          {user.subscription_tier === 'free' && (
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex rounded-full border-yellow-300 text-yellow-600 hover:bg-yellow-50 transition-all hover:scale-105"
              onClick={() => navigate('/upgrade')}
            >
              <Crown className="w-3 h-3 mr-2" />
              Upgrade
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:scale-105 transition-transform">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} />
                  <AvatarFallback className="text-xs">
                    {getUserInitials(user.name || user.email)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  {user.subscription_tier !== 'free' && (
                    <Badge variant="secondary" className="w-fit text-xs">
                      {user.subscription_tier}
                    </Badge>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuItem onClick={handleToggleTheme}>
                {isDarkMode ? (
                  <Sun className="mr-2 h-4 w-4" />
                ) : (
                  <Moon className="mr-2 h-4 w-4" />
                )}
                {isDarkMode ? 'Light Mode' : 'Night Mode'}
              </DropdownMenuItem>

              {user.subscription_tier === 'free' && (
                <DropdownMenuItem onClick={() => navigate('/upgrade')} className="text-primary">
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade to Premium
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          className={`font-medium text-base rounded-full hover:scale-105 transition-all border ring-2 ring-purple-400/50 bg-purple-50 hover:bg-purple-100 ${
            isScrolled 
              ? 'text-foreground hover:text-primary border-border/40' 
              : 'text-black hover:text-black/90 border-white/40'
          }`}
          onClick={() => navigate('/login')}
        >
          Sign In
        </Button>
      </div>
    );
  };

  return (
    <>
      <header className={getHeaderClasses()}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            <div className="flex-shrink-0">
              <LogoSection />
            </div>

            {/* Search Section - Only shown when authenticated */}
            <div className="hidden lg:block flex-1 max-w-2xl mx-8">
              <SearchSection />
            </div>

            <div className="flex items-center gap-4">
              <MainNavigation />
              <UserActions />
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden rounded-full hover:scale-105 transition-transform"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Search - Only shown when authenticated */}
          {isAuthenticated && (
            <div className="lg:hidden pb-4">
              <SearchSection />
            </div>
          )}
        </div>
      </header>

      <div className="h-16 lg:h-20"></div>
    </>
  );
};

export default Header;