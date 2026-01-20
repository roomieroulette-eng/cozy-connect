import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Search, Heart, MessageCircle } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Create Profile",
      description:
        "Set up your profile with photos, preferences, and lifestyle habits in just a few minutes.",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Search,
      title: "Discover Matches",
      description:
        "Browse through compatible roommates filtered by location, budget, and living style.",
      color: "bg-accent/20 text-accent-foreground",
    },
    {
      icon: Heart,
      title: "Swipe & Match",
      description:
        "Swipe right on profiles you like. When it's mutual, you've got a match!",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: MessageCircle,
      title: "Connect & Meet",
      description:
        "Chat with your matches, ask questions, and meet up to find your perfect roommate.",
      color: "bg-accent/20 text-accent-foreground",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Find Your Roommate in
            <span className="text-gradient-warm"> 4 Simple Steps</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our smart matching algorithm connects you with compatible roommates
            based on what matters most to you.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card
              key={index}
              variant="elevated"
              className="group hover:-translate-y-2 transition-all duration-300"
            >
              <CardContent className="p-6 text-center">
                {/* Step Number */}
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground text-sm font-bold mb-4">
                  {index + 1}
                </div>

                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110`}
                >
                  <step.icon className="w-7 h-7" />
                </div>

                {/* Content */}
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
