import { BarChart3, Users, TrendingUp, Star, CheckCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const caseStudies = [
  {
    id: 1,
    title: "Reducing Corporate Burnout by 85%",
    company: "TechCorp Inc.",
    industry: "Technology",
    participants: 2500,
    duration: "6 months",
    improvement: "85%",
    metric: "Burnout Reduction",
    description: "How TechCorp implemented our mindfulness program to dramatically reduce employee burnout and increase productivity.",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop",
    featured: true
  },
  {
    id: 2,
    title: "Student Anxiety Management Program",
    company: "University of Excellence",
    industry: "Education",
    participants: 5000,
    duration: "12 months",
    improvement: "72%",
    metric: "Anxiety Reduction",
    description: "A comprehensive study on how our anxiety management content helped university students cope with academic stress.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=250&fit=crop",
    featured: false
  },
  {
    id: 3,
    title: "Healthcare Worker Resilience Training",
    company: "Metropolitan Hospital",
    industry: "Healthcare",
    participants: 800,
    duration: "8 months",
    improvement: "90%",
    metric: "Stress Management",
    description: "Supporting frontline healthcare workers through evidence-based wellness programs during challenging times.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
    featured: true
  }
];

const CaseStudies = () => {
  return (
    <section className="py-24 bg-gradient-secondary relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <Badge className="mb-6 px-6 py-2 bg-gradient-card border border-primary/20 text-primary font-medium rounded-full shadow-soft">
            <BarChart3 className="w-4 h-4 mr-2" />
            Real Results
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Success
            <span className="bg-gradient-primary bg-clip-text text-transparent block">
              Case Studies
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how organizations worldwide have transformed their mental wellness programs with Better & Bliss
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {caseStudies.map((study, index) => (
            <Card 
              key={study.id} 
              className={`cursor-pointer group hover:scale-[1.02] transition-smooth ${
                study.featured ? 'lg:col-span-2' : ''
              } ${index === 0 ? 'lg:row-span-2' : ''}`}
            >
              <div className="relative">
                <img
                  src={study.image}
                  alt={study.title}
                  className={`w-full object-cover group-hover:scale-105 transition-smooth ${
                    study.featured ? 'h-64' : 'h-48'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {study.featured && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-primary text-white border-0 rounded-full px-3 py-1 text-xs font-medium">
                      <Star className="w-3 h-3 mr-1" />
                      Featured Study
                    </Badge>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4">
                  <Badge variant="secondary" className="mb-2 rounded-full text-xs px-3 py-1">
                    {study.industry}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-smooth line-clamp-2">
                  {study.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground font-medium">{study.company}</p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed line-clamp-3">
                  {study.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gradient-card rounded-2xl border border-border/20">
                    <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                      {study.improvement}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">
                      {study.metric}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gradient-card rounded-2xl border border-border/20">
                    <div className="text-2xl font-bold text-foreground flex items-center justify-center">
                      <Users className="w-5 h-5 mr-1" />
                      {study.participants.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">
                      Participants
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                    <span>{study.duration} study</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 rounded-full group-hover:translate-x-1 transition-smooth">
                    Read Study
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            variant="futuristic" 
            size="lg"
            className="rounded-full px-8 py-3 text-base"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            View All Case Studies
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;