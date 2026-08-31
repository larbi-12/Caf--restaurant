import { useLayoutEffect, useMemo, useRef, useState } from "react";
import PageHero from "../components/ui/PageHero";
import DishCard from "../components/ui/DishCard";
import { useMenuItems, useCategories } from "../hooks/useMenu";
import { gsap } from "../lib/gsap";

export default function Menu() {
  const { items, loading } = useMenuItems();
  const { categories } = useCategories();
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [query, setQuery] = useState("");
  const gridRef = useRef(null);

  const filtered = useMemo(() => {
    return items.filter((d) => {
      const categoryName = d.category?.name || "";
      const matchesCategory = activeCategory === "Tous" || categoryName === activeCategory;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        (d.description || "").toLowerCase().includes(q) ||
        categoryName.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [items, activeCategory, query]);

  useLayoutEffect(() => {
    if (!gridRef.current) return;
    gsap.fromTo(
      gridRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" }
    );
  }, [activeCategory, query, items]);

  return (
    <div>
      <PageHero
        eyebrow="La carte"
        title="Notre menu"
        description="Cuisine marocaine contemporaine, café premium et créations signature."
        image="https://images.unsplash.com/photo-1544025162-d76694265947?w=1600&q=80"
      />

      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 md:py-20">
        <div className="flex flex-col gap-8 mb-12">
          <div className="max-w-md">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un plat..."
              aria-label="Rechercher un plat"
              className="w-full border-b border-noir/20 focus:border-noir py-3 bg-transparent outline-none text-lg placeholder:text-noir/40"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {["Tous", ...categories.map((c) => c.name)].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 text-sm uppercase tracking-wide border transition-colors ${
                  activeCategory === cat
                    ? "bg-noir text-ivory border-noir"
                    : "border-noir/20 text-noir/70 hover:border-noir hover:text-noir"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {!loading && items.length === 0 ? (
          <p className="text-noir/60 text-center py-24 text-lg">Aucun plat disponible pour le moment.</p>
        ) : filtered.length === 0 ? (
          <p className="text-noir/60 text-center py-24 text-lg">Aucun plat trouvé.</p>
        ) : (
          <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filtered.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
