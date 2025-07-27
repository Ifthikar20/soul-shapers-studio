import { Heart, Mail, Phone, MapPin, Sparkles, Brain } from "lucide-react";
import betterBlissLogo from "@/assets/betterandblisslogo.png";

const Footer = () => {
  return (
    <footer className="bg-gradient-card/50 border-t border-border/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
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
                <h3 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Better & Bliss
                </h3>
                <p className="text-xs text-muted-foreground font-medium">.com</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              Transforming lives through cutting-edge mental health and wellness content. 
              Your path to better mental health starts here.
            </p>
            <div className="flex items-center text-muted-foreground text-sm">
              <Heart className="w-4 h-4 mr-2 text-red-500" />
              <span>Made with care for your wellness</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-foreground mb-6 text-lg">Explore</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li><a href="#" className="hover:text-primary transition-smooth flex items-center group">
                <Brain className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-smooth" />
                Browse Videos
              </a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Mental Health</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Mindfulness</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Breaking Habits</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Personal Growth</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Case Studies</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-foreground mb-6 text-lg">Support</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li><a href="#" className="hover:text-primary transition-smooth">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Crisis Resources</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Community Guidelines</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Accessibility</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-foreground mb-6 text-lg">Get in Touch</h4>
            <div className="space-y-4 text-muted-foreground text-sm">
              <div className="flex items-center group">
                <div className="p-2 rounded-xl bg-gradient-card mr-3 group-hover:shadow-soft transition-smooth">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <span>support@betterandbliss.com</span>
              </div>
              <div className="flex items-center group">
                <div className="p-2 rounded-xl bg-gradient-card mr-3 group-hover:shadow-soft transition-smooth">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <span>1-800-BETTERBLISS</span>
              </div>
              <div className="flex items-center group">
                <div className="p-2 rounded-xl bg-gradient-card mr-3 group-hover:shadow-soft transition-smooth">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span>Available Worldwide</span>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-gradient-card rounded-2xl border border-border/20">
              <p className="text-xs text-muted-foreground mb-2 font-medium">Emergency Support:</p>
              <p className="text-xs text-red-500 font-bold">
                Crisis Text Line: Text HOME to 741741
              </p>
              <p className="text-xs text-red-500 font-bold">
                National Suicide Prevention: 988
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border/20 mt-12 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Better & Bliss. All rights reserved. • Your mental health matters. • 
            <span className="bg-gradient-primary bg-clip-text text-transparent font-medium">
              {" "}Transform. Heal. Thrive.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;