import { useState } from "react";
import { useRestaurantSettings } from "../../hooks/useRestaurantSettings";

export default function WhatsAppButton() {
  const { settings } = useRestaurantSettings();
  const [hover, setHover] = useState(false);
  const message = encodeURIComponent(
    `Bonjour ${settings?.restaurant_name || ""}, je souhaite avoir des informations.`
  );

  if (!settings?.whatsapp) return null;

  return (
    <a
      href={`https://wa.me/${settings.whatsapp}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Contacter sur WhatsApp"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="fixed bottom-6 right-6 z-40 flex items-center"
    >
      {hover && (
        <span className="mr-3 bg-noir text-ivory text-xs px-3 py-2 rounded-full whitespace-nowrap shadow-lg">
          Discuter sur WhatsApp
        </span>
      )}
      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg">
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40" />
        <svg viewBox="0 0 24 24" className="w-7 h-7 relative fill-white">
          <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.45 1.27 4.9L2 22l5.25-1.38A9.94 9.94 0 0 0 12.04 22c5.52 0 10-4.48 10-10s-4.48-10-10-10Zm0 18.15c-1.6 0-3.13-.43-4.46-1.24l-.32-.19-3.12.82.83-3.04-.2-.31a8.15 8.15 0 0 1-1.27-4.39c0-4.5 3.66-8.16 8.16-8.16 2.18 0 4.23.85 5.77 2.39a8.1 8.1 0 0 1 2.39 5.77c0 4.5-3.67 8.15-8.18 8.15Zm4.48-6.12c-.24-.12-1.44-.71-1.67-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.29.18-.53.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.44-1.35-1.68-.14-.24-.02-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.31-.02-.43-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42-.14-.01-.31-.01-.47-.01-.16 0-.43.06-.65.31-.22.24-.86.84-.86 2.04 0 1.2.88 2.36 1 2.52.12.16 1.73 2.64 4.2 3.7.59.25 1.05.4 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
        </svg>
      </span>
    </a>
  );
}
