import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  X, 
  Calendar, 
  Crown, 
  Zap, 
  Users, 
  Shield, 
  Download,
  Share,
  Bell,
  Repeat,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";

interface PricingTier {
  id: string;
  name: string;
  price: number;
  interval: string;
  description: string;
  features: Array<{
    name: string;
    included: boolean;
    premium?: boolean;
  }>;
  popular?: boolean;
  buttonText: string;
  buttonVariant: "default" | "outline";
}

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

  const pricingTiers: PricingTier[] = [
    {
      id: "free",
      name: t('pricing.free'),
      price: 0,
      interval: t('pricing.forever'),
      description: t('pricing.freeDescription'),
      features: [
        { name: t('pricing.features.unlimitedCalendars'), included: true },
        { name: t('pricing.features.basicEventCreation'), included: true },
        { name: t('pricing.features.monthWeekDayViews'), included: true },
        { name: t('pricing.features.colorCoding'), included: true },
        { name: t('pricing.features.timeZoneSupport'), included: true },
        { name: t('pricing.features.recurringEvents'), included: false, premium: true },
        { name: t('pricing.features.advancedReminders'), included: false, premium: true },
        { name: t('pricing.features.icsImportExport'), included: false, premium: true },
        { name: t('pricing.features.conflictDetection'), included: false, premium: true },
        { name: t('pricing.features.availabilityView'), included: false, premium: true },
        { name: t('pricing.features.prioritySupport'), included: false, premium: true },
      ],
      buttonText: user ? t('pricing.currentPlan') : t('pricing.getStarted'),
      buttonVariant: "outline"
    },
    {
      id: "pro",
      name: t('pricing.pro'),
      price: billingInterval === 'monthly' ? 9.99 : 99.99,
      interval: billingInterval === 'monthly' ? t('pricing.perMonth') : t('pricing.perYear'),
      description: t('pricing.proDescription'),
      popular: true,
      features: [
        { name: t('pricing.features.everythingInFree'), included: true },
        { name: t('pricing.features.recurringEvents'), included: true, premium: true },
        { name: t('pricing.features.advancedReminders'), included: true, premium: true },
        { name: t('pricing.features.icsImportExport'), included: true, premium: true },
        { name: t('pricing.features.conflictDetection'), included: true, premium: true },
        { name: t('pricing.features.availabilityView'), included: true, premium: true },
        { name: t('pricing.features.calendarSharing'), included: true, premium: true },
        { name: t('pricing.features.advancedSearch'), included: true, premium: true },
        { name: t('pricing.features.dataBackup'), included: true, premium: true },
        { name: t('pricing.features.prioritySupport'), included: true, premium: true },
        { name: t('pricing.features.customIntegrations'), included: true, premium: true },
      ],
      buttonText: t('pricing.upgradeToPro'),
      buttonVariant: "default"
    }
  ];

  const handleSubscribe = (tierId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (tierId === 'free') {
      // Already on free plan
      return;
    }

    // Redirect to checkout (stub for now)
    navigate('/checkout', { state: { plan: tierId, interval: billingInterval } });
  };

  const featureIcons: Record<string, any> = {
    calendar: Calendar,
    recurring: Repeat,
    reminders: Bell,
    import: Download,
    conflict: Shield,
    availability: Clock,
    sharing: Share,
    search: Zap,
    support: Users,
    backup: Shield,
    integrations: Users
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">MasterCalendar</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/calendar')}
            >
              {t('common.backToCalendar')}
            </Button>
            {!user && (
              <Button
                variant="outline"
                onClick={() => navigate('/auth')}
              >
                {t('auth.signIn')}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-5xl font-bold text-foreground mb-4">
            {t('pricing.chooseYourPlan')}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {t('pricing.selectPlanDescription')}
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-secondary/50 rounded-lg p-1 mb-8">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingInterval === 'monthly'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('pricing.monthly')}
            </button>
            <button
              onClick={() => setBillingInterval('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingInterval === 'yearly'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('pricing.yearly')}
              <Badge variant="secondary" className="ml-2 text-xs">
                {t('pricing.save20')}
              </Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {pricingTiers.map((tier) => (
            <Card 
              key={tier.id} 
              className={`
                border-border/40 shadow-soft hover:shadow-medium transition-all duration-300 relative
                ${tier.popular ? 'border-primary/50 shadow-strong scale-105' : ''}
              `}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-primary text-primary-foreground px-4 py-1">
                    <Crown className="h-3 w-3 mr-1" />
                    {t('pricing.mostPopular')}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">
                    ${tier.price}
                  </span>
                  <span className="text-muted-foreground text-base ml-1">
                    /{tier.interval}
                  </span>
                </div>
                <p className="text-muted-foreground mt-2">{tier.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <Button
                  onClick={() => handleSubscribe(tier.id)}
                  variant={tier.buttonVariant}
                  size="lg"
                  className={`w-full ${tier.popular ? 'bg-gradient-primary hover:opacity-90' : ''}`}
                  disabled={tier.id === 'free' && !!user}
                >
                  {tier.buttonText}
                </Button>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-foreground uppercase tracking-wide">
                    {t('pricing.features.title')}
                  </h4>
                  <ul className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3 text-sm">
                        {feature.included ? (
                          <Check className={`h-4 w-4 flex-shrink-0 ${
                            feature.premium ? 'text-primary' : 'text-green-500'
                          }`} />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={`${
                          feature.included 
                            ? feature.premium 
                              ? 'text-foreground font-medium' 
                              : 'text-foreground'
                            : 'text-muted-foreground'
                        }`}>
                          {feature.name}
                          {feature.premium && feature.included && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Pro
                            </Badge>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">{t('pricing.faq.title')}</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                {t('pricing.faq.canIChangePlans')}
              </h4>
              <p className="text-muted-foreground">
                {t('pricing.faq.canIChangePlansAnswer')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                {t('pricing.faq.whatHappensToData')}
              </h4>
              <p className="text-muted-foreground">
                {t('pricing.faq.whatHappensToDataAnswer')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                {t('pricing.faq.refundPolicy')}
              </h4>
              <p className="text-muted-foreground">
                {t('pricing.faq.refundPolicyAnswer')}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;