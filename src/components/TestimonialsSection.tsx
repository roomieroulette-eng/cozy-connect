import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Marketing Manager",
    location: "New York, NY",
    quote: "Found my roommate in just 2 weeks. We matched on lifestyle preferences and it's been perfect. Best decision I made for my NYC apartment.",
    rating: 5,
    initial: "S",
  },
  {
    name: "Michael T.",
    role: "Software Developer",
    location: "San Francisco, CA",
    quote: "The matching algorithm is spot on. It filtered out incompatible people and I only saw profiles that matched my vibe. Super efficient.",
    rating: 5,
    initial: "M",
  },
  {
    name: "Priya K.",
    role: "Graduate Student",
    location: "Boston, MA",
    quote: "As an international student, finding a trustworthy roommate was stressful. RoomieRoulette made it easy with verified profiles and clear preferences.",
    rating: 5,
    initial: "P",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-secondary/20 border-t border-border">
      <div className="container">

        {/* ── Header ── */}
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-16 pb-10 border-b border-border">
          <div className="lg:col-span-7">
            <span className="text-xs font-medium text-primary uppercase tracking-widest">
              Testimonials
            </span>
            <h2 className="font-serif text-5xl sm:text-6xl font-bold text-foreground leading-[1.0] tracking-tight mt-4">
              50,000+ people<br />
              <span className="text-primary italic font-light">found their match.</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base text-muted-foreground leading-relaxed font-light max-w-sm">
              Real stories from people who stopped searching and started living.
            </p>
          </div>
        </div>

        {/* ── Testimonials ── */}
        <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border">
          {testimonials.map((t, i) => (
            <div key={t.name} className="flex flex-col gap-6 py-10 lg:py-0 lg:px-10 first:lg:pl-0 last:lg:pr-0">

              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                ))}
              </div>

              {/* Quote */}
              <p className="font-serif text-xl font-light text-foreground leading-relaxed italic flex-1">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-6 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-serif font-semibold text-primary text-sm">{t.initial}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-none mb-1">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role} · {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom stat strip ── */}
        <div className="mt-16 pt-10 border-t border-border grid grid-cols-3 divide-x divide-border">
          {[
            { value: "50k+", label: "Happy roommates" },
            { value: "4.9", label: "Average rating" },
            { value: "2 weeks", label: "Avg time to match" },
          ].map((s) => (
            <div key={s.label} className="text-center px-4 first:pl-0 last:pr-0">
              <div className="font-serif text-3xl font-bold text-foreground mb-1">{s.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;