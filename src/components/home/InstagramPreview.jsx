import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import { useRestaurantSettings } from "../../hooks/useRestaurantSettings";
import { useGallery } from "../../hooks/useGallery";

export default function InstagramPreview() {
  const { settings } = useRestaurantSettings();
  const { images, loading } = useGallery();
  const preview = images.slice(0, 6);

  if (!settings?.instagram_url || (!loading && preview.length === 0)) return null;

  return (
    <section className="bg-charcoal py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col gap-14">
        <SectionHeading
          eyebrow="@maisonnoor"
          title="Suivez notre univers"
          light
          align="center"
          description={`Retrouvez le quotidien de ${settings.restaurant_name} sur Instagram : cuisine, événements et coulisses.`}
        />

        <Reveal className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" stagger={0.06}>
          {preview.map((img) => (
            <a
              key={img.id}
              href={settings.instagram_url}
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square overflow-hidden block"
            >
              <img src={img.image_url} alt={img.title || ""} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-noir/0 group-hover:bg-noir/40 transition-colors flex items-center justify-center">
                <span className="text-ivory opacity-0 group-hover:opacity-100 transition-opacity text-lg">⌁</span>
              </div>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
