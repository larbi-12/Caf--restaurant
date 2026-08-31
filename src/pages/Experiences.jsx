import { Link } from "react-router-dom";
import PageHero from "../components/ui/PageHero";
import Reveal from "../components/ui/Reveal";
import { useExperiences } from "../hooks/useExperiences";

export default function Experiences() {
  const { experiences, loading } = useExperiences();

  return (
    <div>
      <PageHero
        eyebrow="Expériences"
        title="Des moments sur-mesure"
        description="Dîner privé, brunch, tea time, Chef's Table ou événements privés."
        image="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1600&q=80"
        height="h-[46vh]"
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 md:py-28 flex flex-col gap-20 md:gap-28">
        {!loading && experiences.length === 0 && (
          <p className="text-noir/60 text-center py-16 text-lg">Aucune expérience disponible pour le moment.</p>
        )}
        {experiences.map((exp, i) => (
          <div
            key={exp.slug}
            className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${
              i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            <Reveal className="relative aspect-[4/3] overflow-hidden group">
              <img src={exp.image_url} alt={exp.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </Reveal>
            <div className="flex flex-col gap-5">
              <Reveal><span className="eyebrow text-gold">{exp.duration} — {exp.capacity}</span></Reveal>
              <Reveal><h2 className="text-3xl md:text-4xl">{exp.title}</h2></Reveal>
              <Reveal><p className="text-noir/70 leading-relaxed text-lg">{exp.long_description || exp.description}</p></Reveal>
              <Reveal><p className="font-serif text-2xl text-terracotta">{exp.price}</p></Reveal>
              <Reveal>
                <Link
                  to={`/experiences/${exp.slug}`}
                  className="inline-flex w-fit px-7 py-3.5 text-sm tracking-wide uppercase border border-noir/30 text-noir hover:bg-noir hover:text-ivory transition-all duration-300"
                >
                  Découvrir
                </Link>
              </Reveal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
