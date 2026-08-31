import Reveal from "../ui/Reveal";
import Button from "../ui/Button";
import { useRestaurantSettings } from "../../hooks/useRestaurantSettings";

export default function Introduction() {
  const { settings } = useRestaurantSettings();
  if (!settings) return null;

  return (
    <section className="bg-ivory py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <Reveal className="relative aspect-[4/5] overflow-hidden order-2 md:order-1">
          <img
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80"
            alt={`Intérieur chaleureux de ${settings.restaurant_name}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </Reveal>

        <div className="flex flex-col gap-6 order-1 md:order-2">
          <Reveal><span className="eyebrow text-gold">Bienvenue chez {settings.restaurant_name}</span></Reveal>
          <Reveal><h2 className="text-4xl md:text-5xl leading-[1.1]">Une cuisine entre tradition et création.</h2></Reveal>
          <Reveal>
            <p className="text-noir/70 leading-relaxed text-base md:text-lg">
              Au cœur de {settings.city}, {settings.restaurant_name} réinvente la table marocaine. Chaque assiette
              raconte le dialogue entre un héritage culinaire précieux et une écriture résolument contemporaine,
              portée par des produits sélectionnés à la source dans tout le pays.
            </p>
          </Reveal>
          <Reveal>
            <Button to="/notre-histoire" variant="ghost" className="px-0">
              Découvrir notre histoire →
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
