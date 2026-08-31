import { Outlet } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

/**
 * Wraps only the /admin/* route subtree with Clerk auth + toast context, so
 * public visitors never load Clerk's SDK or pay for its bundle weight.
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
