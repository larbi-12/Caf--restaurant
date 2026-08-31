import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { ClerkProvider, useUser, useClerk, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const AuthContext = createContext(null);

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = Boolean(CLERK_PUBLISHABLE_KEY);

const baseValue = {
  user: null,
  isSignedIn: false,
  isAdmin: false,
  loading: false,
  isConfigured: false,
  isClerkConfigured,
  isSupabaseConfigured,
  signOut: async () => {},
};

/** Used when Clerk isn't configured yet — never touches Clerk hooks/ClerkProvider. */
function UnconfiguredAuthProvider({ children }) {
  return <AuthContext.Provider value={baseValue}>{children}</AuthContext.Provider>;
}

function ClerkBridgeAuthProvider({ children }) {
  const { isLoaded: clerkLoaded, isSignedIn } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const { signOut: clerkSignOut } = useClerk();

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);

  const email = clerkUser?.primaryEmailAddress?.emailAddress || null;

  const checkAdmin = useCallback(async () => {
    if (!email || !isSupabaseConfigured) {
      setIsAdmin(false);
      setAdminChecked(true);
      return;
    }
    // Explicit, server-verified authorization check — being signed in with Clerk
    // is not sufficient on its own. This query only returns a row if Postgres RLS
    // (is_admin(), driven by the Clerk JWT bridged into Supabase) allows it, i.e.
    // the signed-in email is actually present in admin_users.
    const { data } = await supabase.from("admin_users").select("id").eq("email", email).maybeSingle();
    setIsAdmin(Boolean(data));
    setAdminChecked(true);
  }, [email]);

  useEffect(() => {
    if (!clerkLoaded) return;
    if (!isSignedIn) {
      setIsAdmin(false);
      setAdminChecked(true);
      return;
    }
    setAdminChecked(false);
    checkAdmin();
  }, [clerkLoaded, isSignedIn, checkAdmin]);

  const signOut = useCallback(async () => {
    // Explicit redirectUrl so Clerk's own post-sign-out navigation never lands the
    // user on the public homepage — it returns them to the admin login screen.
    await clerkSignOut({ redirectUrl: "/admin/login" });
  }, [clerkSignOut]);

  const loading = !clerkLoaded || (isSignedIn && !adminChecked);

  const value = {
    user: isSignedIn
      ? {
          email,
          fullName: clerkUser?.fullName || email,
          imageUrl: clerkUser?.imageUrl || null,
        }
      : null,
    isSignedIn: Boolean(isSignedIn),
    isAdmin,
    loading,
    isConfigured: isClerkConfigured && isSupabaseConfigured,
    isClerkConfigured,
    isSupabaseConfigured,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }) {
  if (!isClerkConfigured) {
    return <UnconfiguredAuthProvider>{children}</UnconfiguredAuthProvider>;
  }
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} signInUrl="/admin/login" signInFallbackRedirectUrl="/admin/login">
      <ClerkBridgeAuthProvider>{children}</ClerkBridgeAuthProvider>
    </ClerkProvider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
