import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

export default function LogoutPage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let active = true;

    async function runLogout() {
      await signOut();
      if (active) {
        setComplete(true);
        navigate("/login", { replace: true });
      }
    }

    void runLogout();

    return () => {
      active = false;
    };
  }, [navigate, signOut]);

  return (
    <div className="min-h-screen grid place-items-center bg-[#0F1419] text-white/80 px-6">
      <p className="text-[14px] tracking-[0.08em] uppercase">
        {complete ? "Redirecting..." : "Signing you out..."}
      </p>
    </div>
  );
}
