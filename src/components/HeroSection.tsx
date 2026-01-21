import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Check } from "lucide-react";
import heroImage from "@/assets/hero-living-room.jpg";

const HeroSection = () => {
  const benefits = [
    "Find compatible roommates instantly",
    "Swipe to match based on lifestyle",
    "Safe & verified profiles",
  ];

  return (
    <section className="relative min-h-screen pt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" />

      <div className="container relative mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              <span>Find Your Perfect Match</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Find Your
              <span className="text-gradient-warm"> Ideal </span>
              Roommate
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              Swipe, match, and connect with compatible roommates who share your
              lifestyle, budget, and vibe. Home is where your roommate is.
            </p>

            {/* Benefits */}
            <ul className="space-y-3 mb-8 text-left max-w-md mx-auto lg:mx-0">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-foreground"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="xl" className="group">
                Start Matching
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="xl">
                Learn More
              </Button>
            </div>

            {/* Social Proof */}
            <div className="mt-10 pt-8 border-t border-border">
              <div className="flex items-center justify-center lg:justify-start gap-6">
                <div>
                  <p className="text-3xl font-bold text-foreground">50K+</p>
                  <p className="text-sm text-muted-foreground">Happy Matches</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div>
                  <p className="text-3xl font-bold text-foreground">4.9★</p>
                  <p className="text-sm text-muted-foreground">App Rating</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div>
                  <p className="text-3xl font-bold text-foreground">120+</p>
                  <p className="text-sm text-muted-foreground">Cities</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in">
            {/* Main Image Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-elevated animate-float">
              <img
                src={heroImage}
                alt="Cozy living room"
                className="w-full aspect-[4/3] object-cover"
              />
              {/* Overlay Card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-background/90 backdrop-blur-md shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-warm flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">New Match!</p>
                    <p className="text-sm text-muted-foreground">
                      You and Sarah have similar vibes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Stats Card */}
            <div className="absolute -top-4 -right-4 p-4 rounded-2xl bg-background shadow-elevated animate-float-delayed">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🏠</div>
                <div>
                  <p className="text-sm font-medium text-foreground">Just Matched</p>
                  <p className="text-xs text-muted-foreground">2 mins ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
