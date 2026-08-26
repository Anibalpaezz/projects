import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, Shield, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: "Smart Calendar Views",
      description: "Switch between month, week, and day views to manage your schedule effectively."
    },
    {
      icon: Clock,
      title: "Time Management",  
      description: "Track your time with precision using 12/24 hour formats and custom time zones."
    },
    {
      icon: Users,
      title: "Multi-Calendar Support",
      description: "Organize your personal, work, and family schedules in separate calendars."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your calendar data is encrypted and stored securely in the cloud."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">MasterCalendar</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate("/pricing")}
              className="shadow-soft hover:shadow-medium transition-all duration-300"
            >
              Pricing
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/auth")}
              className="shadow-soft hover:shadow-medium transition-all duration-300"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate("/auth")}
              className="bg-gradient-primary hover:opacity-90 shadow-medium"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            Master Your Schedule with
            <span className="text-transparent bg-gradient-primary bg-clip-text block mt-2">
              Intelligent Calendar Management
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Transform the way you organize your time. MasterCalendar provides powerful tools 
            to manage your events, appointments, and tasks with elegant simplicity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/calendar")}
              className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-3 shadow-strong group"
            >
              Continue without account
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-3 shadow-soft hover:shadow-medium transition-all duration-300"
            >
              Create Free Account
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/40 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Ready to take control of your time?
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of users who have transformed their productivity with MasterCalendar.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-3 shadow-strong"
          >
            Get Started Today
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8 text-center">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-lg font-semibold text-foreground">MasterCalendar</span>
            </div>
            <p className="text-muted-foreground mb-4">
              © 2024 MasterCalendar. Built with passion for productivity.
            </p>
            <div className="flex items-center space-x-4">
              <a href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                Privacy & Cookies
              </a>
              <a href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </a>
            </div>
        </div>
      </footer>
    </div>
  );
}