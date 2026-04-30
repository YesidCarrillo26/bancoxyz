import { BuildingLibraryIcon } from '@heroicons/react/16/solid';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onLogout?: () => void;
}

export const Navbar = ({ onLogout }: NavbarProps) => {
  const { user } = useAuth();

  return (
    <nav className="bg-white/10 backdrop-blur-sm border-b border-white/10 px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <BuildingLibraryIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg">BancoXYZ</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/70 text-sm">Welcome, {user?.name}</span>
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1 text-white/70 hover:text-white text-sm transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
