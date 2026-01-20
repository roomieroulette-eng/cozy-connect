import { Button } from "@/components/ui/button";
import ProfileCard from "@/components/ProfileCard";
import { ArrowRight } from "lucide-react";

import profile1 from "@/assets/profile-1.jpg";
import profile2 from "@/assets/profile-2.jpg";
import profile3 from "@/assets/profile-3.jpg";

const FeaturedProfilesSection = () => {
  const profiles = [
    {
      name: "Emma",
      age: 26,
      location: "Brooklyn, NY",
      budget: "$1,200",
      bio: "Marketing professional who loves cooking, yoga, and quiet Sunday mornings. Looking for a chill roommate!",
      image: profile1,
      traits: { pets: true, drinks: true, nightOwl: false, clean: true },
    },
    {
      name: "James",
      age: 28,
      location: "Manhattan, NY",
      budget: "$1,500",
      bio: "Software engineer, coffee enthusiast, and weekend hiker. Early riser who respects quiet hours.",
      image: profile2,
      traits: { pets: false, drinks: true, nightOwl: false, clean: true },
    },
    {
      name: "Maya",
      age: 24,
      location: "Queens, NY",
      budget: "$1,000",
      bio: "Grad student studying architecture. Plant mom, night owl, and amazing at keeping shared spaces tidy.",
      image: profile3,
      traits: { pets: true, drinks: false, nightOwl: true, clean: true },
    },
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Featured Profiles
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Meet People Looking for
            <span className="text-gradient-warm"> Roommates</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover compatible roommates in your area. Each profile is verified
            to ensure a safe and genuine experience.
          </p>
        </div>

        {/* Profiles Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {profiles.map((profile, index) => (
            <div
              key={index}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProfileCard {...profile} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="hero" size="lg" className="group">
            Browse All Profiles
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProfilesSection;
