import { useEffect, useState } from "react";
import { listExperiences, createExperience, updateExperience, deleteExperience } from "../../services/experiences";
import { EmptyState, ErrorState, TableSkeleton } from "../components/States";
import { Toggle } from "../components/Badge";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import ImageUploader from "../components/ImageUploader";
import { useToast } from "../context/ToastContext";
import { BUCKETS } from "../../lib/supabase";
import { cleanupPreviousImage, deleteImage, pathFromPublicUrl } from "../../services/storage";

const emptyForm = {
  id: null,
  title: "",
  slug: "",
  description: "",
  long_description: "",
  image_url: "",
  gallery_urls: ["", "", ""],
  price: "",
  duration: "",
  capacity: "",
  included: "",
  hours: "",
  faq: [{ q: "", a: "" }],
  is_active: true,
  display_order: 0,
};

function slugify(str) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function Experiences() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await listExperiences();
    setExperiences(data);
    setError(err);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (exp) =>
    setForm({
      ...exp,
      gallery_urls: [0, 1, 2].map((i) => exp.gallery_urls?.[i] || ""),
      included: (exp.included || []).join(", "),
      faq: exp.faq?.length ? exp.faq : [{ q: "", a: "" }],
      _originalImageUrl: exp.image_url,
      _originalGalleryUrls: [0, 1, 2].map((i) => exp.gallery_urls?.[i] || ""),
    });

  const updateFaq = (index, key, value) => {
    const faq = [...form.faq];
    faq[index] = { ...faq[index], [key]: value };
    setForm({ ...form, faq });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      description: form.description,
      long_description: form.long_description,
      image_url: form.image_url,
      gallery_urls: form.gallery_urls.filter(Boolean),
      price: form.price,
      duration: form.duration,
      capacity: form.capacity,
      included: form.included.split(",").map((s) => s.trim()).filter(Boolean),
      hours: form.hours,
      faq: form.faq.filter((f) => f.q.trim() && f.a.trim()),
      is_active: form.is_active,
      display_order: Number(form.display_order) || 0,
    };
    const result = form.id ? await updateExperience(form.id, payload) : await createExperience(payload);
    setSaving(false);
    if (result.error) {
      toast.error("Erreur : " + result.error);
      return;
    }
    if (form._originalImageUrl) {
      await cleanupPreviousImage(BUCKETS.experiences, form._originalImageUrl, form.image_url);
    }
    if (form._originalGalleryUrls) {
      for (const oldUrl of form._originalGalleryUrls) {
        if (oldUrl && !payload.gallery_urls.includes(oldUrl)) {
          await cleanupPreviousImage(BUCKETS.experiences, oldUrl, null);
        }
      }
    }
    toast.success(form.id ? "Expérience mise à jour." : "Expérience créée.");
    setForm(null);
    load();
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    const { error: err } = await deleteExperience(toDelete.id);
    if (!err) {
      const urls = [toDelete.image_url, ...(toDelete.gallery_urls || [])].filter(Boolean);
      for (const url of urls) {
        const path = pathFromPublicUrl(BUCKETS.experiences, url);
        if (path) await deleteImage(BUCKETS.experiences, path);
      }
    }
    setDeleting(false);
    setToDelete(null);
    if (err) {
      toast.error("Erreur : " + err);
      return;
    }
    toast.success("Expérience supprimée avec succès.");
    load();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-neutral-900">Expériences</h1>
          <p className="text-neutral-500 text-sm mt-1">{experiences.length} expérience(s)</p>
        </div>
        <button
          onClick={() => setForm({ ...emptyForm, display_order: experiences.length + 1 })}
          className="px-5 py-2.5 bg-neutral-900 text-white text-sm hover:bg-neutral-800 transition-colors"
        >
          + Ajouter une expérience
        </button>
      </div>

      <div className="bg-white border border-neutral-200 overflow-x-auto">
        {loading ? (
          <TableSkeleton rows={4} cols={4} />
        ) : error ? (
          <ErrorState message={error} />
        ) : experiences.length === 0 ? (
          <EmptyState title="Aucune expérience" />
        ) : (
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-neutral-500">
                <th className="px-4 py-3 font-medium">Expérience</th>
                <th className="px-4 py-3 font-medium">Prix</th>
                <th className="px-4 py-3 font-medium">Active</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {experiences.map((exp) => (
                <tr key={exp.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-4 py-3 flex items-center gap-3">
                    {exp.image_url && <img src={exp.image_url} alt="" className="w-10 h-10 object-cover rounded" />}
                    <span className="text-neutral-900">{exp.title}</span>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{exp.price}</td>
                  <td className="px-4 py-3">
                    <Toggle checked={exp.is_active} onChange={(v) => updateExperience(exp.id, { is_active: v }).then(load)} />
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => openEdit(exp)} className="text-xs uppercase tracking-wide text-neutral-600 hover:text-neutral-900">Modifier</button>
                    <button onClick={() => setToDelete(exp)} className="text-xs uppercase tracking-wide text-red-600 hover:underline">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? "Modifier l'expérience" : "Ajouter une expérience"} wide>
        {form && (
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <ImageUploader bucket={BUCKETS.experiences} value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} label="Image principale" />

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label="Titre">
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
              </FormField>
              <FormField label="Prix">
                <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Sur demande / 290 MAD" className="input" />
              </FormField>
            </div>

            <FormField label="Description courte (utilisée dans l'en-tête)">
              <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input resize-none" />
            </FormField>

            <FormField label="Description longue (texte principal affiché sur le site)">
              <textarea rows={4} value={form.long_description || ""} onChange={(e) => setForm({ ...form, long_description: e.target.value })} className="input resize-none" />
            </FormField>

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label="Durée">
                <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="input" />
              </FormField>
              <FormField label="Capacité">
                <input value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="input" />
              </FormField>
            </div>

            <FormField label="Horaires">
              <input value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} className="input" />
            </FormField>

            <FormField label="Ce qui est inclus (séparé par des virgules)">
              <input value={form.included} onChange={(e) => setForm({ ...form, included: e.target.value })} className="input" />
            </FormField>

            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-wide text-neutral-500">Galerie (3 images)</span>
              <div className="grid sm:grid-cols-3 gap-4">
                {form.gallery_urls.map((url, i) => (
                  <ImageUploader
                    key={i}
                    bucket={BUCKETS.experiences}
                    value={url}
                    label={`Photo ${i + 1}`}
                    onChange={(newUrl) => {
                      const gallery = [...form.gallery_urls];
                      gallery[i] = newUrl;
                      setForm({ ...form, gallery_urls: gallery });
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-neutral-500">Questions fréquentes</span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, faq: [...form.faq, { q: "", a: "" }] })}
                  className="text-xs text-neutral-600 hover:text-neutral-900"
                >
                  + Ajouter
                </button>
              </div>
              {form.faq.map((item, i) => (
                <div key={i} className="grid sm:grid-cols-2 gap-3">
                  <input placeholder="Question" value={item.q} onChange={(e) => updateFaq(i, "q", e.target.value)} className="input" />
                  <input placeholder="Réponse" value={item.a} onChange={(e) => updateFaq(i, "a", e.target.value)} className="input" />
                </div>
              ))}
            </div>

            <Toggle checked={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} label="Expérience active" />

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
              <button type="button" onClick={() => setForm(null)} className="px-5 py-2.5 text-sm border border-neutral-200">Annuler</button>
              <button type="submit" disabled={saving} className="px-5 py-2.5 text-sm bg-neutral-900 text-white disabled:opacity-50">
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Supprimer l'expérience "${toDelete?.title}" ?`}
      />
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-wide text-neutral-500">{label}</span>
      {children}
    </label>
  );
}
