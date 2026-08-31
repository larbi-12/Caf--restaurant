import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import Reveal from "../components/ui/Reveal";
import Button from "../components/ui/Button";
import DishCard from "../components/ui/DishCard";
import { useMenuItemBySlug, useMenuItems } from "../hooks/useMenu";

export default function DishDetail() {
  const { slug } = useParams();
  const { item: dish, loading } = useMenuItemBySlug(slug);
  const { items } = useMenuItems();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return null;
  if (!dish) return <Navigate to="/menu" replace />;

  const related = items
    .filter((d) => d.category?.name === dish.category?.name && d.id !== dish.id)
    .slice(0, 3);

  return (
    <div className="pt-28 md:pt-32 pb-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-12 md:gap-20">
        <Reveal className="aspect-[4/5] overflow-hidden bg-beige/30">
          <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
        </Reveal>

        <div className="flex flex-col gap-6">
          {dish.category?.name && <Reveal><span className="eyebrow text-gold">{dish.category.name}</span></Reveal>}
          <Reveal><h1 className="text-4xl md:text-5xl leading-[1.1]">{dish.name}</h1></Reveal>
          <Reveal><p className="font-serif text-3xl text-terracotta">{dish.price} MAD</p></Reveal>
          <Reveal><p className="text-noir/70 leading-relaxed text-lg">{dish.long_description || dish.description}</p></Reveal>

          {dish.ingredients?.length > 0 && (
            <Reveal className="flex flex-col gap-2">
              <span className="text-sm uppercase tracking-wide text-noir/50">Ingrédients</span>
              <p className="text-noir/80">{dish.ingredients.join(", ")}</p>
            </Reveal>
          )}

          <Reveal className="flex flex-col gap-2">
            <span className="text-sm uppercase tracking-wide text-noir/50">Allergènes</span>
            <p className="text-noir/80">
              {dish.allergens?.length ? dish.allergens.join(", ") : "Aucun allergène majeur signalé"}
            </p>
          </Reveal>

          <Reveal>
            <Button to="/reservation" className="mt-2">Réserver une table</Button>
          </Reveal>
        </div>
      </div>

      {related.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 mt-24">
          <Reveal><h2 className="text-3xl mb-10">Plats similaires</h2></Reveal>
          <Reveal className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8" stagger={0.1}>
            {related.map((d) => (
              <DishCard key={d.id} dish={d} />
            ))}
          </Reveal>
        </div>
      )}
    </div>
  );
}
