import { useMemo, useState } from "react";
import { useReservations } from "../../hooks/useReservations";
import { updateReservationStatus, deleteReservation } from "../../services/reservations";
import { StatusBadge } from "../components/Badge";
import { EmptyState, ErrorState, TableSkeleton } from "../components/States";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { useToast } from "../context/ToastContext";

const PAGE_SIZE = 10;
const statusOptions = ["all", "pending", "confirmed", "cancelled", "completed"];
const statusLabels = { all: "Tous", pending: "En attente", confirmed: "Confirmées", cancelled: "Annulées", completed: "Terminées" };

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

export default function Reservations() {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const toast = useToast();

  const { reservations, loading, error, refresh } = useReservations({ status, search }, { realtime: true, onNew: () => toast.info("Nouvelle réservation reçue.") });

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return reservations.slice(start, start + PAGE_SIZE);
  }, [reservations, page]);

  const totalPages = Math.max(1, Math.ceil(reservations.length / PAGE_SIZE));

  const handleStatusChange = async (id, newStatus) => {
    setBusyId(id);
    const { error: err } = await updateReservationStatus(id, newStatus);
    setBusyId(null);
    if (err) {
      toast.error("Erreur : " + err);
      return;
    }
    toast.success("Statut mis à jour.");
    refresh();
    setSelected((s) => (s?.id === id ? { ...s, status: newStatus } : s));
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setBusyId(toDelete.id);
    const { error: err } = await deleteReservation(toDelete.id);
    setBusyId(null);
    setToDelete(null);
    if (err) {
      toast.error("Erreur : " + err);
      return;
    }
    toast.success("Réservation supprimée.");
    setSelected(null);
    refresh();
  };

  const whatsappLink = (r) => {
    const msg = `Bonjour ${r.customer_name}, concernant votre réservation du ${r.reservation_date} à ${r.reservation_time} pour ${r.guests} personne(s)...`;
    return `https://wa.me/${r.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-neutral-900">Réservations</h1>
          <p className="text-neutral-500 text-sm mt-1">{reservations.length} réservation(s)</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher nom, tél, email..."
            className="border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 min-w-[220px]"
          />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>{statusLabels[s]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 overflow-x-auto">
        {loading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : error ? (
          <ErrorState message={error} />
        ) : reservations.length === 0 ? (
          <EmptyState title="Aucune réservation" description="Les nouvelles demandes de réservation apparaîtront ici." />
        ) : (
          <>
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-neutral-500">
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Heure</th>
                  <th className="px-4 py-3 font-medium">Personnes</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 font-medium">Créée le</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((r) => (
                  <tr key={r.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <p className="text-neutral-900">{r.customer_name}</p>
                      <p className="text-neutral-400 text-xs">{r.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{r.reservation_date}</td>
                    <td className="px-4 py-3 text-neutral-600">{r.reservation_time}</td>
                    <td className="px-4 py-3 text-neutral-600">{r.guests}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3 text-neutral-400 text-xs">{dateFormatter.format(new Date(r.created_at))}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setSelected(r)} className="text-neutral-600 hover:text-neutral-900 text-xs uppercase tracking-wide">
                        Voir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200 text-sm">
                <span className="text-neutral-500">Page {page} / {totalPages}</span>
                <div className="flex gap-2">
                  <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 border border-neutral-200 disabled:opacity-40">←</button>
                  <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 border border-neutral-200 disabled:opacity-40">→</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Détail de la réservation">
        {selected && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Field label="Nom" value={selected.customer_name} />
              <Field label="Téléphone" value={selected.phone} />
              <Field label="Email" value={selected.email} />
              <Field label="Date" value={selected.reservation_date} />
              <Field label="Heure" value={selected.reservation_time} />
              <Field label="Personnes" value={selected.guests} />
              <Field label="Occasion" value={selected.occasion || "—"} />
              <Field label="Créée le" value={dateFormatter.format(new Date(selected.created_at))} />
            </div>
            {selected.message && (
              <div>
                <span className="text-xs uppercase tracking-wide text-neutral-500">Message</span>
                <p className="text-neutral-700 text-sm mt-1">{selected.message}</p>
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-neutral-100">
              {["pending", "confirmed", "cancelled", "completed"].map((s) => (
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
                href={whatsappLink(selected)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:underline"
              >
                Contacter sur WhatsApp →
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
        loading={busyId === toDelete?.id}
        message={`Êtes-vous sûr de vouloir supprimer la réservation de ${toDelete?.customer_name} ?`}
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
