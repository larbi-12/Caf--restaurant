import { Link } from "react-router-dom";

export default function DishCard({ dish }) {
  return (
    <Link
      to={`/menu/${dish.slug}`}
      className="group flex flex-col gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      <div className="relative overflow-hidden aspect-[4/5] bg-beige/30">
        <img
          src={dish.image_url}
          alt={dish.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-noir/0 group-hover:bg-noir/20 transition-colors duration-500" />
        {dish.category?.name && (
          <span className="absolute top-4 left-4 eyebrow bg-ivory/90 text-noir px-3 py-1">{dish.category.name}</span>
        )}
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl text-noir group-hover:text-gold transition-colors">{dish.name}</h3>
          <p className="text-sm text-noir/60 mt-1 line-clamp-2">{dish.description}</p>
        </div>
        <span className="font-serif text-lg text-terracotta shrink-0">{dish.price} MAD</span>
      </div>
      <span className="text-xs uppercase tracking-wide text-noir/50 group-hover:text-gold transition-colors">
        Voir le plat →
      </span>
    </Link>
  );
}
