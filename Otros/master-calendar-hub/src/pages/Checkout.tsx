import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ArrowLeft, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";

const Checkout = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { plan, interval } = location.state || {};

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!plan) {
      navigate('/pricing');
      return;
    }
  }, [user, plan, navigate]);

  const getPlanDetails = () => {
    if (plan === 'pro') {
      return {
        name: 'Pro Plan',
        price: interval === 'yearly' ? 99.99 : 9.99,
        interval: interval === 'yearly' ? 'per year' : 'per month',
        savings: interval === 'yearly' ? 'Save $20' : null
      };
    }
    return null;
  };

  const planDetails = getPlanDetails();

  if (!user || !planDetails) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">MasterCalendar</h1>
          </div>
          
          <Button
            variant="ghost"
            onClick={() => navigate('/pricing')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pricing
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-md mx-auto">
          <Card className="shadow-strong border-border/40">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Checkout</CardTitle>
              <p className="text-muted-foreground">Complete your subscription</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Plan Summary */}
              <div className="p-4 bg-secondary/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{planDetails.name}</span>
                  <span className="font-bold text-lg">
                    ${planDetails.price}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{planDetails.interval}</span>
                  {planDetails.savings && (
                    <span className="text-green-600 font-medium">
                      {planDetails.savings}
                    </span>
                  )}
                </div>
              </div>

              {/* Coming Soon Message */}
              <div className="text-center p-6 bg-primary/5 rounded-lg border border-primary/20">
                <CreditCard className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Payment Integration Coming Soon</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We're working on integrating secure payment processing. 
                  In the meantime, enjoy all the free features!
                </p>
                <Button
                  onClick={() => navigate('/calendar')}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  Continue with Free Plan
                </Button>
              </div>

              {/* Features Reminder */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">What you'll get:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Unlimited calendars and events</li>
                  <li>• Advanced recurring events</li>
                  <li>• Smart conflict detection</li>
                  <li>• ICS import/export</li>
                  <li>• Priority support</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Checkout;