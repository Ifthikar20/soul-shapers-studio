import { Heart, Mail, Phone, MapPin } from "lucide-react";
import wellnessIcon from "@/assets/wellness-icon.jpg";

const Footer = () => {
  return (
    <footer className="bg-secondary/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src={wellnessIcon} 
                alt="MindWell" 
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div>
                <h3 className="text-lg font-bold text-foreground">MindWell</h3>
                <p className="text-xs text-muted-foreground">Mental Wellness Platform</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              Transforming lives through expert-led mental health and wellness content. 
              Your journey to better mental health starts here.
            </p>
            <div className="flex items-center text-muted-foreground text-sm">
              <Heart className="w-4 h-4 mr-2 text-red-500" />
              <span>Made with care for your wellness</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Explore</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li><a href="#" className="hover:text-primary transition-smooth">Browse Videos</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Mental Health</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Mindfulness</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Breaking Habits</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Personal Growth</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li><a href="#" className="hover:text-primary transition-smooth">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Crisis Resources</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Community Guidelines</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Get in Touch</h4>
            <div className="space-y-3 text-muted-foreground text-sm">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3" />
                <span>support@mindwell.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-3" />
                <span>1-800-MINDWELL</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-3" />
                <span>Available Worldwide</span>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-xs text-muted-foreground mb-2">Emergency Support:</p>
              <p className="text-xs text-red-500 font-medium">
                Crisis Text Line: Text HOME to 741741
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 MindWell. All rights reserved. • Your mental health matters.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;