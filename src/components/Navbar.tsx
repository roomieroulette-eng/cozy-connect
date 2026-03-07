import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
    { label: "Profile", icon: User, href: "/profile" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isActive = (href) => location.pathname === href;

  return (
    <>
      {/* Inline styles for custom tokens */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500&display=swap');

        .nav-root {
          --nav-height: 64px;
          --nav-bg: rgba(255, 252, 248, 0.85);
          --nav-bg-scrolled: rgba(255, 252, 248, 0.97);
          --nav-border: rgba(200, 180, 160, 0.25);
          --nav-border-scrolled: rgba(200, 180, 160, 0.45);
          --accent: #c2714f;
          --accent-light: #f5ede8;
          --accent-hover: #a85a3a;
          --text-primary: #1a1410;
          --text-muted: #7a6a5e;
          --active-bg: #f5ede8;
          --active-color: #c2714f;
          --shadow-scrolled: 0 4px 24px rgba(150, 100, 60, 0.08);
          font-family: 'DM Sans', sans-serif;
        }

        .nav-root.dark {
          --nav-bg: rgba(18, 14, 10, 0.85);
          --nav-bg-scrolled: rgba(18, 14, 10, 0.97);
          --nav-border: rgba(80, 60, 40, 0.35);
          --nav-border-scrolled: rgba(100, 75, 50, 0.5);
          --accent: #e8916a;
          --accent-light: rgba(232, 145, 106, 0.1);
          --accent-hover: #f0a880;
          --text-primary: #f5ede8;
          --text-muted: #a09080;
          --active-bg: rgba(232, 145, 106, 0.12);
          --active-color: #e8916a;
          --shadow-scrolled: 0 4px 24px rgba(0, 0, 0, 0.3);
        }

        .nav-bar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 50;
          height: var(--nav-height);
          background: var(--nav-bg);
          border-bottom: 1px solid var(--nav-border);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .nav-bar.scrolled {
          background: var(--nav-bg-scrolled);
          border-color: var(--nav-border-scrolled);
          box-shadow: var(--shadow-scrolled);
        }

        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        /* Logo */
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
          user-select: none;
        }

        .nav-logo-mark {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #c2714f 0%, #e8a882 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(194, 113, 79, 0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .nav-logo:hover .nav-logo-mark {
          transform: scale(1.05) rotate(-3deg);
          box-shadow: 0 4px 14px rgba(194, 113, 79, 0.45);
        }

        .nav-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          letter-spacing: -0.01em;
          transition: color 0.2s;
        }

        /* Desktop links */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 2px;
          flex: 1;
          justify-content: center;
        }

        @media (max-width: 767px) {
          .nav-links { display: none; }
          .nav-actions { display: none; }
          .nav-mobile-trigger { display: flex; }
        }

        @media (min-width: 768px) {
          .nav-mobile-trigger { display: none; }
          .nav-mobile-panel { display: none !important; }
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 14px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 450;
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.18s ease, background 0.18s ease;
          position: relative;
          letter-spacing: 0.01em;
        }

        .nav-link:hover {
          color: var(--text-primary);
          background: rgba(150, 100, 60, 0.06);
        }

        .nav-link.active {
          color: var(--active-color);
          background: var(--active-bg);
          font-weight: 500;
        }

        .nav-link-dot {
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--accent);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .nav-link.active .nav-link-dot {
          opacity: 1;
        }

        /* Actions */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .nav-user-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 12px 5px 5px;
          border-radius: 100px;
          border: 1px solid var(--nav-border-scrolled);
          background: transparent;
          cursor: pointer;
          transition: background 0.18s, border-color 0.18s;
        }

        .nav-user-pill:hover {
          background: var(--active-bg);
          border-color: rgba(194, 113, 79, 0.3);
        }

        .nav-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c2714f 0%, #e8a882 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .nav-email {
          font-size: 13px;
          color: var(--text-muted);
          max-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .btn-signout {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 450;
          color: var(--text-muted);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color 0.18s, background 0.18s;
          font-family: 'DM Sans', sans-serif;
        }

        .btn-signout:hover {
          color: #c0392b;
          background: rgba(192, 57, 43, 0.07);
        }

        .btn-login {
          padding: 7px 16px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 450;
          color: var(--text-muted);
          background: transparent;
          border: 1px solid var(--nav-border-scrolled);
          cursor: pointer;
          text-decoration: none;
          transition: color 0.18s, background 0.18s, border-color 0.18s;
          font-family: 'DM Sans', sans-serif;
          display: inline-flex;
          align-items: center;
        }

        .btn-login:hover {
          color: var(--text-primary);
          border-color: rgba(194, 113, 79, 0.4);
          background: var(--active-bg);
        }

        .btn-cta {
          padding: 7px 18px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
          color: #fff;
          background: linear-gradient(135deg, #c2714f 0%, #d98060 100%);
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: opacity 0.18s, transform 0.18s, box-shadow 0.18s;
          font-family: 'DM Sans', sans-serif;
          display: inline-flex;
          align-items: center;
          box-shadow: 0 2px 8px rgba(194, 113, 79, 0.3);
          letter-spacing: 0.01em;
        }

        .btn-cta:hover {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(194, 113, 79, 0.4);
        }

        .btn-cta:active {
          transform: translateY(0);
        }

        /* Mobile trigger */
        .nav-mobile-trigger {
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: transparent;
          border: 1px solid var(--nav-border);
          cursor: pointer;
          color: var(--text-primary);
          transition: background 0.18s, border-color 0.18s;
          flex-shrink: 0;
        }

        .nav-mobile-trigger:hover {
          background: var(--active-bg);
          border-color: rgba(194, 113, 79, 0.3);
        }

        /* Mobile panel */
        .nav-mobile-panel {
          position: fixed;
          top: var(--nav-height);
          left: 0; right: 0;
          background: var(--nav-bg-scrolled);
          border-bottom: 1px solid var(--nav-border-scrolled);
          box-shadow: 0 8px 32px rgba(150, 100, 60, 0.1);
          z-index: 49;
          overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 0.3s ease;
        }

        .nav-mobile-panel.open {
          max-height: 400px;
          opacity: 1;
        }

        .nav-mobile-panel.closed {
          max-height: 0;
          opacity: 0;
          pointer-events: none;
        }

        .nav-mobile-inner {
          padding: 12px 20px 20px;
        }

        .nav-mobile-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 450;
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.18s, background 0.18s;
          margin-bottom: 2px;
        }

        .nav-mobile-link:hover,
        .nav-mobile-link.active {
          color: var(--active-color);
          background: var(--active-bg);
        }

        .nav-mobile-link-icon {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: rgba(150, 100, 60, 0.07);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.18s;
        }

        .nav-mobile-link.active .nav-mobile-link-icon,
        .nav-mobile-link:hover .nav-mobile-link-icon {
          background: rgba(194, 113, 79, 0.15);
        }

        .nav-mobile-divider {
          height: 1px;
          background: var(--nav-border);
          margin: 12px 0;
        }

        .nav-mobile-footer {
          display: flex;
          gap: 10px;
        }

        .nav-mobile-footer .btn-login,
        .nav-mobile-footer .btn-cta {
          flex: 1;
          justify-content: center;
          padding: 11px;
          font-size: 14px;
          border-radius: 12px;
        }

        .nav-mobile-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 12px;
          background: var(--active-bg);
          margin-bottom: 12px;
        }

        .nav-mobile-user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c2714f, #e8a882);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .nav-mobile-user-info {
          flex: 1;
          min-width: 0;
        }

        .nav-mobile-user-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .nav-mobile-user-email {
          font-size: 14px;
          color: var(--text-primary);
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .btn-mobile-signout {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 11px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 450;
          color: #c0392b;
          background: rgba(192, 57, 43, 0.07);
          border: none;
          cursor: pointer;
          transition: background 0.18s;
          font-family: 'DM Sans', sans-serif;
        }

        .btn-mobile-signout:hover {
          background: rgba(192, 57, 43, 0.13);
        }
      `}</style>

      <div className={`nav-root`}>
        <nav className={`nav-bar${scrolled ? " scrolled" : ""}`}>
          <div className="nav-inner">
            {/* Logo */}
            <Link to="/" className="nav-logo">
              <div className="nav-logo-mark">
                <Home size={17} color="#fff" strokeWidth={2.2} />
              </div>
              <span className="nav-logo-text">RoomieRoulette</span>
            </Link>

            {/* Desktop nav links */}
            <div className="nav-links">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`nav-link${isActive(link.href) ? " active" : ""}`}
                >
                  <link.icon size={15} strokeWidth={2} />
                  {link.label}
                  <span className="nav-link-dot" />
                </Link>
              ))}
            </div>

            {/* Desktop actions */}
            <div className="nav-actions">
              {user ? (
                <>
                  <NotificationBell />
                  <div className="nav-user-pill">
                    <div className="nav-avatar">
                      <User size={13} color="#fff" strokeWidth={2} />
                    </div>
                    <span className="nav-email">{user.email}</span>
                    <ChevronDown size={13} color="var(--text-muted)" />
                  </div>
                  <button className="btn-signout" onClick={handleSignOut}>
                    <LogOut size={14} strokeWidth={2} />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth" className="btn-login">
                    Log in
                  </Link>
                  <Link to="/auth?mode=signup" className="btn-cta">
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile trigger */}
            <button
              className="nav-mobile-trigger"
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
          className={`nav-mobile-panel${mobileMenuOpen ? " open" : " closed"}`}
        >
          <div className="nav-mobile-inner">
            {user && (
              <div className="nav-mobile-user">
                <div className="nav-mobile-user-avatar">
                  <User size={16} color="#fff" strokeWidth={2} />
                </div>
                <div className="nav-mobile-user-info">
                  <div className="nav-mobile-user-label">Signed in as</div>
                  <div className="nav-mobile-user-email">{user.email}</div>
                </div>
                <NotificationBell />
              </div>
            )}

            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`nav-mobile-link${isActive(link.href) ? " active" : ""}`}
              >
                <div className="nav-mobile-link-icon">
                  <link.icon size={17} strokeWidth={1.8} />
                </div>
                {link.label}
              </Link>
            ))}

            <div className="nav-mobile-divider" />

            <div className="nav-mobile-footer">
              {user ? (
                <button className="btn-mobile-signout" onClick={handleSignOut}>
                  <LogOut size={16} strokeWidth={2} />
                  Sign out
                </button>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="btn-login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link to="/auth?mode=signup" className="btn-cta">
                    Get Started
                  </Link>{" "}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
