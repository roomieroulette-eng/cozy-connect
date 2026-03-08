import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { getUserFriendlyError } from "@/lib/errorHandler";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Home, Mail, Lock, ArrowRight, CheckCircle, Eye, EyeOff } from "lucide-react";
import heroImage from "@/assets/hero-living-room.jpg";

export default function Auth() {
  const searchParams = new URLSearchParams(window.location.search);
  const [isLogin, setIsLogin] = useState(searchParams.get("mode") !== "signup");
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (val: string) => {
    if (!val) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Enter a valid email address";
    return "";
  };

  const validatePassword = (val: string) => {
    if (!val) return "Password is required";
    if (val.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const validate = () => {
    const e = { email: validateEmail(email), password: validatePassword(password) };
    setErrors(e);
    setTouched({ email: true, password: true });
    return !e.email && !e.password;
  };

  const handleBlur = (field: "email" | "password") => {
    setTouched((t) => ({ ...t, [field]: true }));
    if (field === "email") setErrors((e) => ({ ...e, email: validateEmail(email) }));
    if (field === "password") setErrors((e) => ({ ...e, password: validatePassword(password) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const { error } = isLogin ? await signIn(email, password) : await signUp(email, password);
    if (error) {
      const msg = getUserFriendlyError(error);
      if (msg.toLowerCase().includes("password")) setErrors((prev) => ({ ...prev, password: msg }));
      else setErrors((prev) => ({ ...prev, email: msg }));
    } else {
      if (isLogin) navigate("/discover");
      else setEmailSent(true);
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    if (emailErr) { setErrors({ email: emailErr }); setTouched({ email: true }); return; }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) setErrors({ email: getUserFriendlyError(error) });
    else setResetEmailSent(true);
    setLoading(false);
  };

  const switchMode = (login: boolean) => {
    setIsLogin(login);
    setErrors({});
    setTouched({});
    setEmail("");
    setPassword("");
    window.history.replaceState({}, "", login ? "/auth" : "/auth?mode=signup");
  };

  const inputClass = (err?: string, touch?: boolean) =>
    `w-full bg-background border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-150 focus:ring-2 focus:ring-primary/20 ${
      touch && err ? "border-destructive focus:ring-destructive/20" : "border-border focus:border-primary"
    }`;

  // ── Email sent ──
  if (emailSent || resetEmailSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-sm text-center animate-slide-up">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-7 h-7 text-primary" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-3">Check your email</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            {resetEmailSent
              ? <>We sent a password reset link to <span className="text-foreground font-medium">{email}</span>.</>
              : <>We sent a verification link to <span className="text-foreground font-medium">{email}</span>. Click it to confirm your account.</>
            }
          </p>
          <button
            onClick={() => { setEmailSent(false); setResetEmailSent(false); setIsForgotPassword(false); switchMode(true); }}
            className="text-sm text-primary font-medium hover:underline"
          >
            ← Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">

      {/* ── Left: image panel (desktop only) ── */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <img src="/chairbg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-background/30 via-background/30 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="font-serif text-4xl font-semibold text-white leading-tight drop-shadow-lg">
            Find the home<br />
            <span className="italic font-light">you've always wanted.</span>
          </p>
        </div>
      </div>

      {/* ── Right: form ── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 max-w-lg w-full mx-auto lg:mx-0">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 mb-12">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Home className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl font-semibold text-foreground">RoomieRoulette</span>
        </Link>

        {isForgotPassword ? (
          <div className="animate-slide-up">
            <h1 className="font-serif text-4xl font-bold text-foreground leading-tight mb-2">Reset your<br />password</h1>
            <p className="text-sm text-muted-foreground mb-10">We'll send a reset link straight to your inbox.</p>

            <form onSubmit={handleForgotPassword} className="space-y-5" noValidate>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground uppercase tracking-wider">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (touched.email) setErrors((err) => ({ ...err, email: validateEmail(e.target.value) })); }}
                    onBlur={() => handleBlur("email")}
                    className={`pl-10 ${inputClass(errors.email, touched.email)}`}
                  />
                </div>
                {touched.email && errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                {loading
                  ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />Sending…</span>
                  : <span className="flex items-center gap-2">Send reset link <ArrowRight className="w-4 h-4" /></span>
                }
              </Button>
            </form>

            <button onClick={() => { setIsForgotPassword(false); setErrors({}); setTouched({}); }} className="mt-8 text-sm text-primary font-medium hover:underline">
              ← Back to sign in
            </button>
          </div>

        ) : (
          <div className="animate-slide-up">

            {/* Mode tabs */}
            <div className="flex rounded-xl border border-border p-1 mb-10 w-fit">
              {[{ label: "Sign in", login: true }, { label: "Sign up", login: false }].map(({ label, login }) => (
                <button
                  key={label}
                  onClick={() => switchMode(login)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isLogin === login ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <h1 className="font-serif text-4xl font-bold text-foreground leading-tight mb-2">
              {isLogin ? <>Welcome<br />back.</> : <>Create your<br />account.</>}
            </h1>
            <p className="text-sm text-muted-foreground mb-10">
              {isLogin ? "Sign in to find your perfect roommate." : "Join thousands finding their ideal living situation."}
            </p>

            {/* Google */}
            <button
              type="button"
              onClick={async () => {
                const { error } = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
                if (error) setErrors({ email: getUserFriendlyError(error) });
              }}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-secondary/50 text-sm font-medium text-foreground transition-colors duration-150 mb-6"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* Email */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground uppercase tracking-wider">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (touched.email) setErrors((err) => ({ ...err, email: validateEmail(e.target.value) })); }}
                    onBlur={() => handleBlur("email")}
                    className={`pl-10 ${inputClass(errors.email, touched.email)}`}
                  />
                </div>
                {touched.email && errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-foreground uppercase tracking-wider">Password</Label>
                  {isLogin && (
                    <button type="button" onClick={() => { setIsForgotPassword(true); setErrors({}); setTouched({}); }} className="text-xs text-primary hover:underline">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (touched.password) setErrors((err) => ({ ...err, password: validatePassword(e.target.value) })); }}
                    onBlur={() => handleBlur("password")}
                    className={`pl-10 pr-10 ${inputClass(errors.password, touched.password)}`}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {touched.password && errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                {!isLogin && password.length >= 6 && <p className="text-xs text-primary">Looks good!</p>}
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full mt-2" disabled={loading}>
                {loading
                  ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />{isLogin ? "Signing in…" : "Creating account…"}</span>
                  : <span className="flex items-center gap-2">{isLogin ? "Sign In" : "Create Account"} <ArrowRight className="w-4 h-4" /></span>
                }
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground mt-8">
              By continuing, you agree to our{" "}
              <Link to="/terms" className="text-foreground hover:underline">Terms</Link>{" "}and{" "}
              <Link to="/privacy" className="text-foreground hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}