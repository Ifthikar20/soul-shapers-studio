// src/components/Header.tsx - Clean Solution
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
  Brain,
  Leaf,
  Heart,
  Users,
  Star,
  Target
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

interface HeaderProps {
  onShowAuth?: (mode: 'signin' | 'signup') => void;
}

const categories = [
  { id: 'mental-health', name: 'Mental Health', icon: Brain },
  { id: 'mindfulness', name: 'Mindfulness', icon: Leaf },
  { id: 'emotional-wellness', name: 'Emotional Wellness', icon: Heart },
  { id: 'relationships', name: 'Relationships', icon: Users },
  { id: 'personal-growth', name: 'Personal Growth', icon: Star },
  { id: 'breaking-habits', name: 'Breaking Habits', icon: Target }
];

const expertSpecialties = [
  'Clinical Psychologists',
  'Mindfulness Instructors', 
  'Relationship Therapists',
  'Addiction Counselors',
  'Trauma Specialists',
  'Life Coaches'
];

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

  // Scroll handler
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

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
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

  const handleCategoryClick = (categorySlug: string) => {
    navigate(`/browse?category=${categorySlug}`);
  };

  const handleExpertClick = (specialty?: string) => {
    const url = specialty ? `/experts?specialty=${encodeURIComponent(specialty)}` : '/experts';
    navigate(url);
  };

  return (
    <>
      {/* Header Styles - Keep minimal and clean */}
      <style>{`
        .header-fixed {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
        }
        
        .header-dropdown {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
        }
        
        .header-container {
          width: 100%;
          max-width: none;
          padding-left: 1rem;
          padding-right: 1rem;
        }
        
        @media (min-width: 1200px) {
          .header-container {
            max-width: 1200px;
            margin: 0 auto;
          }
        }
      `}</style>

      <header
        className={`header-fixed transition-all duration-300 ease-out ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-md border-b border-border/20 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="header-container py-4">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate(isAuthenticated ? '/browse' : '/')}
            >
              <h1 className={`text-lg font-semibold transition-all duration-300 ${
                isScrolled
                  ? 'text-foreground'
                  : 'bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent'
              }`}>
                Better & Bliss
              </h1>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <form onSubmit={handleSearchSubmit} className="relative w-full group">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                  isScrolled ? 'text-muted-foreground' : 'text-white/70'
                }`} />
                <Input
                  placeholder="Search wellness topics, experts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-11 pr-4 h-11 rounded-2xl transition-all duration-300 ${
                    isScrolled
                      ? 'bg-background/80 border-border/40 text-foreground placeholder:text-muted-foreground/70'
                      : 'bg-white/10 border-white/20 text-white placeholder:text-white/50'
                  }`}
                />
                
                {/* Search Suggestions */}
                {searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border/20 rounded-xl shadow-lg p-3 z-50">
                    <p className="text-xs text-muted-foreground mb-2">Popular searches:</p>
                    <div className="flex flex-wrap gap-2">
                      {searchSuggestions.map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary hover:text-white text-xs rounded-full"
                          onClick={() => handleSearch(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  {/* Blog & Community */}
                  <a href="/blog" className={`font-medium transition-colors ${
                    isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80'
                  }`}>
                    Blog
                  </a>
                  
                  <a href="/community" className={`font-medium transition-colors ${
                    isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80'
                  }`}>
                    Community
                  </a>

                  {/* Categories Dropdown */}
                  <div className="relative group">
                    <button className={`font-medium flex items-center gap-1 transition-colors ${
                      isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80'
                    }`}>
                      Categories
                      <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                    </button>
                    
                    <div className="header-dropdown opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-background border border-border/20 rounded-xl shadow-lg p-4 w-80">
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category) => {
                          const IconComponent = category.icon;
                          return (
                            <button
                              key={category.id}
                              onClick={() => handleCategoryClick(category.id)}
                              className="flex items-center gap-2 p-2 text-left hover:bg-accent rounded-lg transition-colors"
                            >
                              <IconComponent className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium">{category.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Experts Dropdown */}
                  <div className="relative group">
                    <button className={`font-medium flex items-center gap-1 transition-colors ${
                      isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80'
                    }`}>
                      Experts
                      <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                    </button>
                    
                    <div className="header-dropdown opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-background border border-border/20 rounded-xl shadow-lg p-4 w-64">
                      <button
                        onClick={() => handleExpertClick()}
                        className="flex items-center gap-2 p-2 w-full text-left hover:bg-accent rounded-lg transition-colors mb-2"
                      >
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">All Experts</span>
                      </button>
                      
                      <div className="border-t pt-2">
                        <p className="text-xs text-muted-foreground mb-2">By Specialty:</p>
                        {expertSpecialties.map((specialty) => (
                          <button
                            key={specialty}
                            onClick={() => handleExpertClick(specialty)}
                            className="block w-full text-left p-2 text-sm hover:bg-accent rounded transition-colors"
                          >
                            {specialty}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // Non-authenticated navigation
                <>
                  <a href="/browse" className={`font-medium transition-colors ${
                    isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80'
                  }`}>
                    Browse
                  </a>
                  <a href="#categories" className={`font-medium transition-colors ${
                    isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80'
                  }`}>
                    Categories
                  </a>
                  <a href="#experts" className={`font-medium transition-colors ${
                    isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80'
                  }`}>
                    Experts
                  </a>
                </>
              )}

              {/* Admin Link */}
              {user?.role === 'admin' && (
                <a href="/admin" className={`font-medium transition-colors ${
                  isScrolled ? 'text-purple-600 hover:text-purple-700' : 'text-purple-300 hover:text-purple-200'
                }`}>
                  Admin
                </a>
              )}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
              ) : isAuthenticated && user ? (
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
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
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
              ) : (
                <div className="flex items-center space-x-3">
                  <Button variant="outline" className="hidden sm:flex rounded-full" onClick={() => navigate('/login')}>
                    Sign In
                  </Button>
                  <Button className="rounded-full" onClick={() => navigate('/login')}>
                    <Sparkles className="w-3 h-3 mr-2" />
                    Get Started
                  </Button>
                </div>
              )}

              <Button variant="ghost" size="icon" className="lg:hidden rounded-full">
                <Menu className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Header Spacer - This pushes content below the fixed header */}
      <div className="h-20"></div>
    </>
  );
};

export default Header;