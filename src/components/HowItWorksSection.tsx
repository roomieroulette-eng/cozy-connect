import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, Search, Heart, MessageCircle, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Profile",
    description:
      "Set up your profile with photos, preferences, and lifestyle habits in just a few minutes.",
  },
  {
    icon: Search,
    title: "Discover Matches",
    description:
      "Browse compatible roommates filtered by location, budget, and living style.",
  },
  {
    icon: Heart,
    title: "Swipe & Match",
    description:
      "Swipe right on profiles you like. When it's mutual, you've got a match!",
  },
  {
    icon: MessageCircle,
    title: "Connect & Meet",
    description:
      "Chat with your matches, ask questions, and arrange a meetup.",
  },
];

const HowItWorksSection = () => {
  return (
    <section  id="how-it-works" className="py-10  bg-background border-t border-border">
      <div className="container">

        {/* Header */}
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-16 pb-10 border-b border-border">
          <div className="lg:col-span-7">
            <span className="text-xs font-medium text-primary uppercase tracking-widest">
              How It Works
            </span>
            <h2 className="font-serif text-5xl sm:text-6xl font-bold text-foreground leading-[1.0] tracking-tight mt-4">
              Four steps to<br />
              <span className="text-primary italic font-light">finding home.</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base text-muted-foreground leading-relaxed font-light max-w-sm">
              Our smart matching algorithm connects you with compatible roommates based on what matters most to you.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
          {steps.map((step, i) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="group flex flex-col gap-6 px-0 py-8 sm:px-8 sm:py-0 first:pl-0 last:pr-0 bg-secondary/30 transition-colors duration-200 rounded-xl"
              >
                {/* Number + icon row */}
                <div className="flex items-start justify-between">

                  {/* 🔥 Animated Number */}
                  <motion.span
                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.15,
                      ease: "easeOut",
                    }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="font-serif text-6xl font-bold group-hover:text-border leading-none select-none text-primary/20 transition-colors duration-200"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </motion.span>

                  {/* Icon */}
                  <div className="w-11 h-11 rounded-xl  group-hover:bg-primary/10 flex items-center justify-center flex-shrink-0 bg-primary group-hover:text-primary-foreground transition-all duration-200">
                    <Icon className="w-5 h-5  group-hover:text-primary text-primary-foreground transition-colors duration-200" />
                  </div>
                </div>

                {/* Text */}
                <div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">
                    {step.description}
                  </p>
                </div>

                {i < steps.length - 1 && (
                  <div className="hidden lg:flex items-center justify-end pr-2 mt-auto">
                    <ArrowRight className="w-4 h-4 group-hover:text-border text-primary transition-colors duration-200" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 pt-10 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Takes less than <span className="text-foreground font-medium">3 minutes</span> to get started.
          </p>
          <Link
            to="/auth?mode=signup"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all duration-200"
          >
            Create your profile <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;