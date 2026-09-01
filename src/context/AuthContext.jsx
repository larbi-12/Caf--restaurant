import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const AuthContext = createContext(null);

const baseValue = {
  user: null,
  isSignedIn: false,
  isAdmin: false,
  loading: false,
  isConfigured: false,
  isSupabaseConfigured,
  signIn: async () => ({ error: "not_configured" }),
  signOut: async () => {},
};

/** Used when Supabase env vars are missing — `supabase` is null, never touched. */
function UnconfiguredAuthProvider({ children }) {
  return <AuthContext.Provider value={baseValue}>{children}</AuthContext.Provider>;
}

function SupabaseAuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);

  const email = session?.user?.email || null;

  // Load the persisted session once, then stay in sync with sign-in / sign-out /
  // token refresh events.
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session ?? null);
      setSessionLoaded(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next ?? null);
      setSessionLoaded(true);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const checkAdmin = useCallback(async () => {
    // Being signed in is not sufficient on its own — the email must also be in
    // the admin_users whitelist. This SELECT is gated by Postgres RLS
    // (is_admin(), which reads the email from the Supabase session JWT), so it
    // only returns a row for a genuine admin.
    const normalizedEmail = email?.trim().toLowerCase() || null;
    if (!normalizedEmail) {
      setIsAdmin(false);
      setAdminChecked(true);
      return;
    }
    const { data, error } = await supabase
      .from("admin_users")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();
    if (error) {
      // e.g. the signed-in email is missing from admin_users, or the Vercel env
      // vars point at another Supabase project. Surface it instead of silently
      // treating the user as non-admin.
      console.warn("[Maison Noor] admin_users lookup failed:", error.message);
    }
    setIsAdmin(Boolean(data) && !error);
    setAdminChecked(true);
  }, [email]);

  useEffect(() => {
    if (!sessionLoaded) return;
    if (!session) {
      setIsAdmin(false);
      setAdminChecked(true);
      return;
    }
    setAdminChecked(false);
    checkAdmin();
  }, [sessionLoaded, session, checkAdmin]);

  const signIn = useCallback(async (emailInput, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: emailInput.trim().toLowerCase(),
      password,
    });
    return { error: error ? error.message : null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setAdminChecked(true);
  }, []);

  const loading = !sessionLoaded || (Boolean(session) && !adminChecked);

  const value = {
    user: session
      ? {
          email,
          fullName: session.user?.user_metadata?.full_name || email,
          imageUrl: session.user?.user_metadata?.avatar_url || null,
        }
      : null,
    isSignedIn: Boolean(session),
    isAdmin,
    loading,
    isConfigured: isSupabaseConfigured,
    isSupabaseConfigured,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }) {
  if (!isSupabaseConfigured) {
    return <UnconfiguredAuthProvider>{children}</UnconfiguredAuthProvider>;
  }
  return <SupabaseAuthProvider>{children}</SupabaseAuthProvider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
