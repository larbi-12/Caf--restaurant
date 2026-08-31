import { Navigate, useLocation } from "react-router-dom";
import { SignIn } from "@clerk/clerk-react";
import { useAuth } from "../../context/AuthContext";
import { useRestaurantSettings } from "../../hooks/useRestaurantSettings";

const clerkAppearance = {
  variables: {
    colorPrimary: "#b08a4e",
    colorBackground: "#211c18",
    colorText: "#fbf8f2",
    colorTextSecondary: "#e7dcc4",
    colorInputBackground: "#14110f",
    colorInputText: "#fbf8f2",
    borderRadius: "0px",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  elements: {
    card: "shadow-none border border-white/10",
    headerTitle: "font-serif",
    footerActionLink: "text-[#b08a4e] hover:text-[#e7dcc4]",
  },
};

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
  const { user, isAdmin, loading, isConfigured, isClerkConfigured, isSupabaseConfigured, signOut } = useAuth();
  const { settings } = useRestaurantSettings();
  const location = useLocation();

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
            {!isClerkConfigured && "VITE_CLERK_PUBLISHABLE_KEY is not set. "}
            {!isSupabaseConfigured && "VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set. "}
            See the README to configure .env.local.
          </p>
        </div>
      </Shell>
    );
  }

  // Still resolving Clerk session / admin_users lookup.
  if (loading) {
    return (
      <Shell settings={settings}>
        <span className="eyebrow text-gold animate-pulse">Loading...</span>
      </Shell>
    );
  }

  // Signed in with Clerk, but this email is not in admin_users. Stay right here
  // on /admin/login — never bounce to the public homepage — and keep the Clerk
  // session alive until the user explicitly chooses to sign out.
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

  // Not signed in at all: show Clerk's sign-in UI, staying on this same route
  // after a successful authentication so the admin check above can run.
  return (
    <Shell settings={settings}>
      <SignIn routing="hash" appearance={clerkAppearance} fallbackRedirectUrl="/admin/login" forceRedirectUrl="/admin/login" />
    </Shell>
  );
}
