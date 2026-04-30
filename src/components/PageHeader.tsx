import { ArrowLeftIcon, BuildingLibraryIcon } from '@heroicons/react/16/solid';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
}

export const PageHeader = ({ title }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="px-6 py-5 max-w-4xl mx-auto flex items-center gap-3">
      <button
        onClick={() => navigate(-1)}
        className="text-white/70 hover:text-white transition-colors"
        aria-label="Go back"
      >
        <ArrowLeftIcon className="w-5 h-5" />
      </button>
      <BuildingLibraryIcon className="w-5 h-5 text-white" />
      <h1 className="text-white font-bold text-lg">{title}</h1>
    </div>
  );
};
