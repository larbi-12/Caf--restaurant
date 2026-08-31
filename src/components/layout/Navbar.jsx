import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { gsap } from "../../lib/gsap";
import { useRestaurantSettings } from "../../hooks/useRestaurantSettings";
import MobileMenu from "./MobileMenu";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/notre-histoire", label: "Notre histoire" },
  { to: "/menu", label: "Menu" },
  { to: "/experiences", label: "Expériences" },
  { to: "/evenements", label: "Événements" },
  { to: "/galerie", label: "Galerie" },
  { to: "/journal", label: "Journal" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { settings } = useRestaurantSettings();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const transparent = isHome && !scrolled && !mobileOpen;

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          transparent
            ? "bg-transparent border-b border-transparent py-6"
            : "bg-ivory/90 backdrop-blur-md border-b border-noir/10 py-4"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between">
          <Link
            to="/"
            className={`font-serif text-xl md:text-2xl tracking-wide transition-colors ${
              transparent ? "text-ivory" : "text-noir"
            }`}
          >
            {settings?.restaurant_name || "Maison Noor"}
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `text-[13px] tracking-wide uppercase transition-colors relative py-1 ${
                    transparent ? "text-ivory/85 hover:text-ivory" : "text-noir/70 hover:text-noir"
                  } ${isActive ? (transparent ? "!text-ivory" : "!text-noir") : ""}`
                }
              >
                {({ isActive }) => (
                  <span className="relative">
                    {l.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-px bg-gold transition-all duration-300 ${
                        isActive ? "w-full" : "w-0"
                      }`}
                    />
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <Link
              to="/reservation"
              className={`hidden md:inline-flex items-center px-6 py-2.5 text-[13px] tracking-wide uppercase border transition-all duration-300 ${
                transparent
                  ? "border-ivory/60 text-ivory hover:bg-ivory hover:text-noir"
                  : "border-noir/30 text-noir hover:bg-noir hover:text-ivory"
              }`}
            >
              Réserver une table
            </Link>

            <button
              aria-label="Ouvrir le menu"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden flex flex-col gap-1.5 w-8 h-8 items-end justify-center"
            >
              <span className={`block h-px w-7 transition-colors ${transparent ? "bg-ivory" : "bg-noir"}`} />
              <span className={`block h-px w-5 transition-colors ${transparent ? "bg-ivory" : "bg-noir"}`} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} links={links} settings={settings} />
    </>
  );
}
