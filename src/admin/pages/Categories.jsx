import { useEffect, useState } from "react";
import { listCategories, createCategory, updateCategory, deleteCategory } from "../../services/categories";
import { EmptyState, ErrorState, TableSkeleton } from "../components/States";
import { Toggle } from "../components/Badge";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { useToast } from "../context/ToastContext";

const emptyForm = { id: null, name: "", slug: "", description: "", display_order: 0, is_active: true };

function slugify(str) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await listCategories();
    setCategories(data);
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
      slug: form.slug.trim() || slugify(form.name),
      description: form.description,
      display_order: Number(form.display_order) || 0,
      is_active: form.is_active,
    };
    const result = form.id ? await updateCategory(form.id, payload) : await createCategory(payload);
    setSaving(false);
    if (result.error) {
      toast.error("Erreur : " + result.error);
      return;
    }
    toast.success(form.id ? "Catégorie mise à jour." : "Catégorie créée.");
    setForm(null);
    load();
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    const { error: err } = await deleteCategory(toDelete.id);
    setDeleting(false);
    setToDelete(null);
    if (err) {
      toast.error("Erreur : " + err);
      return;
    }
    toast.success("Catégorie supprimée avec succès.");
    load();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-neutral-900">Catégories</h1>
          <p className="text-neutral-500 text-sm mt-1">{categories.length} catégorie(s)</p>
        </div>
        <button
          onClick={() => setForm({ ...emptyForm, display_order: categories.length + 1 })}
          className="px-5 py-2.5 bg-neutral-900 text-white text-sm hover:bg-neutral-800 transition-colors"
        >
          + Ajouter une catégorie
        </button>
      </div>

      <div className="bg-white border border-neutral-200 overflow-x-auto">
        {loading ? (
          <TableSkeleton rows={4} cols={4} />
        ) : error ? (
          <ErrorState message={error} />
        ) : categories.length === 0 ? (
          <EmptyState title="Aucune catégorie" />
        ) : (
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-neutral-500">
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Ordre</th>
                <th className="px-4 py-3 font-medium">Active</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-4 py-3 text-neutral-900">{c.name}</td>
                  <td className="px-4 py-3 text-neutral-600">{c.display_order}</td>
                  <td className="px-4 py-3">
                    <Toggle checked={c.is_active} onChange={(v) => updateCategory(c.id, { is_active: v }).then(load)} />
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => setForm(c)} className="text-xs uppercase tracking-wide text-neutral-600 hover:text-neutral-900">Modifier</button>
                    <button onClick={() => setToDelete(c)} className="text-xs uppercase tracking-wide text-red-600 hover:underline">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? "Modifier la catégorie" : "Ajouter une catégorie"}>
        {form && (
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs uppercase tracking-wide text-neutral-500">Nom</span>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs uppercase tracking-wide text-neutral-500">Ordre d'affichage</span>
              <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} className="input" />
            </label>
            <Toggle checked={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} label="Catégorie active" />
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
        message={`Supprimer la catégorie "${toDelete?.name}" ? Les plats associés ne seront pas supprimés.`}
      />
    </div>
  );
}
