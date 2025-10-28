const Footer = () => {
  return (
    <footer className="bg-gradient-card/50 border-t border-border/20">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">Explore</h4>
            <ul className="space-y-2 text-muted-foreground text-xs">
              <li><a href="#" className="hover:text-primary transition-colors">Browse Videos</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Mental Health</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Mindfulness</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Personal Growth</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">Support</h4>
            <ul className="space-y-2 text-muted-foreground text-xs">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Crisis Resources</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Emergency Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">Emergency Support</h4>
            <div className="space-y-2 text-xs">
              <p className="text-red-500">Crisis Text Line: 741741</p>
              <p className="text-red-500">Suicide Prevention: 988</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border/20 mt-4 pt-3 text-center">
          <p className="text-muted-foreground text-xs">
            © 2024 Better & Bliss. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;