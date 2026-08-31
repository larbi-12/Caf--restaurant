const statusStyles = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-neutral-200 text-neutral-700",
  new: "bg-blue-100 text-blue-800",
  read: "bg-neutral-100 text-neutral-600",
  replied: "bg-emerald-100 text-emerald-800",
  archived: "bg-neutral-200 text-neutral-500",
};

const statusLabels = {
  pending: "En attente",
  confirmed: "Confirmée",
  cancelled: "Annulée",
  completed: "Terminée",
  new: "Nouveau",
  read: "Lu",
  replied: "Répondu",
  archived: "Archivé",
};

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${statusStyles[status] || "bg-neutral-100 text-neutral-600"}`}>
      {statusLabels[status] || status}
    </span>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <span
        onClick={() => onChange(!checked)}
        className={`w-9 h-5 rounded-full relative transition-colors ${checked ? "bg-emerald-500" : "bg-neutral-300"}`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
            checked ? "left-4.5 translate-x-0" : "left-0.5"
          }`}
          style={{ left: checked ? "18px" : "2px" }}
        />
      </span>
      {label && <span className="text-sm text-neutral-600">{label}</span>}
    </label>
  );
}
