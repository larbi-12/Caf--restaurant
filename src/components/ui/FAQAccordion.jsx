import { useState, useRef } from "react";

function FAQItem({ item, isOpen, onToggle }) {
  const contentRef = useRef(null);

  return (
    <div className="border-b border-noir/10">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-6 py-6 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-serif text-lg md:text-xl text-noir">{item.q}</span>
        <span
          className={`shrink-0 text-2xl text-gold transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>
      <div
        ref={contentRef}
        style={{
          maxHeight: isOpen ? contentRef.current?.scrollHeight + "px" : "0px",
        }}
        className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
      >
        <p className="pb-6 text-noir/65 leading-relaxed max-w-2xl">{item.a}</p>
      </div>
    </div>
  );
}

export default function FAQAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="flex flex-col">
      {items.map((item, i) => (
        <FAQItem
          key={i}
          item={item}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
        />
      ))}
    </div>
  );
}
