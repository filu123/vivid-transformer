import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Menu, Star, X } from "lucide-react";
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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Lovable
              </span>
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
                    className="bg-gradient-to-r from-primary to-purple-600 text-white"
                  >
                    Get Started
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
                    className="w-full justify-start bg-gradient-to-r from-primary to-purple-600 text-white"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-fade-in">
            The AI Code Editor
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in [animation-delay:200ms]">
            Build software faster with an AI that understands your codebase
          </p>
          <Button 
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-primary to-purple-600 text-white animate-fade-in [animation-delay:400ms]"
          >
            Try Lovable Now
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="p-6 bg-white/50 backdrop-blur border border-gray-100 hover:shadow-lg transition-all animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-12 w-12 mb-4 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Loved by world-class devs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.name}
                className="p-6 hover:shadow-lg transition-all animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600" />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.content}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-t from-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Building Today
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already building faster with Lovable
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-primary to-purple-600 text-white"
          >
            Try Lovable Now
          </Button>
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    title: "Familiar Intelligence",
    description: "An AI that learns your codebase and helps you write better code faster.",
    icon: <Star className="h-6 w-6 text-white" />,
  },
  {
    title: "Edit in Natural Language",
    description: "Describe your changes in plain English and watch them come to life.",
    icon: <Star className="h-6 w-6 text-white" />,
  },
  {
    title: "Privacy Focused",
    description: "Your code stays private and secure, always under your control.",
    icon: <Star className="h-6 w-6 text-white" />,
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior Developer",
    content: "Lovable has transformed how I write code. It's like having a senior developer always ready to help.",
  },
  {
    name: "Michael Rodriguez",
    role: "Tech Lead",
    content: "The natural language editing is a game-changer. It makes coding so much more accessible.",
  },
  {
    name: "Emma Thompson",
    role: "Full Stack Developer",
    content: "I'm amazed by how well it understands context and maintains consistency across the codebase.",
  },
];

export default Landing;