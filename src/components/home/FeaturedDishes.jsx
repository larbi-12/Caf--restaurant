import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import DishCard from "../ui/DishCard";
import Button from "../ui/Button";
import { useMenuItems } from "../../hooks/useMenu";

export default function FeaturedDishes() {
  const { items, loading } = useMenuItems();
  const dishes = items.filter((d) => d.is_featured).slice(0, 4);

  if (!loading && dishes.length === 0) return null;

  return (
    <section className="bg-ivory py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col gap-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading eyebrow="La carte" title="Nos signatures" />
          <Reveal>
            <Button to="/menu" variant="ghost" className="px-0">
              Voir toute la carte →
            </Button>
          </Reveal>
        </div>

        <Reveal className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10" stagger={0.12}>
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
