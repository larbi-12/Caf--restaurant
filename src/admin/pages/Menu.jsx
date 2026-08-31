import { useEffect, useState } from "react";
import { listMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from "../../services/menu";
import { listCategories } from "../../services/categories";
import { deleteImage, pathFromPublicUrl, cleanupPreviousImage } from "../../services/storage";
import { EmptyState, ErrorState, TableSkeleton } from "../components/States";
import { Toggle } from "../components/Badge";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import ImageUploader from "../components/ImageUploader";
import { useToast } from "../context/ToastContext";
import { BUCKETS } from "../../lib/supabase";

const emptyForm = {
  id: null,
  category_id: "",
  name: "",
  slug: "",
  description: "",
  long_description: "",
  price: "",
  image_url: "",
  ingredients: "",
  allergens: "",
  is_featured: false,
  is_available: true,
  display_order: 0,
};

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function MenuAdmin() {
  const [items, setItems] = useState([]);
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
    const [{ data: menuData, error: menuErr }, { data: catData }] = await Promise.all([
      listMenuItems(),
      listCategories(),
    ]);
    setItems(menuData);
    setCategories(catData);
    setError(menuErr);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => setForm({ ...emptyForm, category_id: categories[0]?.id || "" });
  const openEdit = (item) =>
    setForm({
      ...item,
      ingredients: (item.ingredients || []).join(", "),
      allergens: (item.allergens || []).join(", "),
      category_id: item.category_id || "",
      _originalImageUrl: item.image_url,
    });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      category_id: form.category_id || null,
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      description: form.description,
      long_description: form.long_description,
      price: Number(form.price) || 0,
      image_url: form.image_url,
      ingredients: form.ingredients.split(",").map((s) => s.trim()).filter(Boolean),
      allergens: form.allergens.split(",").map((s) => s.trim()).filter(Boolean),
      is_featured: form.is_featured,
      is_available: form.is_available,
      display_order: Number(form.display_order) || 0,
    };

    const result = form.id ? await updateMenuItem(form.id, payload) : await createMenuItem(payload);
    setSaving(false);

    if (result.error) {
      toast.error("Erreur : " + result.error);
      return;
    }
    if (form._originalImageUrl) {
      await cleanupPreviousImage(BUCKETS.menu, form._originalImageUrl, form.image_url);
    }
    toast.success(form.id ? "Plat mis à jour." : "Plat créé.");
    setForm(null);
    load();
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    const path = pathFromPublicUrl(BUCKETS.menu, toDelete.image_url);
    const { error: err } = await deleteMenuItem(toDelete.id);
    if (!err && path) await deleteImage(BUCKETS.menu, path);
    setDeleting(false);
    setToDelete(null);
    if (err) {
      toast.error("Erreur : " + err);
      return;
    }
    toast.success("Plat supprimé avec succès.");
    load();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-neutral-900">Menu</h1>
          <p className="text-neutral-500 text-sm mt-1">{items.length} plat(s)</p>
        </div>
        <button onClick={openCreate} className="px-5 py-2.5 bg-neutral-900 text-white text-sm hover:bg-neutral-800 transition-colors">
          + Ajouter un plat
        </button>
      </div>

      <div className="bg-white border border-neutral-200 overflow-x-auto">
        {loading ? (
          <TableSkeleton rows={6} cols={5} />
        ) : error ? (
          <ErrorState message={error} />
        ) : items.length === 0 ? (
          <EmptyState title="Aucun plat" description="Ajoutez votre premier plat pour commencer." />
        ) : (
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-neutral-500">
                <th className="px-4 py-3 font-medium">Plat</th>
                <th className="px-4 py-3 font-medium">Catégorie</th>
                <th className="px-4 py-3 font-medium">Prix</th>
                <th className="px-4 py-3 font-medium">Disponible</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-4 py-3 flex items-center gap-3">
                    {item.image_url && <img src={item.image_url} alt="" className="w-10 h-10 object-cover rounded" />}
                    <span className="text-neutral-900">{item.name}</span>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{item.category?.name || "—"}</td>
                  <td className="px-4 py-3 text-neutral-900 font-medium">{item.price} MAD</td>
                  <td className="px-4 py-3">
                    <Toggle checked={item.is_available} onChange={(v) => updateMenuItem(item.id, { is_available: v }).then(load)} />
                  </td>
                  <td className="px-4 py-3">
                    <Toggle checked={item.is_featured} onChange={(v) => updateMenuItem(item.id, { is_featured: v }).then(load)} />
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => openEdit(item)} className="text-xs uppercase tracking-wide text-neutral-600 hover:text-neutral-900">Modifier</button>
                    <button onClick={() => setToDelete(item)} className="text-xs uppercase tracking-wide text-red-600 hover:underline">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? "Modifier le plat" : "Ajouter un plat"} wide>
        {form && (
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <ImageUploader bucket={BUCKETS.menu} value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} label="Photo du plat" />

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label="Nom">
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
              </FormField>
              <FormField label="Catégorie">
                <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="input">
                  <option value="">—</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </FormField>
            </div>

            <FormField label="Description courte">
              <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input resize-none" />
            </FormField>

            <FormField label="Description longue (optionnel)">
              <textarea rows={3} value={form.long_description || ""} onChange={(e) => setForm({ ...form, long_description: e.target.value })} className="input resize-none" />
            </FormField>

            <div className="grid sm:grid-cols-3 gap-4">
              <FormField label="Prix (MAD)">
                <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input" />
              </FormField>
              <FormField label="Ordre d'affichage">
                <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} className="input" />
              </FormField>
              <FormField label="Slug (optionnel)">
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto" className="input" />
              </FormField>
            </div>

            <FormField label="Ingrédients (séparés par des virgules)">
              <input value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} className="input" />
            </FormField>
            <FormField label="Allergènes (séparés par des virgules)">
              <input value={form.allergens} onChange={(e) => setForm({ ...form, allergens: e.target.value })} className="input" />
            </FormField>

            <div className="flex items-center gap-8">
              <Toggle checked={form.is_available} onChange={(v) => setForm({ ...form, is_available: v })} label="Disponible" />
              <Toggle checked={form.is_featured} onChange={(v) => setForm({ ...form, is_featured: v })} label="Mettre en avant" />
            </div>

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
        message={`Êtes-vous sûr de vouloir supprimer "${toDelete?.name}" ?`}
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
