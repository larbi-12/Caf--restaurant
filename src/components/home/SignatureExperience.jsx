import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";

const items = [
  {
    title: "Le goût",
    text: "Des saveurs précises, construites autour de produits marocains sélectionnés avec exigence.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80",
  },
  {
    title: "L'atmosphère",
    text: "Un espace pensé comme un écrin contemporain, entre lumière chaude et matières brutes.",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=900&q=80",
  },
  {
    title: "Le service",
    text: "Une équipe attentive, formée à révéler chaque plat avec justesse et sans emphase.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80",
  },
];

export default function SignatureExperience() {
  return (
    <section className="bg-beige/40 py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col gap-14">
        <SectionHeading
          eyebrow="L'expérience Maison Noor"
          title="Une expérience qui commence avant la première bouchée."
          align="center"
        />

        <Reveal className="grid md:grid-cols-3 gap-8" stagger={0.15}>
          {items.map((item) => (
            <div key={item.title} className="group relative overflow-hidden aspect-[3/4]">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir/85 via-noir/20 to-transparent group-hover:from-noir/95 transition-colors duration-500" />
              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col gap-2 transition-transform duration-500 group-hover:-translate-y-2">
                <h3 className="font-serif text-2xl text-ivory">{item.title}</h3>
                <p className="text-beige/70 text-sm leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
