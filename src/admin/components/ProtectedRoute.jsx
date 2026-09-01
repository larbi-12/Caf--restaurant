import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, isAdmin, loading, isConfigured, isSupabaseConfigured } = useAuth();
  const location = useLocation();

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-noir text-ivory px-6 text-center">
        <div className="max-w-md flex flex-col gap-4">
          <span className="eyebrow text-gold">Configuration requise</span>
          <h1 className="text-2xl font-serif">L'administration n'est pas configurée</h1>
          <p className="text-beige/70 text-sm">
            {!isSupabaseConfigured &&
              "Ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env.local pour activer l'authentification et la base de données. "}
            Voir le README.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-noir text-ivory">
        <span className="eyebrow text-gold animate-pulse">Chargement...</span>
      </div>
    );
  }

  // Not signed in, or signed in but not an authorized admin: send to /admin/login
  // in both cases. Login.jsx is the single place that renders the sign-in form vs.
  // the access-denied state — never redirect to the public homepage here.
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
