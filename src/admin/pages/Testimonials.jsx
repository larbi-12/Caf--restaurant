import { useEffect, useState } from "react";
import { listTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from "../../services/testimonials";
import { deleteImage, pathFromPublicUrl, cleanupPreviousImage } from "../../services/storage";
import { EmptyState, ErrorState, TableSkeleton } from "../components/States";
import { Toggle } from "../components/Badge";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import ImageUploader from "../components/ImageUploader";
import { useToast } from "../context/ToastContext";
import { BUCKETS } from "../../lib/supabase";

const emptyForm = { id: null, name: "", role: "", avatar_url: "", rating: 5, content: "", display_order: 0, is_published: true };

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await listTestimonials();
    setTestimonials(data);
    setError(err);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      role: form.role,
      avatar_url: form.avatar_url,
      rating: Number(form.rating) || 5,
      content: form.content.trim(),
      display_order: Number(form.display_order) || 0,
      is_published: form.is_published,
    };
    const result = form.id ? await updateTestimonial(form.id, payload) : await createTestimonial(payload);
    setSaving(false);
    if (result.error) {
      toast.error("Erreur : " + result.error);
      return;
    }
    if (form._originalImageUrl) {
      await cleanupPreviousImage(BUCKETS.testimonials, form._originalImageUrl, form.avatar_url);
    }
    toast.success(form.id ? "Témoignage mis à jour." : "Témoignage ajouté.");
    setForm(null);
    load();
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    const path = pathFromPublicUrl(BUCKETS.testimonials, toDelete.avatar_url);
    const { error: err } = await deleteTestimonial(toDelete.id);
    if (!err && path) await deleteImage(BUCKETS.testimonials, path);
    setDeleting(false);
    setToDelete(null);
    if (err) {
      toast.error("Erreur : " + err);
      return;
    }
    toast.success("Témoignage supprimé avec succès.");
    load();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-neutral-900">Témoignages</h1>
          <p className="text-neutral-500 text-sm mt-1">{testimonials.length} témoignage(s)</p>
        </div>
        <button
          onClick={() => setForm({ ...emptyForm, display_order: testimonials.length + 1 })}
          className="px-5 py-2.5 bg-neutral-900 text-white text-sm hover:bg-neutral-800 transition-colors"
        >
          + Ajouter un témoignage
        </button>
      </div>

      <div className="bg-white border border-neutral-200 overflow-x-auto">
        {loading ? (
          <TableSkeleton rows={4} cols={4} />
        ) : error ? (
          <ErrorState message={error} />
        ) : testimonials.length === 0 ? (
          <EmptyState title="Aucun témoignage" />
        ) : (
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-neutral-500">
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Note</th>
                <th className="px-4 py-3 font-medium">Publié</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-4 py-3 flex items-center gap-3">
                    {t.avatar_url && <img src={t.avatar_url} alt="" className="w-8 h-8 object-cover rounded-full" />}
                    <span className="text-neutral-900">{t.name}</span>
                  </td>
                  <td className="px-4 py-3 text-gold">{"★".repeat(t.rating)}</td>
                  <td className="px-4 py-3">
                    <Toggle checked={t.is_published} onChange={(v) => updateTestimonial(t.id, { is_published: v }).then(load)} />
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => setForm({ ...t, _originalImageUrl: t.avatar_url })} className="text-xs uppercase tracking-wide text-neutral-600 hover:text-neutral-900">Modifier</button>
                    <button onClick={() => setToDelete(t)} className="text-xs uppercase tracking-wide text-red-600 hover:underline">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? "Modifier le témoignage" : "Ajouter un témoignage"}>
        {form && (
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <ImageUploader bucket={BUCKETS.testimonials} value={form.avatar_url} onChange={(url) => setForm({ ...form, avatar_url: url })} label="Photo" />
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label="Nom">
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
              </FormField>
              <FormField label="Rôle / Titre">
                <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input" />
              </FormField>
            </div>
            <FormField label="Note (1 à 5)">
              <input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="input" />
            </FormField>
            <FormField label="Témoignage">
              <textarea required rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="input resize-none" />
            </FormField>
            <Toggle checked={form.is_published} onChange={(v) => setForm({ ...form, is_published: v })} label="Publié sur le site" />
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
        message={`Supprimer le témoignage de "${toDelete?.name}" ?`}
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
