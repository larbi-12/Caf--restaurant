import Reveal from "../ui/Reveal";
import Button from "../ui/Button";
import { restaurant } from "../../data/restaurant";

export default function ChefMoment() {
  const { chef } = restaurant;

  return (
    <section className="bg-noir py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <Reveal className="relative aspect-[4/5] overflow-hidden">
          <img src={chef.image} alt={chef.name} className="w-full h-full object-cover" loading="lazy" />
        </Reveal>

        <div className="flex flex-col gap-6">
          <Reveal><span className="eyebrow text-gold">{chef.role}</span></Reveal>
          <Reveal><h2 className="text-4xl md:text-5xl text-ivory leading-[1.1]">{chef.name}</h2></Reveal>
          <Reveal>
            <p className="font-serif text-2xl text-sable italic leading-snug">« {chef.quote} »</p>
          </Reveal>
          <Reveal>
            <p className="text-beige/70 leading-relaxed">{chef.bio}</p>
          </Reveal>
          <Reveal>
            <Button to="/notre-histoire" variant="outline" className="border-ivory/40 text-ivory hover:bg-ivory hover:text-noir w-fit">
              Découvrir son parcours
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
