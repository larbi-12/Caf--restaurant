import SectionHeading from "../ui/SectionHeading";
import TestimonialsCarousel from "../ui/TestimonialsCarousel";

export default function TestimonialsSection() {
  return (
    <section className="bg-beige/40 py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col gap-14">
        <SectionHeading eyebrow="Avis" title="Nos invités parlent de nous." align="center" />
        <TestimonialsCarousel />
      </div>
    </section>
  );
}
