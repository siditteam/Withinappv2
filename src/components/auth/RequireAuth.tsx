import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../store/AuthContext";

export default function RequireAuth() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#F0ECE6] text-[#1D2A38]">
        <p className="text-[14px] tracking-[0.08em] uppercase">Preparing your space...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
