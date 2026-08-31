import Reveal from "../ui/Reveal";
import Button from "../ui/Button";
import { useRestaurantSettings, mapsEmbedUrl } from "../../hooks/useRestaurantSettings";

export default function LocationSection() {
  const { settings } = useRestaurantSettings();
  if (!settings) return null;

  return (
    <section className="bg-ivory py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-10 items-stretch">
        <Reveal className="flex flex-col gap-6 justify-center">
          <span className="eyebrow text-gold">Nous trouver</span>
          <h2 className="text-4xl md:text-5xl leading-[1.1]">{settings.city}, {settings.country}</h2>
          <p className="text-noir/70 leading-relaxed max-w-md">{settings.address}</p>
          <div className="flex flex-col gap-1 text-noir/70">
            {(settings.opening_hours || []).map((h) => (
              <div key={h.day} className="flex justify-between max-w-sm text-sm border-b border-noir/10 py-2">
                <span>{h.day}</span>
                <span>{h.time}</span>
              </div>
            ))}
          </div>
          <Button href={settings.google_maps_url} variant="outline" className="w-fit mt-2">
            Itinéraire →
          </Button>
        </Reveal>

        <Reveal className="min-h-[320px] overflow-hidden">
          <iframe
            title={`Localisation ${settings.restaurant_name}`}
            src={mapsEmbedUrl(settings)}
            className="w-full h-full min-h-[320px] border-0 grayscale hover:grayscale-0 transition-all duration-500"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      </div>
    </section>
  );
}
