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
  Sun,
  Brain,
  Heart,
  Lightbulb,
  Smile,
  Activity
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
    { name: 'Clinical Psychologists', icon: Brain },
    { name: 'Mindfulness Instructors', icon: Sparkles },
    { name: 'Relationship Therapists', icon: Heart },
    { name: 'Addiction Counselors', icon: Activity },
    { name: 'Trauma Specialists', icon: Shield },
    { name: 'Life Coaches', icon: Lightbulb }
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
    // Only apply dark mode if user is authenticated
    if (isAuthenticated) {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // Always remove dark mode for unauthenticated users
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode, isAuthenticated]);

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
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/20 shadow-sm dark:bg-black dark:border-gray-800'
        : 'bg-transparent'
    }`;
  };

  const getTextClasses = (variant: 'primary' | 'secondary' = 'primary') => {
    if (variant === 'secondary') {
      return isScrolled ? 'text-gray-600 dark:text-gray-400' : 'text-black/70 dark:text-white/70';
    }
    return isScrolled ? 'text-gray-900 hover:text-primary dark:text-white dark:hover:text-primary' : 'text-black hover:text-black/80 dark:text-white dark:hover:text-white/80';
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
                ? 'bg-white/90 border-2 border-primary/40 text-gray-900 placeholder:text-gray-500 dark:bg-black dark:text-white dark:placeholder:text-gray-400 dark:border-gray-700'
                : 'bg-white/20 border-2 border-white/40 text-black placeholder:text-black/50 dark:bg-black/20 dark:text-white dark:placeholder:text-white/50'
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
        <Button
          variant="ghost"
          className={`font-medium text-base flex items-center gap-1.5 transition-all duration-200 hover:scale-105 group ${getTextClasses()}`}
        >
          Experts
          <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={12}
        className="w-72 p-3 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl"
      >
        {/* Header Section */}
        <div className="mb-3">
          <Button
            variant="ghost"
            onClick={() => navigate('/experts')}
            className="flex items-center gap-3 p-3 w-full justify-start rounded-xl hover:bg-primary/10 text-foreground group transition-all duration-200 hover:scale-[1.02]"
          >
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <span className="text-sm font-semibold block">All Experts</span>
              <span className="text-xs text-muted-foreground">Browse all specialists</span>
            </div>
          </Button>
        </div>

        <DropdownMenuSeparator className="my-2" />

        {/* Specialties Grid */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 px-2 uppercase tracking-wider">
            By Specialty
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {NAVIGATION_CONFIG.expertSpecialties.map((specialty) => {
              const Icon = specialty.icon;
              return (
                <Button
                  key={specialty.name}
                  variant="ghost"
                  onClick={() => navigate(`/experts?specialty=${encodeURIComponent(specialty.name)}`)}
                  className="flex flex-col items-center gap-2 p-3 h-auto hover:bg-primary/10 rounded-xl group transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-xs font-medium text-center leading-tight text-foreground">
                    {specialty.name}
                  </span>
                </Button>
              );
            })}
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
          <div className="flex items-center justify-between min-h-[64px] lg:h-20">

            <div className="flex items-center gap-2 sm:gap-8 flex-1 min-w-0">
              <div className="flex-shrink-0">
                <LogoSection />
              </div>

              {/* Search Section - Only shown when authenticated */}
              <div className="hidden lg:block flex-1 max-w-2xl">
                <SearchSection />
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
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
            <div className="lg:hidden pb-4 pt-2">
              <SearchSection />
            </div>
          )}
        </div>
      </header>

      {/* Spacer - accounts for fixed header height including mobile search */}
      <div className={isAuthenticated ? "h-[120px] lg:h-20" : "h-16 lg:h-20"}></div>
    </>
  );
};

export default Header;