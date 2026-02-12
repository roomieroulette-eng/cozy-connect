import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="relative max-w-4xl mx-auto">
          {/* Background Card */}
          <div className="relative rounded-3xl overflow-hidden gradient-warm p-12 lg:p-16">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/10 rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative text-center">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm mb-6">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>

              {/* Headline */}
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
                Ready to Find Your
                <br />
                Perfect Roommate?
              </h2>

              {/* Subheadline */}
              <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-8">
                Join thousands of people who found their ideal living situation
                through RoomieRoulette. It's free to get started!
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="xl"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold group"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  See How It Works
                </Button>
              </div>

              {/* Trust Badges */}
              <p className="mt-8 text-sm text-primary-foreground/60">
                ✓ No credit card required • ✓ Free to match • ✓ Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
