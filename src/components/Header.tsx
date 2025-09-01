// src/components/Header.tsx - Updated Navigation Structure
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
  Users,
  Brain,
  Heart,
  Leaf,
  Target,
  Star,
  Zap,
  MessageCircle,
  PenTool
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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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

// Categories data structure
const categories = [
  {
    id: 'mental-health',
    name: 'Mental Health',
    icon: Brain,
    subcategories: [
      'Anxiety & Stress',
      'Depression Support',
      'Panic Disorders',
      'Trauma Recovery',
      'Cognitive Behavioral Therapy'
    ]
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness & Meditation',
    icon: Leaf,
    subcategories: [
      'Guided Meditation',
      'Breathing Techniques',
      'Body Scan',
      'Walking Meditation',
      'Loving Kindness'
    ]
  },
  {
    id: 'emotional-wellness',
    name: 'Emotional Wellness',
    icon: Heart,
    subcategories: [
      'Emotional Intelligence',
      'Mood Management',
      'Self-Compassion',
      'Emotional Regulation',
      'Inner Child Work'
    ]
  },
  {
    id: 'relationships',
    name: 'Relationships',
    icon: Users,
    subcategories: [
      'Communication Skills',
      'Boundary Setting',
      'Conflict Resolution',
      'Dating & Romance',
      'Family Dynamics'
    ]
  },
  {
    id: 'personal-growth',
    name: 'Personal Growth',
    icon: Star,
    subcategories: [
      'Goal Setting',
      'Habit Formation',
      'Self-Discovery',
      'Confidence Building',
      'Life Transitions'
    ]
  },
  {
    id: 'breaking-habits',
    name: 'Breaking Habits',
    icon: Target,
    subcategories: [
      'Addiction Recovery',
      'Smoking Cessation',
      'Digital Detox',
      'Negative Patterns',
      'Compulsive Behaviors'
    ]
  }
];

// Expert specialties data
const expertSpecialties = [
  {
    name: 'Clinical Psychologists',
    description: 'Licensed mental health professionals'
  },
  {
    name: 'Mindfulness Instructors',
    description: 'Certified meditation teachers'
  },
  {
    name: 'Relationship Therapists',
    description: 'Marriage and family specialists'
  },
  {
    name: 'Addiction Counselors',
    description: 'Substance abuse experts'
  },
  {
    name: 'Trauma Specialists',
    description: 'PTSD and trauma recovery experts'
  },
  {
    name: 'Life Coaches',
    description: 'Personal development guides'
  }
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

  const handleCategoryClick = (categorySlug: string, subcategory?: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set('category', categorySlug);
    if (subcategory) {
      searchParams.set('subcategory', subcategory);
    }
    navigate(`/browse?${searchParams.toString()}`);
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
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate(isAuthenticated ? '/browse' : '/')}
          >
            <div className="hidden sm:block">
              <h1 className={`text-lg font-semibold transition-all duration-300 ${isScrolled
                  ? 'text-foreground'
                  : 'bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent'
                }`}>
                Better & Bliss
              </h1>
            </div>
          </div>

          {/* Enhanced Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full group">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-all duration-300 group-focus-within:text-primary ${isScrolled ? 'text-muted-foreground' : 'text-white/70'
                }`} />
              <Input
                placeholder="Search wellness topics, experts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-11 pr-4 h-11 rounded-2xl transition-all duration-300 text-sm ${isScrolled
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

          {/* Navigation - Updated for logged-in users */}
          <nav className="hidden lg:flex items-center space-x-6">
            {isAuthenticated ? (
              // Authenticated user navigation
              <>
                {/* Blog */}
                <a
                  href="/blog"
                  className={`font-medium flex items-center gap-2 transition-all duration-300 ${isScrolled
                      ? 'text-foreground hover:text-primary'
                      : 'text-white hover:text-white/80'
                    }`}
                >
                  <PenTool className="w-4 h-4" />
                  Blog
                </a>

                {/* Community */}
                <a
                  href="/community"
                  className={`font-medium flex items-center gap-2 transition-all duration-300 ${isScrolled
                      ? 'text-foreground hover:text-primary'
                      : 'text-white hover:text-white/80'
                    }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  Community
                </a>

                {/* Categories Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className={`font-medium flex items-center gap-1 transition-all duration-300 focus:outline-none ${isScrolled
                        ? 'text-foreground hover:text-primary'
                        : 'text-white hover:text-white/80'
                      }`}>
                      Categories
                      <ChevronDown className="w-3 h-3 transition-transform duration-200" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                   className="w-64 absolute"
                    align="start"
                    sideOffset={8}
                    avoidCollisions={false}
                  >
                    <DropdownMenuLabel>Browse by Category</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {categories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <DropdownMenuSub key={category.id}>
                          <DropdownMenuSubTrigger className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4 text-primary" />
                            {category.name}
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent
                            className="w-56"
                            sideOffset={8}
                            avoidCollisions={false}
                          >
                            <DropdownMenuLabel className="text-xs text-muted-foreground">
                              {category.name} Topics
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleCategoryClick(category.id)}
                              className="font-medium"
                            >
                              View All {category.name}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {category.subcategories.map((subcategory) => (
                              <DropdownMenuItem
                                key={subcategory}
                                onClick={() => handleCategoryClick(category.id, subcategory)}
                                className="text-sm"
                              >
                                {subcategory}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Experts Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="min-w-[110px] flex items-center justify-between font-medium text-sm transition-colors"
                    >
                      Categories
                      <ChevronDown className="w-3 h-3" />
                    </button>

                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-64 absolute"
                    align="center"
                    sideOffset={8}
                    avoidCollisions={false}
                  >
                    <DropdownMenuLabel>Find Expert Help</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/experts')}>
                      <Users className="w-4 h-4 mr-2 text-primary" />
                      All Experts
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                      By Specialty
                    </DropdownMenuLabel>
                    {expertSpecialties.map((specialty) => (
                      <DropdownMenuItem
                        key={specialty.name}
                        onClick={() => navigate(`/experts?specialty=${encodeURIComponent(specialty.name)}`)}
                      >
                        <div>
                          <div className="font-medium text-sm">{specialty.name}</div>
                          <div className="text-xs text-muted-foreground">{specialty.description}</div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              // Non-authenticated navigation (original)
              <>
                <a
                  href="/browse"
                  className={`font-medium flex items-center gap-2 transition-all duration-300 ${isScrolled
                      ? 'text-foreground hover:text-primary'
                      : 'text-white hover:text-white/80'
                    }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Browse
                </a>
                <a
                  href="#categories"
                  className={`font-medium transition-all duration-300 ${isScrolled
                      ? 'text-foreground hover:text-primary'
                      : 'text-white hover:text-white/80'
                    }`}
                >
                  Categories
                </a>
                <div className="relative group">
                  <a
                    href="#experts"
                    className={`font-medium flex items-center gap-1 transition-all duration-300 ${isScrolled
                        ? 'text-foreground hover:text-primary'
                        : 'text-white hover:text-white/80'
                      }`}
                  >
                    Experts
                    <ChevronDown className="w-3 h-3" />
                  </a>
                </div>
              </>
            )}

            {/* Admin Link (if admin) */}
            {user?.role === 'admin' && (
              <a
                href="/admin"
                className={`font-medium flex items-center gap-2 transition-all duration-300 ${isScrolled
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
              className={`md:hidden rounded-full transition-all duration-300 ${isScrolled
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
              className={`lg:hidden rounded-full transition-all duration-300 ${isScrolled
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