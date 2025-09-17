import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mail, Send } from 'lucide-react';
import { NewsletterModal } from './NewsletterModal';

interface NewsletterOptInProps {
  source?: string;
}

export const NewsletterOptIn = ({ source = 'homepage' }: NewsletterOptInProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-4 p-6 bg-gradient-card rounded-2xl border border-border/50">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="newsletter"
            checked={isChecked}
            onCheckedChange={(checked) => {
              setIsChecked(!!checked);
              if (checked) setIsModalOpen(true);
            }}
          />
          <div className="space-y-1">
            <Label htmlFor="newsletter" className="text-sm font-medium">
              Get weekly mental wellness tips delivered to your inbox
            </Label>
            <p className="text-xs text-muted-foreground">
              Free. No spam. Join 10k+ subscribers.
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="w-full justify-start"
        >
          <Send className="w-4 h-4 mr-2" />
          Sign Up Now
        </Button>
      </div>

      <NewsletterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        source={source}
      />
    </>
  );
};