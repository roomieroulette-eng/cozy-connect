import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useDiscoveryProfiles } from "@/hooks/useDiscoveryProfiles";
import { ArrowRight, Check, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-living-room.jpg";

const ROTATING_WORDS = ["roommate", "lifestyle", "vibe", "space", "home"];

const PLACEHOLDER_PROFILES = [
  {
    name: "Amara",
    tag: "Clean · Early bird",
    primaryPhotoUrl: null,
    neighborhood: "Lekki",
    city: "Lagos",
    personalityType: "introvert",
  },
  {
    name: "Kofi",
    tag: "WFH · Night owl",
    primaryPhotoUrl: null,
    neighborhood: "East Legon",
    city: "Accra",
    personalityType: "ambivert",
  },
  {
    name: "Zara",
    tag: "Social · Pet-friendly",
    primaryPhotoUrl: null,
    neighborhood: "VI",
    city: "Lagos",
    personalityType: "extrovert",
  },
];

const HeroSection = () => {
  const { user } = useAuth();
  const { profiles } = useDiscoveryProfiles();
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % ROTATING_WORDS.length);
        setVisible(true);
      }, 300);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const displayProfiles =
    profiles.length > 0
      ? profiles.slice(0, 3).map((p) => ({
          name: p.name,
          tag: [
            p.personalityType,
            p.sleepSchedule === "night-owl"
              ? "Night owl"
              : p.sleepSchedule === "early-bird"
                ? "Early bird"
                : null,
          ]
            .filter(Boolean)
            .join(" · "),
          primaryPhotoUrl: p.primaryPhotoUrl,
          neighborhood: p.neighborhood,
          city: p.city,
          personalityType: p.personalityType,
        }))
      : PLACEHOLDER_PROFILES;

  return (
    <section className="relative min-h-screen pt-16 bg-background overflow-hidden flex items-center border-b border-border">
      <div className="container py-20 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-0 items-stretch">
          {/* ── Left ── */}
          <div className="lg:col-span-6 flex flex-col justify-center py-0 lg:pr-16 lg:border-r border-border">
            <span className="text-xs font-medium text-primary uppercase tracking-widest mb-8">
              Find. Match. Move in.
            </span>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.0] tracking-tight mb-6">
              Your next
              <br />
              <span
                className={`text-primary italic font-light transition-all duration-300 inline-block ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-2"
                }`}
              >
                {ROTATING_WORDS[wordIndex]}
              </span>
              <br />
              starts here.
            </h1>

            <p className="text-base text-muted-foreground leading-relaxed font-light max-w-sm mb-10">
              Stop doom-scrolling listings. Swipe on people who actually match
              how you live.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <Button variant="hero" size="lg" asChild className="group">
                <Link to={user ? "/discover" : "/auth?mode=signup"}>
                  Start for free
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  const section = document.getElementById("profile");
                  section?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Browse matches
              </Button>

              {/* <Button variant="outline" size="lg" asChild>
                <Link to="/discover">Browse matches</Link>
              </Button> */}
            </div>

            <div className="flex items-center gap-6 pt-8 border-t border-border">
              {["Verified profiles", "Free to match", "180+ cities"].map(
                (t) => (
                  <div
                    key={t}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground"
                  >
                    <Check className="w-3 h-3 text-primary" strokeWidth={3} />
                    {t}
                  </div>
                ),
              )}
            </div>
          </div>

          {/* ── Right ── */}
          <div className="hidden lg:flex lg:col-span-6 flex-col pl-16 justify-center gap-6">
            {/* Hero image */}
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9]">
              <img
                src={heroImage}
                alt="Living room"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
              <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm border border-border rounded-xl px-3 py-2 text-center">
                <div className="font-serif text-xl font-bold text-foreground leading-none">
                  4.9
                </div>
                <div className="text-yellow-500 text-xs mt-1">★★★★★</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  avg rating
                </div>
              </div>
            </div>

            {/* Profile rows — real data */}
            <div className="rounded-2xl border border-border overflow-hidden divide-y divide-border">
              {displayProfiles.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-3 hover:bg-secondary/40 transition-colors duration-150 group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary flex-shrink-0 flex items-center justify-center">
                      {p.primaryPhotoUrl ? (
                        <img
                          src={p.primaryPhotoUrl}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-serif font-bold text-sm text-muted-foreground">
                          {p.name?.[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground leading-none mb-0.5">
                        {p.name}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {p.tag ||
                          [p.neighborhood, p.city].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.personalityType && (
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full capitalize">
                        {p.personalityType}
                      </span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}

              <div className="px-4 py-3 flex items-center justify-between bg-secondary/20">
                <span className="text-xs text-muted-foreground">
                  {profiles.length > 0
                    ? `${profiles.length} near you`
                    : "+340 near you today"}
                </span>
                <Link
                  to={user ? "/discover" : "/auth?mode=signup"}
                  className="text-xs font-semibold text-primary flex items-center gap-1 hover:gap-2 transition-all duration-150"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
