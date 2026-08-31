import { useEffect, useState } from "react";
import { getSettings, updateSettings } from "../../services/restaurantSettings";
import { listStatistics, createStatistic, updateStatistic, deleteStatistic } from "../../services/statistics";
import ImageUploader from "../components/ImageUploader";
import { ErrorState } from "../components/States";
import { useToast } from "../context/ToastContext";
import { BUCKETS } from "../../lib/supabase";
import { cleanupPreviousImage } from "../../services/storage";

const WEEKDAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

function ensureWeekHours(opening_hours) {
  const byDay = Object.fromEntries((opening_hours || []).map((h) => [h.day, h.time]));
  return WEEKDAYS.map((day) => ({ day, time: byDay[day] || "12:00 — 23:00" }));
}

export default function Settings() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState([]);
  const [originalImages, setOriginalImages] = useState({});
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    const [{ data, error: err }, { data: statData }] = await Promise.all([getSettings(), listStatistics()]);
    if (data) {
      setForm({ ...data, opening_hours: ensureWeekHours(data.opening_hours) });
      setOriginalImages({
        logo_url: data.logo_url,
        favicon_url: data.favicon_url,
        hero_image_url: data.hero_image_url,
      });
    }
    setStats(statData);
    setError(err);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { id: _id, updated_at: _updatedAt, ...patch } = form;
    const { error: err } = await updateSettings(patch);
    setSaving(false);
    if (err) {
      toast.error("Erreur : " + err);
      return;
    }
    for (const field of ["logo_url", "favicon_url", "hero_image_url"]) {
      if (originalImages[field]) {
        await cleanupPreviousImage(BUCKETS.restaurant, originalImages[field], form[field]);
      }
    }
    setOriginalImages({ logo_url: form.logo_url, favicon_url: form.favicon_url, hero_image_url: form.hero_image_url });
    toast.success("Paramètres enregistrés avec succès.");
  };

  const updateHour = (index, time) => {
    const hours = [...form.opening_hours];
    hours[index] = { ...hours[index], time };
    setForm({ ...form, opening_hours: hours });
  };

  const handleStatChange = async (id, patch) => {
    await updateStatistic(id, patch);
  };

  const handleStatAdd = async () => {
    const { data } = await createStatistic({ label: "Nouvelle statistique", value: 0, suffix: "", display_order: stats.length + 1, is_active: true });
    if (data) setStats([...stats, data]);
  };

  const handleStatRemove = async (id) => {
    await deleteStatistic(id);
    setStats(stats.filter((s) => s.id !== id));
  };

  if (loading) return <p className="text-neutral-400 text-sm">Chargement...</p>;
  if (error || !form) return <ErrorState message={error} />;

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="font-serif text-2xl text-neutral-900">Paramètres du restaurant</h1>
        <p className="text-neutral-500 text-sm mt-1">Ces informations alimentent automatiquement le site public.</p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-10">
        <Section title="Identité">
          <ImageUploader bucket={BUCKETS.restaurant} value={form.logo_url} onChange={(url) => setForm({ ...form, logo_url: url })} label="Logo" />
          <ImageUploader bucket={BUCKETS.restaurant} value={form.favicon_url} onChange={(url) => setForm({ ...form, favicon_url: url })} label="Favicon" />
          <Field label="Nom du restaurant">
            <input value={form.restaurant_name || ""} onChange={(e) => setForm({ ...form, restaurant_name: e.target.value })} className="input" />
          </Field>
          <Field label="Slogan">
            <input value={form.tagline || ""} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="input" />
          </Field>
          <Field label="Description">
            <textarea rows={3} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input resize-none" />
          </Field>
        </Section>

        <Section title="Contact">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Téléphone">
              <input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" />
            </Field>
            <Field label="Email">
              <input type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
            </Field>
            <Field label="WhatsApp (format international, sans +)">
              <input value={form.whatsapp || ""} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="input" />
            </Field>
            <Field label="Ville">
              <input value={form.city || ""} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input" />
            </Field>
          </div>
          <Field label="Adresse">
            <input value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input" />
          </Field>
          <Field label="Lien Google Maps">
            <input value={form.google_maps_url || ""} onChange={(e) => setForm({ ...form, google_maps_url: e.target.value })} className="input" />
          </Field>
        </Section>

        <Section title="Réseaux sociaux">
          <Field label="Instagram">
            <input value={form.instagram_url || ""} onChange={(e) => setForm({ ...form, instagram_url: e.target.value })} className="input" />
          </Field>
          <Field label="Facebook">
            <input value={form.facebook_url || ""} onChange={(e) => setForm({ ...form, facebook_url: e.target.value })} className="input" />
          </Field>
          <Field label="TikTok">
            <input value={form.tiktok_url || ""} onChange={(e) => setForm({ ...form, tiktok_url: e.target.value })} className="input" />
          </Field>
        </Section>

        <Section title="Horaires">
          {form.opening_hours.map((h, i) => (
            <div key={h.day} className="grid grid-cols-3 gap-4 items-center">
              <span className="text-sm text-neutral-700">{h.day}</span>
              <input
                className="input col-span-2"
                value={h.time}
                onChange={(e) => updateHour(i, e.target.value)}
                placeholder="12:00 — 23:00 ou Fermé"
              />
            </div>
          ))}
        </Section>

        <Section title="Hero (page d'accueil)">
          <ImageUploader bucket={BUCKETS.restaurant} value={form.hero_image_url} onChange={(url) => setForm({ ...form, hero_image_url: url })} label="Image du hero" />
          <Field label="Titre">
            <input value={form.hero_title || ""} onChange={(e) => setForm({ ...form, hero_title: e.target.value })} className="input" />
          </Field>
          <Field label="Sous-titre">
            <input value={form.hero_subtitle || ""} onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })} className="input" />
          </Field>
          <Field label="Description">
            <textarea rows={2} value={form.hero_description || ""} onChange={(e) => setForm({ ...form, hero_description: e.target.value })} className="input resize-none" />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Texte du bouton (CTA)">
              <input value={form.cta_text || ""} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} className="input" />
            </Field>
            <Field label="Lien du bouton">
              <input value={form.cta_link || ""} onChange={(e) => setForm({ ...form, cta_link: e.target.value })} className="input" />
            </Field>
          </div>
        </Section>

        <Section title="Couleurs">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Couleur principale">
              <input type="color" value={form.primary_color || "#14110f"} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} className="input h-11" />
            </Field>
            <Field label="Couleur secondaire">
              <input type="color" value={form.secondary_color || "#b08a4e"} onChange={(e) => setForm({ ...form, secondary_color: e.target.value })} className="input h-11" />
            </Field>
          </div>
        </Section>

        <div className="sticky bottom-0 bg-neutral-50 py-4 border-t border-neutral-200 flex justify-end">
          <button type="submit" disabled={saving} className="px-6 py-3 bg-neutral-900 text-white text-sm disabled:opacity-50">
            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </div>
      </form>

      <Section title="Statistiques (page d'accueil)">
        <div className="flex flex-col gap-3">
          {stats.map((s) => (
            <div key={s.id} className="grid grid-cols-[1fr_100px_80px_auto] gap-3 items-center">
              <input defaultValue={s.label} onBlur={(e) => handleStatChange(s.id, { label: e.target.value })} className="input" placeholder="Libellé" />
              <input type="number" defaultValue={s.value} onBlur={(e) => handleStatChange(s.id, { value: Number(e.target.value) })} className="input" placeholder="Valeur" />
              <input defaultValue={s.suffix} onBlur={(e) => handleStatChange(s.id, { suffix: e.target.value })} className="input" placeholder="Suffixe" />
              <button type="button" onClick={() => handleStatRemove(s.id)} className="text-xs text-red-600 hover:underline">Supprimer</button>
            </div>
          ))}
          <button type="button" onClick={handleStatAdd} className="text-sm text-neutral-600 hover:text-neutral-900 w-fit">+ Ajouter une statistique</button>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white border border-neutral-200 p-6 flex flex-col gap-4">
      <h2 className="text-sm uppercase tracking-wide text-neutral-500">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-wide text-neutral-500">{label}</span>
      {children}
    </label>
  );
}
