// src/components/Header.tsx - Well-Structured Solution
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
      {/* Structured Header Styles */}
      <style>{`
        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        .header-grid {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 2rem;
          height: 80px;
        }
        
        .search-section {
          max-width: 500px;
          margin: 0 auto;
        }
        
        .nav-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        
        .dropdown-container {
          position: relative;
        }
        
        .dropdown-content {
          position: absolute;
          top: calc(100% + 0.5rem);
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease-in-out;
        }
        
        .dropdown-container:hover .dropdown-content {
          opacity: 1;
          visibility: visible;
        }
        
        @media (max-width: 1024px) {
          .header-grid {
            grid-template-columns: auto auto;
            gap: 1rem;
          }
          
          .search-section {
            display: none;
          }
          
          .nav-section {
            display: none;
          }
        }
        
        @media (max-width: 768px) {
          .header-container {
            padding: 0 0.75rem;
          }
          
          .header-grid {
            height: 70px;
          }
        }
      `}</style>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-md border-b border-border/20 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="header-container">
          <div className="header-grid">
            
            {/* Section 1: Logo */}
            <div className="logo-section">
              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => navigate(isAuthenticated ? '/browse' : '/')}
              >
                <h1 className={`text-xl font-bold transition-all duration-300 ${
                  isScrolled
                    ? 'text-foreground'
                    : 'bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent'
                }`}>
                  Better & Bliss
                </h1>
              </div>
            </div>

            {/* Section 2: Search (Desktop) */}
            <div className="search-section">
              <form onSubmit={handleSearchSubmit} className="relative group">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                  isScrolled ? 'text-muted-foreground' : 'text-white/70'
                }`} />
                <Input
                  placeholder="Search wellness topics, experts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-12 pr-4 h-11 rounded-full transition-all duration-300 ${
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

            {/* Section 3: Navigation & User Actions */}
            <div className="actions-section flex items-center gap-4">
              
              {/* Primary Navigation */}
              <nav className="nav-section">
                {isAuthenticated ? (
                  <>
                    {/* Core Links */}
                    <a href="/blog" className={`font-medium transition-colors hover:scale-105 ${
                      isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80'
                    }`}>
                      Blog
                    </a>
                    
                    <a href="/community" className={`font-medium transition-colors hover:scale-105 ${
                      isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80'
                    }`}>
                      Community
                    </a>

                    {/* Categories Dropdown */}
                    <div className="dropdown-container">
                      <button className={`font-medium flex items-center gap-1 transition-all hover:scale-105 ${
                        isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80'
                      }`}>
                        Categories
                        <ChevronDown className="w-3 h-3 transition-transform" />
                      </button>
                      
                      <div className="dropdown-content bg-background border border-border/20 rounded-xl shadow-lg p-4 w-80">
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
                    <div className="dropdown-container">
                      <button className={`font-medium flex items-center gap-1 transition-all hover:scale-105 ${
                        isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80'
                      }`}>
                        Experts
                        <ChevronDown className="w-3 h-3 transition-transform" />
                      </button>
                      
                      <div className="dropdown-content bg-background border border-border/20 rounded-xl shadow-lg p-4 w-64">
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
                  // Guest Navigation
                  <>
                    <a href="/browse" className={`font-medium transition-all hover:scale-105 ${
                      isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80'
                    }`}>
                      Browse
                    </a>
                    <a href="#categories" className={`font-medium transition-all hover:scale-105 ${
                      isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80'
                    }`}>
                      Categories
                    </a>
                    <a href="#experts" className={`font-medium transition-all hover:scale-105 ${
                      isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80'
                    }`}>
                      Experts
                    </a>
                  </>
                )}

                {/* Admin Link */}
                {user?.role === 'admin' && (
                  <a href="/admin" className={`font-medium transition-all hover:scale-105 ${
                    isScrolled ? 'text-purple-600 hover:text-purple-700' : 'text-purple-300 hover:text-purple-200'
                  }`}>
                    Admin
                  </a>
                )}
              </nav>

              {/* User Actions */}
              <div className="flex items-center gap-3">
                {loading ? (
                  <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />
                ) : isAuthenticated && user ? (
                  <>
                    {/* Upgrade Button */}
                    {user.subscription_tier === 'free' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="hidden sm:flex rounded-full border-yellow-300 text-yellow-600 hover:bg-yellow-50"
                        onClick={() => navigate('/upgrade')}
                      >
                        <Crown className="w-3 h-3 mr-2" />
                        Upgrade
                      </Button>
                    )}

                    {/* User Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:scale-105 transition-transform">
                          <Avatar className="h-9 w-9">
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
                  </>
                ) : (
                  /* Guest Actions */
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      className="hidden sm:flex rounded-full" 
                      onClick={() => navigate('/login')}
                    >
                      Sign In
                    </Button>
                    <Button 
                      className="rounded-full hover:scale-105 transition-transform" 
                      onClick={() => navigate('/login')}
                    >
                      <Sparkles className="w-3 h-3 mr-2" />
                      Get Started
                    </Button>
                  </div>
                )}

                {/* Mobile Menu */}
                <Button variant="ghost" size="icon" className="lg:hidden rounded-full hover:scale-105 transition-transform">
                  <Menu className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Header Spacer */}
      <div className="h-20"></div>
    </>
  );
};

export default Header;