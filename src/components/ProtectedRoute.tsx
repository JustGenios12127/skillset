import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isSuperAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-9 w-9 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isSuperAdmin) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-50">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-3xl">
          🚫
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Доступ запрещён</h1>
        <p className="text-gray-500">
          У вашего аккаунта нет прав супер-администратора.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
