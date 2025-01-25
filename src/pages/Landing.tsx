import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Menu, Star, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Landing = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth status
  useState(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setIsLoading(false);
    };
    checkAuth();
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff7ea] w-full to-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold">TaskMaster</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {!isLoading && (
                <>
                  {!isAuthenticated && (
                    <Button
                      variant="ghost"
                      onClick={() => navigate("/auth")}
                    >
                      Sign In
                    </Button>
                  )}
                  <Button
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 animate-fade-in">
              {!isLoading && (
                <div className="flex flex-col gap-2">
                  {!isAuthenticated && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        navigate("/auth");
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start"
                    >
                      Sign In
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      navigate("/dashboard");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start"
                  >
                    Dashboard
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-fade-in">
          Organize Your Life, Effortlessly
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in [animation-delay:200ms]">
          The all-in-one productivity app that helps you manage tasks, build habits, and stay organized with a beautiful, intuitive interface.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center animate-fade-in [animation-delay:400ms]">
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-primary hover:bg-primary/90 w-full md:w-auto"
          >
            Get Started Free
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              const featuresSection = document.getElementById("features");
              featuresSection?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full md:w-auto"
          >
            See Features
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Everything You Need to Stay Productive
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="p-6 hover:shadow-lg transition-shadow animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20 bg-gray-50">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Simple, Transparent Pricing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card
              key={plan.name}
              className={`p-6 animate-fade-in ${
                plan.popular
                  ? "border-2 border-primary relative shadow-lg"
                  : "border shadow"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-full text-sm">
                  Most Popular
                </span>
              )}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-end justify-center gap-1 mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${
                  plan.popular ? "bg-primary hover:bg-primary/90" : ""
                }`}
                variant={plan.popular ? "default" : "outline"}
                onClick={() => navigate("/auth")}
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {reviews.map((review, index) => (
            <Card
              key={review.name}
              className="p-6 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-4">{review.content}</p>
              <div>
                <div className="font-semibold">{review.name}</div>
                <div className="text-sm text-gray-500">{review.role}</div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of users who are already improving their productivity with our app.
        </p>
        <Button
          size="lg"
          onClick={() => navigate("/auth")}
          className="bg-primary hover:bg-primary/90"
        >
          Start Your Free Trial
        </Button>
      </section>
    </div>
  );
};

const features = [
  {
    title: "Task Management",
    description: "Organize your tasks with our intuitive interface. Set priorities, deadlines, and track progress effortlessly.",
    icon: "📋",
  },
  {
    title: "Smart Calendar",
    description: "Visualize your schedule with our dynamic calendar view. Never miss an important deadline again.",
    icon: "📅",
  },
  {
    title: "Habit Tracking",
    description: "Build and maintain positive habits with our comprehensive tracking system.",
    icon: "✨",
  },
  {
    title: "Notes & Reminders",
    description: "Keep all your important notes in one place and set reminders for critical tasks.",
    icon: "📝",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "Basic task management",
      "Calendar view",
      "Up to 3 projects",
      "Basic note-taking",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    features: [
      "Everything in Free",
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "Custom templates",
    ],
    cta: "Try Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$29",
    period: "per month",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Admin controls",
      "API access",
      "24/7 support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const reviews = [
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    content: "This app has completely transformed how I manage my daily tasks. The interface is intuitive and the features are exactly what I needed.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    content: "The habit tracking feature has helped me build better routines. It's simple yet powerful.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Freelancer",
    content: "I love how everything is organized. The calendar integration is seamless and the reminders keep me on track.",
    rating: 4,
  },
];

export default Landing;