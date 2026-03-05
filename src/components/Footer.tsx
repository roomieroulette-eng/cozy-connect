import { Link } from "react-router-dom";
import { Home, Instagram, Twitter, Facebook, Mail, ArrowRight } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Discover", href: "/discover" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Help", href: "/help" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Mail, href: "mailto:hello@roomieroulette.com", label: "Email" },
];

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container py-16">

        {/* ── Top: brand + newsletter + links ── */}
        <div className="grid lg:grid-cols-12 gap-12 pb-12 border-b border-border">

          {/* Brand col */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2.5 w-fit">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Home className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl font-semibold text-foreground">RoomieRoulette</span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed font-light max-w-xs">
              Finding your perfect roommate, one swipe at a time. Join the community and discover compatible living partners.
            </p>

            {/* Social links */}
            <div className="flex gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-150"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Link columns */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <p className="text-xs font-medium text-foreground uppercase tracking-widest mb-4">{category}</p>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Newsletter */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <p className="text-xs font-medium text-foreground uppercase tracking-widest">Stay in the loop</p>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              New roommates, features, and tips straight to your inbox.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-150"
              />
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity duration-150 group">
                Subscribe
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-8 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} RoomieRoulette. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">Made with ♥ for better living</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;