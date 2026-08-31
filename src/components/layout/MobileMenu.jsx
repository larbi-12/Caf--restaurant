import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "../../lib/gsap";

export default function MobileMenu({ open, onClose, links, settings }) {
  const overlayRef = useRef(null);
  const itemsRef = useRef([]);

  useLayoutEffect(() => {
    if (!overlayRef.current) return;

    if (open) {
      document.body.style.overflow = "hidden";
      const tl = gsap.timeline();
      tl.set(overlayRef.current, { display: "flex" });
      tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
      tl.fromTo(
        itemsRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out" },
        "-=0.2"
      );
    } else {
      document.body.style.overflow = "";
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          if (overlayRef.current) overlayRef.current.style.display = "none";
        },
      });
    }
  }, [open]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] bg-noir flex-col justify-between px-6 py-8"
      style={{ display: "none" }}
    >
      <div className="flex items-center justify-between">
        <span className="font-serif text-xl text-ivory">{settings?.restaurant_name || "Maison Noor"}</span>
        <button aria-label="Fermer le menu" onClick={onClose} className="text-ivory text-3xl leading-none">
          ×
        </button>
      </div>

      <nav className="flex flex-col gap-5 my-auto">
        {links.map((l, i) => (
          <Link
            key={l.to}
            ref={(el) => (itemsRef.current[i] = el)}
            to={l.to}
            onClick={onClose}
            className="font-serif text-4xl text-ivory hover:text-gold transition-colors"
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div ref={(el) => (itemsRef.current[links.length] = el)} className="flex flex-col gap-4">
        <Link
          to="/reservation"
          onClick={onClose}
          className="inline-flex justify-center px-6 py-4 border border-ivory/40 text-ivory uppercase text-sm tracking-wide"
        >
          Réserver une table
        </Link>
        <p className="text-beige/60 text-sm text-center">{settings?.phone}</p>
      </div>
    </div>
  );
}
