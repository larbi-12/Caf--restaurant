import { useEffect } from "react";

export default function Lightbox({ images, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    if (index === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, onClose, onPrev, onNext]);

  if (index === null) return null;
  const img = images[index];

  return (
    <div
      className="fixed inset-0 z-[70] bg-noir/95 flex items-center justify-center px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        aria-label="Fermer"
        onClick={onClose}
        className="absolute top-6 right-6 text-ivory text-3xl leading-none hover:text-gold transition-colors"
      >
        ×
      </button>

      <button
        aria-label="Image précédente"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-4 md:left-8 text-ivory text-3xl hover:text-gold transition-colors"
      >
        ←
      </button>

      <div className="max-w-4xl w-full flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
        <img src={img.src} alt={img.alt} className="max-h-[80vh] w-auto mx-auto object-contain" />
        <p className="text-beige/70 text-sm">
          {index + 1} / {images.length} — {img.alt}
        </p>
      </div>

      <button
        aria-label="Image suivante"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-4 md:right-8 text-ivory text-3xl hover:text-gold transition-colors"
      >
        →
      </button>
    </div>
  );
}
