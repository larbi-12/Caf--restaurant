import { Link } from "react-router-dom";
import { useRestaurantSettings } from "../../hooks/useRestaurantSettings";
import Newsletter from "../ui/Newsletter";

export default function Footer() {
  const { settings } = useRestaurantSettings();
  if (!settings) return null;

  return (
    <footer className="bg-noir text-ivory">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <span className="font-serif text-2xl">{settings.restaurant_name}</span>
          <p className="text-beige/70 text-sm leading-relaxed max-w-xs">
            {settings.description || `Restaurant & café premium à ${settings.city}.`}
          </p>
          <div className="flex gap-4 mt-2 text-sm text-beige/70">
            {settings.instagram_url && (
              <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">
                Instagram
              </a>
            )}
            {settings.facebook_url && (
              <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">
                Facebook
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="eyebrow text-sable">Navigation</span>
          <Link to="/" className="text-beige/80 hover:text-gold text-sm transition-colors">Accueil</Link>
          <Link to="/notre-histoire" className="text-beige/80 hover:text-gold text-sm transition-colors">Notre histoire</Link>
          <Link to="/galerie" className="text-beige/80 hover:text-gold text-sm transition-colors">Galerie</Link>
          <Link to="/journal" className="text-beige/80 hover:text-gold text-sm transition-colors">Journal</Link>
        </div>

        <div className="flex flex-col gap-3">
          <span className="eyebrow text-sable">Menu &amp; Expériences</span>
          <Link to="/menu" className="text-beige/80 hover:text-gold text-sm transition-colors">La carte</Link>
          <Link to="/experiences" className="text-beige/80 hover:text-gold text-sm transition-colors">Expériences</Link>
          <Link to="/evenements" className="text-beige/80 hover:text-gold text-sm transition-colors">Événements</Link>
          <Link to="/reservation" className="text-beige/80 hover:text-gold text-sm transition-colors">Réserver</Link>
        </div>

        <div className="flex flex-col gap-3">
          <span className="eyebrow text-sable">Contact</span>
          <a href={`tel:${settings.phone}`} className="text-beige/80 hover:text-gold text-sm transition-colors">
            {settings.phone}
          </a>
          <a href={`mailto:${settings.email}`} className="text-beige/80 hover:text-gold text-sm transition-colors">
            {settings.email}
          </a>
          <p className="text-beige/60 text-sm">{settings.address}</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-12 flex flex-col gap-3">
        <span className="eyebrow text-sable">Newsletter</span>
        <p className="text-beige/70 text-sm max-w-sm">Recevez nos nouveautés et événements.</p>
        <Newsletter light />
      </div>

      <div className="border-t border-ivory/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-beige/50">
          <span>© {new Date().getFullYear()} {settings.restaurant_name}. Tous droits réservés.</span>
          <span>{settings.city}, {settings.country}</span>
        </div>
      </div>
    </footer>
  );
}
