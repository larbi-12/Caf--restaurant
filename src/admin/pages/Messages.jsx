import { useEffect, useState } from "react";
import { listContactMessages, updateContactMessageStatus, deleteContactMessage } from "../../services/contactMessages";
import { StatusBadge } from "../components/Badge";
import { EmptyState, ErrorState, TableSkeleton } from "../components/States";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { useToast } from "../context/ToastContext";

const statusOptions = ["all", "new", "read", "replied", "archived"];
const statusLabels = { all: "Tous", new: "Nouveau", read: "Lu", replied: "Répondu", archived: "Archivé" };
const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await listContactMessages({ status });
    setMessages(data);
    setError(err);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const openMessage = async (msg) => {
    setSelected(msg);
    if (msg.status === "new") {
      const { error: err } = await updateContactMessageStatus(msg.id, "read");
      if (!err) {
        setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, status: "read" } : m)));
        setSelected((s) => (s?.id === msg.id ? { ...s, status: "read" } : s));
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setBusyId(id);
    const { error: err } = await updateContactMessageStatus(id, newStatus);
    setBusyId(null);
    if (err) {
      toast.error("Erreur : " + err);
      return;
    }
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m)));
    setSelected((s) => (s?.id === id ? { ...s, status: newStatus } : s));
    toast.success("Statut mis à jour.");
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    const { error: err } = await deleteContactMessage(toDelete.id);
    setDeleting(false);
    setToDelete(null);
    if (err) {
      toast.error("Erreur : " + err);
      return;
    }
    toast.success("Message supprimé avec succès.");
    setSelected(null);
    load();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-neutral-900">Messages</h1>
          <p className="text-neutral-500 text-sm mt-1">{messages.length} message(s)</p>
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input max-w-[200px]">
          {statusOptions.map((s) => (
            <option key={s} value={s}>{statusLabels[s]}</option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-neutral-200 overflow-x-auto">
        {loading ? (
          <TableSkeleton rows={6} cols={5} />
        ) : error ? (
          <ErrorState message={error} />
        ) : messages.length === 0 ? (
          <EmptyState title="Aucun message" description="Les messages envoyés depuis le formulaire de contact apparaîtront ici." />
        ) : (
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-neutral-500">
                <th className="px-4 py-3 font-medium">De</th>
                <th className="px-4 py-3 font-medium">Sujet</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Reçu le</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m.id} className={`border-b border-neutral-100 hover:bg-neutral-50 ${m.status === "new" ? "font-medium" : ""}`}>
                  <td className="px-4 py-3">
                    <p className="text-neutral-900">{m.name}</p>
                    <p className="text-neutral-400 text-xs font-normal">{m.email}</p>
                  </td>
                  <td className="px-4 py-3 text-neutral-600 font-normal max-w-xs truncate">{m.subject || "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                  <td className="px-4 py-3 text-neutral-400 text-xs font-normal">{dateFormatter.format(new Date(m.created_at))}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openMessage(m)} className="text-neutral-600 hover:text-neutral-900 text-xs uppercase tracking-wide">
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Message">
        {selected && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Field label="Nom" value={selected.name} />
              <Field label="Email" value={selected.email} />
              <Field label="Sujet" value={selected.subject || "—"} />
              <Field label="Reçu le" value={dateFormatter.format(new Date(selected.created_at))} />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide text-neutral-500">Message</span>
              <p className="text-neutral-700 text-sm mt-1 whitespace-pre-wrap">{selected.message}</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-neutral-100">
              {["new", "read", "replied", "archived"].map((s) => (
                <button
                  key={s}
                  disabled={busyId === selected.id}
                  onClick={() => handleStatusChange(selected.id, s)}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wide border transition-colors disabled:opacity-50 ${
                    selected.status === s ? "bg-neutral-900 text-white border-neutral-900" : "border-neutral-300 text-neutral-600 hover:border-neutral-900"
                  }`}
                >
                  {statusLabels[s]}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={`mailto:${selected.email}?subject=${encodeURIComponent("Re: " + (selected.subject || "Votre message"))}`}
                className="inline-flex items-center gap-2 text-sm text-neutral-700 hover:underline"
              >
                Répondre par email →
              </a>
              <button onClick={() => setToDelete(selected)} className="text-sm text-red-600 hover:underline">
                Supprimer
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Supprimer le message de "${toDelete?.name}" ?`}
      />
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <span className="text-xs uppercase tracking-wide text-neutral-500">{label}</span>
      <p className="text-neutral-900">{value}</p>
    </div>
  );
}
