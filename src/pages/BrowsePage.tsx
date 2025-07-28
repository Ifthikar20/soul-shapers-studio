import { useState } from "react";
import { 
  ArrowLeft, 
  Brain, 
  Heart, 
  Leaf, 
  Target, 
  Users, 
  Star, 
  Play, 
  Clock, 
  User,
  ChevronRight,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Filter,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import betterBlissLogo from "@/assets/betterandblisslogo.png";

// Questionnaire data
const questionnaire = [
  {
    id: 1,
    question: "What's your primary wellness goal?",
    options: [
      { value: "stress", label: "Reduce stress and anxiety", category: "Mental Health" },
      { value: "mindfulness", label: "Improve mindfulness and presence", category: "Mindfulness" },
      { value: "relationships", label: "Build better relationships", category: "Relationships" },
      { value: "habits", label: "Break bad habits", category: "Personal Growth" },
      { value: "confidence", label: "Boost self-confidence", category: "Personal Growth" }
    ]
  },
  {
    id: 2,
    question: "How much time can you dedicate daily?",
    options: [
      { value: "5min", label: "5-10 minutes", duration: "short" },
      { value: "15min", label: "15-20 minutes", duration: "medium" },
      { value: "30min", label: "30+ minutes", duration: "long" },
      { value: "flexible", label: "Flexible schedule", duration: "any" }
    ]
  },
  {
    id: 3,
    question: "What's your experience level?",
    options: [
      { value: "beginner", label: "Complete beginner", level: "beginner" },
      { value: "some", label: "Some experience", level: "intermediate" },
      { value: "experienced", label: "Quite experienced", level: "advanced" },
      { value: "expert", label: "Very experienced", level: "expert" }
    ]
  },
  {
    id: 4,
    question: "What type of content do you prefer?",
    options: [
      { value: "guided", label: "Guided exercises and practices", type: "practical" },
      { value: "educational", label: "Educational and informational", type: "educational" },
      { value: "interactive", label: "Interactive workshops", type: "interactive" },
      { value: "stories", label: "Real stories and case studies", type: "stories" }
    ]
  }
];

// Categories with detailed topics
const categories = [
  {
    id: 1,
    title: "Mental Health",
    description: "Expert guidance for anxiety, depression, and emotional wellness",
    icon: Brain,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    hoverColor: "hover:bg-purple-500/20",
    borderColor: "border-purple-200",
    videoCount: 150,
    topics: [
      "Anxiety Management", "Depression Support", "Stress Relief", "Panic Attacks",
      "Cognitive Behavioral Therapy", "Emotional Regulation", "Trauma Recovery",
      "Sleep Disorders", "PTSD Support", "Bipolar Management"
    ],
    experts: ["Dr. Sarah Johnson", "Dr. Michael Chen", "Dr. Emma Wilson"],
    featured: true
  },
  {
    id: 2,
    title: "Mindfulness & Meditation",
    description: "Cultivate presence and inner peace through guided practices",
    icon: Leaf,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    hoverColor: "hover:bg-green-500/20",
    borderColor: "border-green-200",
    videoCount: 120,
    topics: [
      "Breathing Exercises", "Body Scan Meditation", "Walking Meditation",
      "Loving-Kindness Practice", "Mindful Eating", "Present Moment Awareness",
      "Zen Meditation", "Transcendental Meditation", "Chakra Meditation"
    ],
    experts: ["James Park", "Maria Santos", "David Kim"],
    featured: true
  },
  {
    id: 3,
    title: "Emotional Wellness",
    description: "Build emotional intelligence and healthy relationships",
    icon: Heart,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    hoverColor: "hover:bg-pink-500/20",
    borderColor: "border-pink-200",
    videoCount: 95,
    topics: [
      "Emotional Intelligence", "Relationship Communication", "Boundary Setting",
      "Conflict Resolution", "Self-Compassion", "Empathy Building",
      "Love Languages", "Attachment Styles", "Forgiveness Practices"
    ],
    experts: ["Dr. Emily Rodriguez", "Lisa Thompson", "Robert Chen"],
    featured: false
  },
  {
    id: 4,
    title: "Breaking Habits",
    description: "Transform limiting patterns and build positive routines",
    icon: Target,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    hoverColor: "hover:bg-orange-500/20",
    borderColor: "border-orange-200",
    videoCount: 80,
    topics: [
      "Addiction Recovery", "Habit Formation", "Smoking Cessation",
      "Digital Detox", "Procrastination", "Negative Thinking Patterns",
      "Compulsive Behaviors", "Emotional Eating", "Self-Sabotage"
    ],
    experts: ["Dr. Mark Williams", "Sarah Davis", "Alex Thompson"],
    featured: false
  },
  {
    id: 5,
    title: "Social Wellness",
    description: "Improve communication and build meaningful connections",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    hoverColor: "hover:bg-blue-500/20",
    borderColor: "border-blue-200",
    videoCount: 75,
    topics: [
      "Social Anxiety", "Public Speaking", "Networking Skills",
      "Active Listening", "Leadership Development", "Team Communication",
      "Cultural Sensitivity", "Community Building", "Social Confidence"
    ],
    experts: ["Jessica Wong", "Michael Torres", "Nina Patel"],
    featured: false
  },
  {
    id: 6,
    title: "Personal Growth",
    description: "Unlock your potential and achieve your goals",
    icon: Star,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    hoverColor: "hover:bg-yellow-500/20",
    borderColor: "border-yellow-200",
    videoCount: 110,
    topics: [
      "Goal Setting", "Self-Confidence", "Life Purpose", "Career Development",
      "Time Management", "Productivity", "Creativity Enhancement",
      "Decision Making", "Risk Taking", "Personal Branding"
    ],
    experts: ["Tony Martinez", "Rachel Kim", "Carlos Rodriguez"],
    featured: true
  }
];

// Sample videos for recommendations
const sampleVideos = [
  {
    id: 1,
    title: "5-Minute Morning Anxiety Relief",
    expert: "Dr. Sarah Johnson",
    duration: "5:23",
    category: "Mental Health",
    rating: 4.9,
    views: "12.5k",
    thumbnail: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=250&fit=crop",
    isNew: true,
    description: "Quick breathing exercises to start your day with calm"
  },
  {
    id: 2,
    title: "Building Unshakeable Confidence",
    expert: "Tony Martinez",
    duration: "18:30",
    category: "Personal Growth",
    rating: 4.8,
    views: "8.3k",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    isNew: false,
    description: "Transform self-doubt into unwavering self-belief"
  },
  {
    id: 3,
    title: "Mindful Communication in Relationships",
    expert: "Dr. Emily Rodriguez",
    duration: "22:15",
    category: "Relationships",
    rating: 4.9,
    views: "15.2k",
    thumbnail: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=250&fit=crop",
    isNew: true,
    description: "Deepen connections through conscious communication"
  }
];

const BrowsePage = () => {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleBack = () => {
    window.history.back();
  };

  const handleQuestionnaireStart = () => {
    setShowQuestionnaire(true);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleAnswer = (questionId, answer) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    
    if (currentQuestion < questionnaire.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const getRecommendations = () => {
    // Simple recommendation logic based on answers
    const primaryGoal = answers[1];
    const timeAvailable = answers[2];
    const experience = answers[3];
    
    let recommendations = sampleVideos;
    
    if (primaryGoal?.category) {
      recommendations = recommendations.filter(video => 
        video.category === primaryGoal.category
      );
    }
    
    return recommendations;
  };

  const resetQuestionnaire = () => {
    setShowQuestionnaire(false);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  if (showQuestionnaire && !showResults) {
    const question = questionnaire[currentQuestion];
    const progress = ((currentQuestion + 1) / questionnaire.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-secondary relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[400px] bg-gradient-to-br from-primary/6 to-purple-400/4 rounded-[40%_60%_70%_30%] blur-3xl animate-pulse rotate-12"></div>
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[350px] bg-gradient-to-tl from-purple-500/6 to-primary/4 rounded-[60%_40%_30%_70%] blur-3xl animate-pulse delay-1000 -rotate-12"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl shadow-glow">
            <CardContent className="p-8">
              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">
                    Question {currentQuestion + 1} of {questionnaire.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetQuestionnaire}
                    className="text-muted-foreground"
                  >
                    Exit
                  </Button>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Question */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  {question.question}
                </h2>
                <p className="text-muted-foreground">
                  Choose the option that best describes you
                </p>
              </div>

              {/* Options */}
              <div className="space-y-4">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full p-6 text-left justify-start h-auto hover:bg-primary/5 hover:border-primary/40 transition-all duration-300"
                    onClick={() => handleAnswer(question.id, option)}
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full border-2 border-border mr-4 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-transparent group-hover:bg-primary transition-colors"></div>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{option.label}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showResults) {
    const recommendations = getRecommendations();
    
    return (
      <div className="min-h-screen bg-gradient-secondary relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[400px] bg-gradient-to-br from-primary/6 to-purple-400/4 rounded-[40%_60%_70%_30%] blur-3xl animate-pulse rotate-12"></div>
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[350px] bg-gradient-to-tl from-purple-500/6 to-primary/4 rounded-[60%_40%_30%_70%] blur-3xl animate-pulse delay-1000 -rotate-12"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetQuestionnaire}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Browse
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleQuestionnaireStart}
              className="rounded-full"
            >
              Retake Quiz
            </Button>
          </div>

          {/* Results */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Your Personalized Recommendations
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Based on your responses, we've curated content that matches your goals and preferences
            </p>
          </div>

          {/* Recommended Videos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {recommendations.map((video) => (
              <Card key={video.id} className="group hover:shadow-hover transition-smooth cursor-pointer overflow-hidden">
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-glow">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                  </div>
                  {video.isNew && (
                    <Badge className="absolute top-3 left-3 bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                      New
                    </Badge>
                  )}
                  <Badge className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    <Clock className="w-3 h-3 mr-1" />
                    {video.duration}
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  <Badge variant="secondary" className="text-xs rounded-full px-3 py-1 mb-3">
                    {video.category}
                  </Badge>
                  
                  <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-smooth line-clamp-2">
                    {video.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {video.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <User className="w-4 h-4 mr-2" />
                      <span>{video.expert}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                      <span>{video.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Continue Exploring */}
          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              onClick={resetQuestionnaire}
              className="rounded-full px-8"
            >
              Explore All Categories
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-secondary relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[400px] bg-gradient-to-br from-primary/6 to-purple-400/4 rounded-[40%_60%_70%_30%] blur-3xl animate-pulse rotate-12"></div>
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[350px] bg-gradient-to-tl from-purple-500/6 to-primary/4 rounded-[60%_40%_30%_70%] blur-3xl animate-pulse delay-1000 -rotate-12"></div>
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-gradient-to-r from-primary/3 to-transparent rounded-[50%_30%_70%_50%] blur-2xl animate-pulse delay-500 rotate-45"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-gradient-card/80 backdrop-blur-xl border-b border-border/20 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
                <div className="relative">
                  <img 
                    src={betterBlissLogo} 
                    alt="Better & Bliss" 
                    className="w-12 h-12 rounded-2xl object-cover shadow-soft"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline"
                  className="rounded-full"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button 
                  variant="outline"
                  className="rounded-full"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6">
              Find Your
              <span className="bg-gradient-primary bg-clip-text text-transparent block">
                Perfect Path
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
              Discover personalized wellness content tailored to your unique needs and goals
            </p>
            
            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Guided Path */}
              <Card className="group hover:shadow-glow transition-all duration-500 cursor-pointer border-2 border-primary/20 hover:border-primary/40">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Get Personalized Recommendations
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Take our quick 2-minute quiz to receive content curated specifically for your wellness journey
                  </p>
                  <Button 
                    variant="futuristic" 
                    size="lg"
                    onClick={handleQuestionnaireStart}
                    className="rounded-full w-full"
                  >
                    Start Quiz
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    <span>2 minutes • Personalized results</span>
                  </div>
                </CardContent>
              </Card>

              {/* Free Browse */}
              <Card className="group hover:shadow-hover transition-all duration-500 cursor-pointer border-border/20">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-card border-2 border-border/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Brain className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Browse by Category
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Explore our comprehensive library organized by wellness topics and expert specialties
                  </p>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="rounded-full w-full hover:bg-primary hover:text-white"
                    onClick={() => document.getElementById('categories').scrollIntoView({ behavior: 'smooth' })}
                  >
                    Browse Categories
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                  <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
                    <Heart className="w-4 h-4 mr-2 text-red-500" />
                    <span>6 categories • 630+ videos</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Categories Section */}
          <section id="categories" className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Wellness Categories
              </h2>
              <p className="text-xl text-muted-foreground">
                Explore expert-curated content across various wellness domains
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Card 
                    key={category.id} 
                    className={`group cursor-pointer transition-all duration-300 hover:shadow-hover border-2 ${category.borderColor} ${category.hoverColor}`}
                    onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${category.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className={`w-6 h-6 ${category.color}`} />
                        </div>
                        {category.featured && (
                          <Badge className="bg-gradient-primary text-white border-0 text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                        {category.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="secondary" className="text-xs">
                          {category.videoCount} videos
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-primary hover:bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          Explore
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>

                      {/* Expanded Content */}
                      {selectedCategory === category.id && (
                        <div className="border-t border-border/20 pt-4 mt-4 animate-in fade-in-50 duration-300">
                          <div className="mb-4">
                            <h4 className="font-semibold text-foreground mb-2">Popular Topics:</h4>
                            <div className="flex flex-wrap gap-2">
                              {category.topics.slice(0, 6).map((topic, index) => (
                                <Badge 
                                  key={index} 
                                  variant="outline" 
                                  className="text-xs hover:bg-primary hover:text-white cursor-pointer transition-colors"
                                >
                                  {topic}
                                </Badge>
                              ))}
                              {category.topics.length > 6 && (
                                <Badge variant="outline" className="text-xs">
                                  +{category.topics.length - 6} more
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">Featured Experts:</h4>
                            <div className="text-sm text-muted-foreground">
                              {category.experts.join(", ")}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center py-16">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Begin Your Wellness Journey?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of others who have transformed their lives through our expert-guided content
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="futuristic" 
                  size="lg"
                  onClick={handleQuestionnaireStart}
                  className="rounded-full px-8"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get Started with Quiz
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="rounded-full px-8 hover:bg-primary hover:text-white"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Sample Videos
                </Button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default BrowsePage;