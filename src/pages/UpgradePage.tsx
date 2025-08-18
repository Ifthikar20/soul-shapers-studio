// src/pages/UpgradePage.tsx
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Zap, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUpgradeContextFromUrl, trackUpgradeEvent } from '@/utils/upgradeTracking';
import { UpgradeContext } from '@/types/video.types';  // ADD this import

const UpgradePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { upgradeId } = useParams();
  
  // Get context from URL parameters
  const context = getUpgradeContextFromUrl();
  const message = location.state?.message;

  // Track upgrade page view
  useEffect(() => {
    if (upgradeId) {
      trackUpgradeEvent('Upgrade Page Viewed', context);
      
      if (context.source === 'video_locked') {
        trackUpgradeEvent('Video Lock Triggered Upgrade', context);
      }
    }
  }, [upgradeId]);

  // Generate personalized message
  const getPersonalizedMessage = () => {
    if (context.source === 'video_locked' && context.videoTitle) {
      return `Unlock "${context.videoTitle}" and access the complete series!`;
    }
    if (context.source === 'upgrade_button') {
      return `Upgrade to access premium content and exclusive features!`;
    }
    return message || 'Choose the plan that works best for you';
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      features: [
        "Access to free content",
        "Basic wellness articles",
        "Community support"
      ],
      current: user?.subscription_tier === 'free'
    },
    {
      name: "Basic",
      price: "$4.99",
      period: "/month",
      features: [
        "Everything in Free",
        "Access to basic videos",
        "Monthly webinars",
        "Email support"
      ],
      current: user?.subscription_tier === 'basic',
      recommended: false
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "/month",
      features: context.source === 'video_locked' ? [
        `✅ Unlock "${context.videoTitle || 'this video'}"`,
        `✅ Access full ${context.seriesId ? 'series' : 'content library'}`,
        "✅ 1-on-1 expert sessions",
        "✅ Download for offline viewing",
        "✅ Priority support"
      ] : [
        "Everything in Basic",
        "Unlimited premium content", 
        "1-on-1 expert sessions",
        "Download for offline",
        "Priority support"
      ],
      current: user?.subscription_tier === 'premium',
      recommended: true
    }
  ];

  const handleSelectPlan = (planName: string) => {
    // Track upgrade button click
    if (upgradeId) {
      trackUpgradeEvent('Upgrade Button Clicked', {
        ...context,
        plan: planName,
      }); // Removed the type casting
    }
  
    if (planName === 'Free') {
      // Downgrade logic
      console.log('Downgrading to free');
    } else {
      // Upgrade logic - integrate with Stripe
      const checkoutUrl = `/checkout?plan=${planName.toLowerCase()}${upgradeId ? `&upgrade_id=${upgradeId}` : ''}`;
      window.location.href = checkoutUrl;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-secondary py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Choose Your Wellness Journey
          </h1>
          
          <p className="text-lg text-muted-foreground mb-4">
            {getPersonalizedMessage()}
          </p>

          {/* Show source context if available */}
          {context.source && (
            <div className="text-sm text-muted-foreground mb-4">
              {context.source === 'video_locked' && context.videoTitle && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 max-w-md mx-auto">
                  <p className="text-orange-700">
                    🔒 You tried to watch: <strong>"{context.videoTitle}"</strong>
                    {context.episode && <span> (Episode {context.episode})</span>}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={`relative ${plan.recommended ? 'ring-2 ring-primary shadow-glow' : ''}`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                    Recommended
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-8 pt-8">
                <div className="mb-4">
                  {plan.name === 'Premium' && <Crown className="w-12 h-12 mx-auto text-yellow-500" />}
                  {plan.name === 'Basic' && <Zap className="w-12 h-12 mx-auto text-blue-500" />}
                  {plan.name === 'Free' && <Star className="w-12 h-12 mx-auto text-gray-500" />}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  className="w-full"
                  variant={plan.current ? "outline" : plan.recommended ? "default" : "outline"}
                  disabled={plan.current}
                  onClick={() => handleSelectPlan(plan.name)}
                >
                  {plan.current ? 'Current Plan' : `Select ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;