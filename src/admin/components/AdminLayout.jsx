import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useRestaurantSettings } from "../../hooks/useRestaurantSettings";

const navItems = [
  { to: "/admin", label: "Dashboard", end: true, icon: "◧" },
  { to: "/admin/reservations", label: "Réservations", icon: "☰" },
  { to: "/admin/messages", label: "Messages", icon: "✉" },
  { to: "/admin/menu", label: "Menu", icon: "◈" },
  { to: "/admin/categories", label: "Catégories", icon: "▤" },
  { to: "/admin/experiences", label: "Expériences", icon: "✦" },
  { to: "/admin/events", label: "Événements", icon: "◷" },
  { to: "/admin/gallery", label: "Galerie", icon: "▦" },
  { to: "/admin/articles", label: "Articles", icon: "✎" },
  { to: "/admin/testimonials", label: "Témoignages", icon: "❝" },
  { to: "/admin/faqs", label: "FAQ", icon: "?" },
  { to: "/admin/settings", label: "Paramètres", icon: "⚙" },
];

function SidebarContent({ onNavigate, restaurantName }) {
  return (
    <>
      <div className="px-6 py-6 border-b border-neutral-800">
        <span className="font-serif text-xl text-white">{restaurantName}</span>
        <p className="text-neutral-500 text-xs uppercase tracking-wide mt-1">Administration</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                isActive ? "bg-white/10 text-white border-r-2 border-gold" : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <span className="w-4 text-center">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-6 py-4 border-t border-neutral-800">
        <a href="/" target="_blank" rel="noreferrer" className="text-neutral-500 text-xs hover:text-white transition-colors">
          Voir le site public →
        </a>
      </div>
    </>
  );
}

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const { settings } = useRestaurantSettings();
  const restaurantName = settings?.restaurant_name || "Maison Noor";
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-neutral-900 fixed inset-y-0">
        <SidebarContent restaurantName={restaurantName} />
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-neutral-900 flex flex-col">
            <SidebarContent onNavigate={() => setDrawerOpen(false)} restaurantName={restaurantName} />
          </aside>
        </div>
      )}

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden w-8 h-8 flex flex-col justify-center gap-1.5"
            aria-label="Ouvrir le menu"
          >
            <span className="block h-px w-6 bg-neutral-900" />
            <span className="block h-px w-6 bg-neutral-900" />
          </button>

          <span className="font-serif text-neutral-900 hidden sm:block">{restaurantName}</span>

          <div className="flex items-center gap-3">
            {user?.imageUrl && (
              <img src={user.imageUrl} alt="" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
            )}
            <div className="hidden sm:block text-right">
              <p className="text-sm text-neutral-900 leading-tight">{user?.fullName || user?.email}</p>
              <p className="text-xs text-neutral-500 leading-tight">{user?.email}</p>
            </div>
            <button
              onClick={signOut}
              className="text-xs uppercase tracking-wide text-neutral-500 hover:text-neutral-900 border border-neutral-200 px-3 py-2 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
