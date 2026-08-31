import PageHero from "../components/ui/PageHero";
import Reveal from "../components/ui/Reveal";
import Button from "../components/ui/Button";
import { restaurant } from "../data/restaurant";

const chapters = [
  {
    title: "Origine",
    text: "Maison Noor est née d'un désir simple : offrir à Marrakech une table qui célèbre l'identité marocaine sans jamais se figer dans le passé. Le projet a pris forme en 2014, porté par une équipe de passionnés du patrimoine culinaire national.",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200&q=80",
  },
  {
    title: "Philosophie",
    text: "Ici, la tradition n'est pas un décor mais un point de départ. Chaque recette est retravaillée avec exigence, en conservant l'âme du plat tout en affinant sa texture, son équilibre et sa présentation.",
    image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200&q=80",
  },
  {
    title: "Cuisine",
    text: "Notre cuisine ouverte permet aux convives d'observer le geste des cuisiniers. Une transparence assumée, à l'image de notre approche : rien à cacher, tout à révéler.",
    image: "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=1200&q=80",
  },
  {
    title: "Le Chef",
    text: `${restaurant.chef.name}, formé entre Marrakech, Lyon et Tokyo, dirige les cuisines de Maison Noor depuis 2018. Sa vision : une cuisine marocaine qui se réinvente sans se renier.`,
    image: restaurant.chef.image,
  },
  {
    title: "Produits",
    text: "Safran de Taliouine, huile d'argan d'Essaouira, amandes de la vallée du Draa : nous travaillons en direct avec des producteurs marocains rigoureusement sélectionnés.",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=80",
  },
  {
    title: "Tradition & Innovation",
    text: "Entre le geste ancestral de la warqa et les techniques de cuisson contemporaines, Maison Noor construit un pont entre deux mondes qui se répondent plus qu'ils ne s'opposent.",
    image: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=1200&q=80",
  },
];

export default function Story() {
  return (
    <div>
      <PageHero
        eyebrow="Notre histoire"
        title="L'histoire de Maison Noor"
        description="Un dialogue entre héritage marocain et création contemporaine."
        image="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1600&q=80"
        height="h-[46vh]"
      />

      <div className="max-w-[1300px] mx-auto px-6 lg:px-10 py-20 md:py-28 flex flex-col gap-24 md:gap-32">
        {chapters.map((c, i) => (
          <div
            key={c.title}
            className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${
              i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            <Reveal className="aspect-[4/3] overflow-hidden">
              <img src={c.image} alt={c.title} loading="lazy" className="w-full h-full object-cover" />
            </Reveal>
            <div className="flex flex-col gap-5">
              <Reveal><span className="eyebrow text-gold">0{i + 1}</span></Reveal>
              <Reveal><h2 className="text-3xl md:text-4xl">{c.title}</h2></Reveal>
              <Reveal><p className="text-noir/70 leading-relaxed text-lg">{c.text}</p></Reveal>
            </div>
          </div>
        ))}

        <Reveal className="text-center flex flex-col items-center gap-6 pt-8">
          <h2 className="text-3xl md:text-4xl max-w-xl">Venez écrire un chapitre de plus avec nous.</h2>
          <Button to="/reservation">Réserver une table</Button>
        </Reveal>
      </div>
    </div>
  );
}
