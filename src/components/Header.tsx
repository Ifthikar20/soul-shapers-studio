import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, Menu, Sparkles, BookOpen, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  return (
    <header className="bg-gradient-card/80 backdrop-blur-xl border-b border-border/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={betterBlissLogo} 
                alt="Better & Bliss" 
                className="w-12 h-12 rounded-2xl object-cover shadow-soft"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-primary rounded-full flex items-center justify-center">
                <Sparkles className="w-2 h-2 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Better & Bliss
              </h1>
              <p className="text-xs text-muted-foreground font-medium">.com</p>
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
            <a href="#" className="text-foreground hover:text-primary transition-smooth font-medium flex items-center gap-2">
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
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="md:hidden rounded-full">
              <Search className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              className="hidden sm:flex rounded-full"
              onClick={() => onShowAuth?.('signin')}
            >
              Sign In
            </Button>
            <Button 
              variant="futuristic" 
              className="rounded-full"
              onClick={() => onShowAuth?.('signup')}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Get Started
            </Button>
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