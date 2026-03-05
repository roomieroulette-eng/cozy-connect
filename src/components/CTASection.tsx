import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  const { user } = useAuth();

  return (
    <section className="bg-foreground border-t border-border">
      <div className="container">
        <div className="grid lg:grid-cols-12 items-stretch">

          {/* ── Left: headline block ── */}
          <div className="lg:col-span-7 py-20 lg:py-28 lg:pr-16 lg:border-r border-border/20 flex flex-col justify-center">

            <span className="text-xs font-medium text-primary uppercase tracking-widest mb-8">
              Get started today
            </span>

            <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-background leading-[1.0] tracking-tight mb-8">
              Ready to find<br />
              <span className="text-primary italic font-light">your people?</span>
            </h2>

            <p className="text-base text-background/60 leading-relaxed font-light max-w-sm mb-12">
              Join thousands who've stopped searching and started living. Takes less than 3 minutes to get started.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <Button
                size="lg"
                className="bg-background text-foreground hover:bg-background/90 group"
                asChild
              >
                <Link to={user ? "/discover" : "/auth?mode=signup"}>
                  {user ? "Keep matching" : "Get started free"}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-background/70 hover:text-background hover:bg-background/10"
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              >
                See how it works
              </Button>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap items-center gap-6 pt-8 border-t border-background/10">
              {["No credit card required", "Free to match", "Cancel anytime"].map((t) => (
                <div key={t} className="flex items-center gap-1.5 text-xs text-background/50">
                  <Check className="w-3 h-3 text-primary" strokeWidth={3} />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: stat block ── */}
          <div className="lg:col-span-5 lg:pl-16 py-20 lg:py-28 flex flex-col justify-center gap-0 divide-y divide-background/10">
            {[
              { value: "24,000+", label: "Matches made", sub: "and counting" },
              { value: "3 min", label: "To get started", sub: "average setup time" },
              { value: "180+", label: "Cities covered", sub: "across 40+ countries" },
              { value: "4.9 ★", label: "Average rating", sub: "from verified users" },
            ].map((s) => (
              <div key={s.label} className="py-6 first:pt-0 last:pb-0 group">
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <div className="font-serif text-3xl font-bold text-background leading-none mb-1">
                      {s.value}
                    </div>
                    <div className="text-sm text-background/60 font-light">{s.label}</div>
                  </div>
                  <div className="text-xs text-background/30 text-right font-light">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default CTASection;