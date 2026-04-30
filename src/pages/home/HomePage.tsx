import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BalanceCard } from "@/components/BalanceCard";
import { ActionCards } from "@/components/ActionCards";
import { Navbar } from "@/components/Navbar";

export const HomePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900">
      <Navbar onLogout={handleLogout} />
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <BalanceCard />
        <ActionCards />
      </div>
    </div>
  );
}
