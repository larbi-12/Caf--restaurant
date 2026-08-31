import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import { listReservations } from "../../services/reservations";
import { listMenuItems } from "../../services/menu";
import { listArticles } from "../../services/articles";
import { listEvents } from "../../services/events";
import { listContactMessages } from "../../services/contactMessages";
import { ErrorState } from "../components/States";

function isToday(dateStr) {
  const today = new Date().toISOString().split("T")[0];
  return dateStr === today;
}

function isThisWeek(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);
  return d >= start;
}

export default function Dashboard() {
  const [reservations, setReservations] = useState([]);
  const [menuCount, setMenuCount] = useState(0);
  const [articleCount, setArticleCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [res, menu, articles, events, messages] = await Promise.all([
        listReservations(),
        listMenuItems(),
        listArticles(),
        listEvents(),
        listContactMessages({ status: "new" }),
      ]);
      if (res.error) setError(res.error);
      setReservations(res.data);
      setMenuCount(menu.data.length);
      setArticleCount(articles.data.length);
      setEventCount(events.data.length);
      setNewMessageCount(messages.data.length);
      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => {
    const byDate = {};
    reservations.forEach((r) => {
      const date = r.created_at?.split("T")[0];
      if (date) byDate[date] = (byDate[date] || 0) + 1;
    });
    return {
      today: reservations.filter((r) => isToday(r.reservation_date)).length,
      week: reservations.filter((r) => isThisWeek(r.created_at)).length,
      pending: reservations.filter((r) => r.status === "pending").length,
      confirmed: reservations.filter((r) => r.status === "confirmed").length,
      byDate,
    };
  }, [reservations]);

  const last7Days = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      days.push({ key, label: d.toLocaleDateString("fr-FR", { weekday: "short" }), count: stats.byDate[key] || 0 });
    }
    return days;
  }, [stats]);

  const maxCount = Math.max(1, ...last7Days.map((d) => d.count));

  if (error) return <ErrorState message={error} />;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-2xl text-neutral-900">Tableau de bord</h1>
        <p className="text-neutral-500 text-sm mt-1">Vue d'ensemble de l'activité de Maison Noor.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Réservations aujourd'hui" value={loading ? "…" : stats.today} />
        <StatCard label="Cette semaine" value={loading ? "…" : stats.week} />
        <StatCard label="En attente" value={loading ? "…" : stats.pending} />
        <StatCard label="Confirmées" value={loading ? "…" : stats.confirmed} />
        <StatCard label="Plats au menu" value={loading ? "…" : menuCount} />
        <StatCard label="Articles" value={loading ? "…" : articleCount} />
        <StatCard label="Événements" value={loading ? "…" : eventCount} />
        <StatCard
          label="Nouveaux messages"
          value={
            newMessageCount > 0 ? (
              <Link to="/admin/messages" className="text-gold">{loading ? "…" : newMessageCount}</Link>
            ) : (
              loading ? "…" : newMessageCount
            )
          }
        />
        <StatCard
          label="Voir les réservations"
          value={<Link to="/admin/reservations" className="text-gold text-lg">Ouvrir →</Link>}
        />
      </div>

      <div className="bg-white border border-neutral-200 p-6">
        <h2 className="text-sm uppercase tracking-wide text-neutral-500 mb-6">Réservations — 7 derniers jours</h2>
        <div className="flex items-end gap-3 h-40">
          {last7Days.map((d) => (
            <div key={d.key} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center h-32">
                <div
                  className="w-full max-w-10 bg-noir hover:bg-gold transition-colors"
                  style={{ height: `${(d.count / maxCount) * 100}%`, minHeight: d.count > 0 ? "4px" : "0px" }}
                  title={`${d.count} réservation(s)`}
                />
              </div>
              <span className="text-xs text-neutral-400 capitalize">{d.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
