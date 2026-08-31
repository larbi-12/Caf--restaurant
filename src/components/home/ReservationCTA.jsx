import Reveal from "../ui/Reveal";
import Button from "../ui/Button";

export default function ReservationCTA() {
  return (
    <section className="relative py-28 md:py-36 bg-noir overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1592861956120-e524fc739696?w=1600&q=80"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-25"
      />
      <div className="relative max-w-2xl mx-auto px-6 text-center flex flex-col items-center gap-6">
        <Reveal><span className="eyebrow text-gold">Réservation</span></Reveal>
        <Reveal>
          <h2 className="text-4xl md:text-6xl text-ivory leading-[1.1]">
            Votre table vous attend.
          </h2>
        </Reveal>
        <Reveal>
          <p className="text-beige/75 text-lg">
            Réservez en quelques instants et vivez l'expérience Maison Noor.
          </p>
        </Reveal>
        <Reveal>
          <Button to="/reservation" variant="light" className="mt-2">
            Réserver une table
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
