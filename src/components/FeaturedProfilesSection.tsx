import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, MapPin, DollarSign, Moon, Sun, PawPrint, Wine, Laptop } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDiscoveryProfiles } from "@/hooks/useDiscoveryProfiles";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const PLACEHOLDER_PROFILES = [
  {
    userId: "p1",
    name: "Amara Osei",
    age: 25,
    bioPreview: "Architecture grad student, plant mom, and amateur chef. I keep shared spaces spotless and love quiet evenings in.",
    city: "Lagos",
    neighborhood: "Lekki",
    primaryPhotoUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
    sleepSchedule: "early-bird",
    petFriendly: "yes",
    drinking: "socially",
    workFromHome: "sometimes",
    personalityType: "introvert",
    minBudget: 800,
    maxBudget: 1400,
  },
  {
    userId: "p2",
    name: "Kofi Mensah",
    age: 28,
    bioPreview: "Software engineer by day, jazz enthusiast by night. WFH most days, super tidy, very respectful of personal space.",
    city: "Accra",
    neighborhood: "East Legon",
    primaryPhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    sleepSchedule: "night-owl",
    petFriendly: "depends",
    drinking: "never",
    workFromHome: "always",
    personalityType: "ambivert",
    minBudget: 1000,
    maxBudget: 2000,
  },
  {
    userId: "p3",
    name: "Zara Bello",
    age: 23,
    bioPreview: "Creative director at a startup. Social butterfly who also knows when to give people space. Love hosting game nights!",
    city: "Lagos",
    neighborhood: "Victoria Island",
    primaryPhotoUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80",
    sleepSchedule: "night-owl",
    petFriendly: "yes",
    drinking: "socially",
    workFromHome: "sometimes",
    personalityType: "extrovert",
    minBudget: 1200,
    maxBudget: 1800,
  },
];

const ProfileCard = ({ profile, isPlaceholder }) => (
  <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border bg-card flex flex-col">
    <div className="relative flex-1 overflow-hidden bg-secondary min-h-0">
      {profile.primaryPhotoUrl ? (
        <img
          src={profile.primaryPhotoUrl}
          alt={profile.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-secondary">
          <span className="font-serif text-7xl font-bold text-border">{profile.name?.[0] ?? "?"}</span>
        </div>
      )}

      {(profile.minBudget || profile.maxBudget) && (
        <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm border border-border rounded-full px-3 py-1 flex items-center gap-1">
          <DollarSign className="w-3 h-3 text-primary" />
          <span className="text-xs font-semibold text-foreground">
            {profile.minBudget && profile.maxBudget
              ? `$${profile.minBudget}–$${profile.maxBudget}`
              : profile.minBudget ? `$${profile.minBudget}+` : `up to $${profile.maxBudget}`}
          </span>
        </div>
      )}

      {isPlaceholder && <div className="absolute inset-0 bg-background/10 backdrop-blur-[1px]" />}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="font-serif text-2xl font-semibold text-white leading-none mb-1">
          {profile.name}{profile.age ? `, ${profile.age}` : ""}
        </p>
        {(profile.neighborhood || profile.city) && (
          <p className="text-xs text-white/70 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {[profile.neighborhood, profile.city].filter(Boolean).join(", ")}
          </p>
        )}
      </div>
    </div>

    <div className="p-5 flex flex-col gap-3 shrink-0">
      {profile.bioPreview && (
        <p className="text-sm text-muted-foreground leading-relaxed font-light line-clamp-2">
          {profile.bioPreview}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {profile.sleepSchedule && (
          <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">
            {profile.sleepSchedule === "night-owl" ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
            {profile.sleepSchedule === "night-owl" ? "Night owl" : "Early bird"}
          </span>
        )}
        {profile.petFriendly && profile.petFriendly !== "no" && (
          <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">
            <PawPrint className="w-3 h-3" /> Pet-friendly
          </span>
        )}
        {profile.drinking && profile.drinking !== "never" && (
          <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">
            <Wine className="w-3 h-3" /> {profile.drinking === "socially" ? "Social drinker" : "Drinks"}
          </span>
        )}
        {profile.workFromHome && profile.workFromHome !== "never" && (
          <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">
            <Laptop className="w-3 h-3" /> {profile.workFromHome === "sometimes" ? "WFH sometimes" : "WFH"}
          </span>
        )}
        {profile.personalityType && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary capitalize">
            {profile.personalityType}
          </span>
        )}
      </div>
    </div>
  </div>
);

const cardVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.95,
  }),
};

const FeaturedProfilesSection = () => {
  const { profiles, loading } = useDiscoveryProfiles();
  const { user } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const isPlaceholder = !user || profiles.length === 0;
  const displayProfiles = isPlaceholder ? PLACEHOLDER_PROFILES : profiles.slice(0, 5);
  const total = displayProfiles.length;

  // Auto rotate
  useEffect(() => {
    if (total <= 1) return;
    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % total);
    }, 4000);
    return () => clearInterval(interval);
  }, [total]);

  const prev = () => {
    setDirection(-1);
    setActiveIndex((i) => (i - 1 + total) % total);
  };
  const next = () => {
    setDirection(1);
    setActiveIndex((i) => (i + 1) % total);
  };

  return (
    <section id="profile" className="py-20 lg:py-28 bg-background border-t border-border">
      <div className="container">

        {/* Header */}
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-16 pb-10 border-b border-border">
          <div className="lg:col-span-7">
            <span className="text-xs font-medium text-primary uppercase tracking-widest">
              Featured Profiles
            </span>
            <h2 className="font-serif text-5xl sm:text-6xl font-bold text-foreground leading-[1.0] tracking-tight mt-4">
              Meet people already<br />
              <span className="text-primary italic font-light">looking.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-4 lg:items-end">
            <p className="text-base text-muted-foreground leading-relaxed font-light lg:text-right max-w-xs lg:ml-auto">
              Every profile is verified. Browse real people in your area looking for their next home.
            </p>
            <Button variant="hero" size="default" asChild className="group w-fit">
              <Link to={user ? "/discover" : "/auth?mode=signup"}>
                {user ? "Browse all profiles" : "Sign up to browse"}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="w-full max-w-sm aspect-[3/4] rounded-2xl border border-border bg-secondary animate-pulse" />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 items-center">

            {/* Card viewer */}
            <div className="relative w-full max-w-sm mx-auto lg:mx-0 shrink-0" style={{ height: "520px" }}>
              <AnimatePresence custom={direction}>
                <motion.div
                  key={displayProfiles[activeIndex].userId}
                  custom={direction}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <ProfileCard
                    profile={displayProfiles[activeIndex]}
                    isPlaceholder={isPlaceholder}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Back stack */}
              {[2, 1].map((offset) => {
                const idx = (activeIndex + offset) % total;
                return (
                  <div
                    key={`stack-${offset}`}
                    className="absolute inset-0 rounded-2xl border border-border bg-card overflow-hidden"
                    style={{
                      transform: `translateY(${offset * -8}px) scale(${1 - offset * 0.04})`,
                      zIndex: 3 - offset,
                      opacity: 1 - offset * 0.25,
                    }}
                  >
                    {displayProfiles[idx]?.primaryPhotoUrl && (
                      <img
                        src={displayProfiles[idx].primaryPhotoUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                );
              })}

              {/* Signup overlay */}
              {isPlaceholder && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-background/60 backdrop-blur-sm border border-border">
                  <p className="font-serif text-xl font-semibold text-foreground mb-1 text-center px-6">Want to see real profiles?</p>
                  <p className="text-sm text-muted-foreground mb-5 text-center px-8">Sign up free to browse people in your area.</p>
                  <Button variant="hero" asChild size="sm">
                    <Link to="/auth?mode=signup">Get started</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Right nav + list */}
            <div className="flex-1 w-full">
              {/* Nav controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  {displayProfiles.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`rounded-full transition-all duration-200 ${
                        i === activeIndex
                          ? "w-6 h-2 bg-primary"
                          : "w-2 h-2 bg-border hover:bg-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={prev} className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all duration-150">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button onClick={next} className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all duration-150">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Profile list */}
              <div className="divide-y divide-border rounded-2xl border border-border overflow-hidden">
                {displayProfiles.map((p, i) => (
                  <button
                    key={p.userId}
                    onClick={() => setActiveIndex(i)}
                    className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors duration-150 ${
                      i === activeIndex ? "bg-primary/5" : "hover:bg-secondary/40"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary flex-shrink-0">
                      {p.primaryPhotoUrl ? (
                        <img src={p.primaryPhotoUrl} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center font-serif font-bold text-border">
                          {p.name?.[0]}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold leading-none mb-1 ${i === activeIndex ? "text-primary" : "text-foreground"}`}>
                        {p.name}{p.age ? `, ${p.age}` : ""}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {[p.neighborhood, p.city].filter(Boolean).join(", ")}
                      </p>
                    </div>
                    {p.personalityType && (
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${
                        i === activeIndex ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                      }`}>
                        {p.personalityType}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedProfilesSection;