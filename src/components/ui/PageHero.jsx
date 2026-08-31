import { useLayoutEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";

export default function PageHero({ eyebrow, title, description, image, height = "h-[52vh]" }) {
  const imgRef = useRef(null);
  const textRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(imgRef.current, { scale: 1.15 }, { scale: 1, duration: 1.6, ease: "power3.out" });
      gsap.fromTo(
        textRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: "power3.out", delay: 0.2 }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className={`relative w-full ${height} min-h-[380px] flex items-end overflow-hidden bg-noir`}>
      {image && (
        <div ref={imgRef} className="absolute inset-0">
          <img src={image} alt="" className="w-full h-full object-cover opacity-60" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/30 to-noir/10" />
        </div>
      )}
      <div ref={textRef} className="relative max-w-[1400px] mx-auto px-6 lg:px-10 pb-14 w-full flex flex-col gap-4">
        {eyebrow && <span className="eyebrow text-gold">{eyebrow}</span>}
        <h1 className="text-4xl md:text-6xl text-ivory max-w-3xl">{title}</h1>
        {description && <p className="text-beige/80 max-w-xl text-base md:text-lg">{description}</p>}
      </div>
    </section>
  );
}
