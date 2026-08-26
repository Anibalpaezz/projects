import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Cookie, Settings, X } from 'lucide-react';

interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalized: boolean;
}

interface ConsentBannerProps {
  onConsentChange: (preferences: ConsentPreferences) => void;
}

export function ConsentBanner({ onConsentChange }: ConsentBannerProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    personalized: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('gdpr-consent');
    if (!consent) {
      setShowBanner(true);
    } else {
      const savedPreferences = JSON.parse(consent);
      setPreferences(savedPreferences);
      onConsentChange(savedPreferences);
    }
  }, [onConsentChange]);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalized: true
    };
    setPreferences(allAccepted);
    localStorage.setItem('gdpr-consent', JSON.stringify(allAccepted));
    onConsentChange(allAccepted);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalized: false
    };
    setPreferences(onlyNecessary);
    localStorage.setItem('gdpr-consent', JSON.stringify(onlyNecessary));
    onConsentChange(onlyNecessary);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('gdpr-consent', JSON.stringify(preferences));
    onConsentChange(preferences);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const updatePreference = (key: keyof ConsentPreferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="mx-auto max-w-4xl shadow-strong border-border bg-background">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Cookie className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Privacy & Cookies</h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowBanner(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">
              We use cookies and similar technologies to enhance your browsing experience, 
              analyze site traffic, and show personalized content and ads.
            </p>
            <p className="text-xs text-muted-foreground">
              By clicking "Accept All", you consent to our use of cookies. 
              You can manage your preferences or learn more in our{' '}
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Preferences
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Cookie Preferences</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Necessary Cookies</Label>
                        <p className="text-xs text-muted-foreground">Required for the website to function</p>
                      </div>
                      <Switch checked={preferences.necessary} disabled />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Analytics</Label>
                        <p className="text-xs text-muted-foreground">Help us understand how you use our site</p>
                      </div>
                      <Switch 
                        checked={preferences.analytics}
                        onCheckedChange={(checked) => updatePreference('analytics', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Marketing</Label>
                        <p className="text-xs text-muted-foreground">Show relevant ads and content</p>
                      </div>
                      <Switch 
                        checked={preferences.marketing}
                        onCheckedChange={(checked) => updatePreference('marketing', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Personalized Ads</Label>
                        <p className="text-xs text-muted-foreground">Ads tailored to your interests</p>
                      </div>
                      <Switch 
                        checked={preferences.personalized}
                        onCheckedChange={(checked) => updatePreference('personalized', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button variant="outline" onClick={() => setShowPreferences(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSavePreferences}>
                      Save Preferences
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRejectAll} size="sm">
                Reject All
              </Button>
              <Button onClick={handleAcceptAll} size="sm">
                Accept All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}