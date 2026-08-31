import { useCallback, useEffect, useState } from "react";
import { listReservations, subscribeToReservations } from "../services/reservations";

export function useReservations({ status = "all", search = "" } = {}, { realtime = false, onNew } = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data: rows, error: err } = await listReservations({ status, search });
    setData(rows);
    setError(err);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, search]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!realtime) return;
    const unsubscribe = subscribeToReservations((newRow) => {
      onNew?.(newRow);
      refresh();
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realtime]);

  return { reservations: data, loading, error, refresh };
}
