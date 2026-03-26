import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Home,
  Users,
  MessageCircle,
  User,
  Menu,
  X,
  LogOut,
  ChevronDown,
  ShoppingCart,
} from "lucide-react";
import { NotificationBell } from "@/components/NotificationBell";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: "Discover", icon: Users, href: "/discover" },
    { label: "Messages", icon: MessageCircle, href: "/messages" },
    { label: "Bills", icon: ShoppingCart, href: "/grocery-bills" },
    { label: "Profile", icon: User, href: "/profile" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="font-sans">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 border-b backdrop-blur-xl transition-all duration-300
          ${scrolled
            ? "bg-background/97 border-border/45 shadow-lg"
            : "bg-background/85 border-border/25"
          }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 select-none group">
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-200">
              <Home size={17} color="#fff" strokeWidth={2.2} />
            </div>
            <span className="font-serif text-lg font-semibold text-foreground tracking-tight">
              RoomieRoulette
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`flex items-center gap-[7px] px-3.5 py-[7px] rounded-[10px] text-sm transition-colors duration-150 relative
                  ${isActive(link.href)
                    ? "text-primary bg-primary/10 font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
              >
                <link.icon size={15} strokeWidth={2} />
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {user ? (
              <>
                <NotificationBell />
                <div className="flex items-center gap-2 py-[5px] pl-[5px] pr-3 rounded-full border border-border/45 hover:bg-primary/10 hover:border-primary/30 transition-colors cursor-pointer">
                  <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0">
                    <User size={13} color="#fff" strokeWidth={2} />
                  </div>
                  <span className="text-[13px] text-muted-foreground max-w-[140px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {user.email}
                  </span>
                  <ChevronDown size={13} className="text-muted-foreground" />
                </div>
                <button
                  className="flex items-center gap-1.5 px-3 py-[7px] rounded-[10px] text-[13px] text-muted-foreground bg-transparent border-none cursor-pointer hover:text-destructive hover:bg-destructive/10 transition-colors font-sans"
                  onClick={handleSignOut}
                >
                  <LogOut size={14} strokeWidth={2} />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="px-4 py-[7px] rounded-[10px] text-[13.5px] text-muted-foreground bg-transparent border border-border/45 hover:text-foreground hover:border-primary/40 hover:bg-primary/10 transition-colors inline-flex items-center"
                >
                  Log in
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="px-[18px] py-[7px] rounded-[10px] text-[13.5px] font-medium text-white bg-gradient-to-br from-primary to-primary/80 shadow-md hover:opacity-90 hover:-translate-y-px hover:shadow-lg transition-all inline-flex items-center"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile trigger */}
          <button
            className="flex md:hidden items-center justify-center w-[38px] h-[38px] rounded-[10px] bg-transparent border border-border/25 cursor-pointer text-foreground hover:bg-primary/10 hover:border-primary/30 transition-colors shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X size={18} strokeWidth={2} />
            ) : (
              <Menu size={18} strokeWidth={2} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile panel */}
      <div
        className={`fixed top-16 left-0 right-0 z-[49] bg-background border-b border-border/45 shadow-xl md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}
      >
        <div className="p-3 pb-5 px-5">
          {user && (
            <div className="flex items-center gap-2.5 p-2.5 px-3.5 rounded-xl bg-primary/10 mb-3">
              <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0">
                <User size={16} color="#fff" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider">
                  Signed in as
                </div>
                <div className="text-sm text-foreground font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                  {user.email}
                </div>
              </div>
              <NotificationBell />
            </div>
          )}

          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`flex items-center gap-3 p-3 px-3.5 rounded-xl text-[15px] mb-0.5 transition-colors
                ${isActive(link.href)
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                }`}
            >
              <div
                className={`w-9 h-9 rounded-[9px] flex items-center justify-center shrink-0 transition-colors
                  ${isActive(link.href) ? "bg-primary/15" : "bg-muted/40 group-hover:bg-primary/15"}`}
              >
                <link.icon size={17} strokeWidth={1.8} />
              </div>
              {link.label}
            </Link>
          ))}

          <div className="h-px bg-border/30 my-3" />

          <div className="flex gap-2.5">
            {user ? (
              <button
                className="flex items-center justify-center gap-2 w-full p-3 rounded-xl text-sm text-destructive bg-destructive/10 border-none cursor-pointer hover:bg-destructive/15 transition-colors font-sans"
                onClick={handleSignOut}
              >
                <LogOut size={16} strokeWidth={2} />
                Sign out
              </button>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="flex-1 text-center p-3 rounded-xl text-sm text-muted-foreground border border-border/45 hover:text-foreground hover:border-primary/40 hover:bg-primary/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="flex-1 text-center p-3 rounded-xl text-sm font-medium text-white bg-gradient-to-br from-primary to-primary/80 shadow-md hover:opacity-90 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
