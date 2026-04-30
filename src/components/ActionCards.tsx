import { useNavigate } from 'react-router-dom';
import { ClockIcon, PlusCircleIcon } from '@heroicons/react/16/solid';

export const ActionCards = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <button
        onClick={() => navigate('/new-transfer')}
        className="card flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer text-left w-full"
      >
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
          <PlusCircleIcon className="w-7 h-7 text-blue-600" />
        </div>
        <div>
          <p className="font-semibold text-gray-900">New Transfer</p>
          <p className="text-xs text-gray-500 mt-0.5">Send money to another account</p>
        </div>
      </button>

      <button
        onClick={() => navigate('/history')}
        className="card flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer text-left w-full"
      >
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
          <ClockIcon className="w-7 h-7 text-purple-600" />
        </div>
        <div>
          <p className="font-semibold text-gray-900">Transfer History</p>
          <p className="text-xs text-gray-500 mt-0.5">View all past transactions</p>
        </div>
      </button>
    </div>
  );
};
