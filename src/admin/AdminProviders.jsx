import { Outlet } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

/**
 * Wraps only the /admin/* route subtree with auth + toast context, so public
 * visitors never pay for the admin-only providers.
 */
export default function AdminProviders() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Outlet />
      </ToastProvider>
    </AuthProvider>
  );
}
