import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

export default function LogoutPage() {
  const navigate = useNavigate();
  const { signOut, loading } = useAuth();

  useEffect(() => {
    let active = true;

    async function runLogout() {
      await signOut();
      if (active) {
        navigate("/login", { replace: true });
      }
    }

    void runLogout();

    return () => {
      active = false;
    };
  }, [navigate, signOut]);

  if (!loading) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen grid place-items-center bg-[#0F1419] text-white/80 px-6">
      <p className="text-[14px] tracking-[0.08em] uppercase">Signing you out...</p>
    </div>
  );
}
