import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useRestaurantSettings } from "../../hooks/useRestaurantSettings";

function Shell({ settings, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-noir px-6 py-16">
      <div className="w-full max-w-sm flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-2">
          <span className="font-serif text-3xl text-ivory">{settings?.restaurant_name || "Maison Noor"}</span>
          <span className="eyebrow text-gold">Administration</span>
        </div>
        {children}
        <a href="/" className="text-beige/40 text-xs hover:text-gold transition-colors">
          ← Back to site
        </a>
      </div>
    </div>
  );
}

export default function Login() {
  const { user, isAdmin, loading, isConfigured, isSupabaseConfigured, signIn, signOut } = useAuth();
  const { settings } = useRestaurantSettings();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Authorized admin, fully resolved: proceed to the dashboard (or wherever they
  // were headed before being bounced to login).
  if (!loading && user && isAdmin) {
    const redirectTo = location.state?.from?.pathname || "/admin";
    return <Navigate to={redirectTo} replace />;
  }

  if (!isConfigured) {
    return (
      <Shell settings={settings}>
        <div className="w-full flex flex-col gap-5 bg-charcoal p-8 border border-ivory/10">
          <h1 className="text-xl text-ivory font-serif">Admin sign-in</h1>
          <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2 text-left">
            {!isSupabaseConfigured && "VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set. "}
            See the README to configure .env.local.
          </p>
        </div>
      </Shell>
    );
  }

  // Still resolving the session / admin_users lookup.
  if (loading) {
    return (
      <Shell settings={settings}>
        <span className="eyebrow text-gold animate-pulse">Loading...</span>
      </Shell>
    );
  }

  // Signed in, but this email is not in admin_users. Stay right here on
  // /admin/login — never bounce to the public homepage — and keep the session
  // alive until the user explicitly chooses to sign out.
  if (user && !isAdmin) {
    return (
      <Shell settings={settings}>
        <div className="w-full flex flex-col gap-5 bg-charcoal p-8 border border-ivory/10">
          <h1 className="text-xl text-ivory font-serif">Access denied</h1>
          <p className="text-sm text-beige/80 text-left leading-relaxed">
            Access denied. This email ({user.email}) is not authorized to access the admin dashboard.
            Please use an authorized administrator account and try again.
          </p>
          <button
            onClick={signOut}
            className="inline-flex items-center justify-center gap-2 bg-ivory text-noir px-6 py-3 text-sm font-medium hover:bg-gold transition-colors"
          >
            Sign out &amp; try another account
          </button>
        </div>
      </Shell>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      setFormError(error);
      return;
    }
    // On success the AuthProvider picks up the new session; this component
    // re-renders and the admin check / redirect above takes over.
  };

  // Not signed in: email + password form (Supabase Auth).
  return (
    <Shell settings={settings}>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-4 bg-charcoal p-8 border border-ivory/10 text-left"
      >
        <h1 className="text-xl text-ivory font-serif text-center">Admin sign-in</h1>

        {formError && (
          <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2">
            {formError}
          </p>
        )}

        <label className="flex flex-col gap-1 text-xs text-beige/70">
          Email
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-noir border border-ivory/15 px-3 py-2 text-sm text-ivory outline-none focus:border-gold"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs text-beige/70">
          Password
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-noir border border-ivory/15 px-3 py-2 text-sm text-ivory outline-none focus:border-gold"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 inline-flex items-center justify-center gap-2 bg-ivory text-noir px-6 py-3 text-sm font-medium hover:bg-gold transition-colors disabled:opacity-50"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </Shell>
  );
}
