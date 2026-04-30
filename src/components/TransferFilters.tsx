import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/16/solid';

export interface TransferFiltersValue {
  name: string;
  amount: string;
  date: string;
}

interface TransferFiltersProps {
  filters: TransferFiltersValue;
  onChange: (filters: TransferFiltersValue) => void;
}

const EMPTY_FILTERS: TransferFiltersValue = { name: '', amount: '', date: '' };

export const TransferFilters = ({ filters, onChange }: TransferFiltersProps) => {
  const set = (key: keyof TransferFiltersValue) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...filters, [key]: e.target.value });

  const hasActiveFilters = filters.name !== '' || filters.amount !== '' || filters.date !== '';

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MagnifyingGlassIcon className="w-4 h-4 text-gray-500" />
          <span className="font-semibold text-gray-800">Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => onChange(EMPTY_FILTERS)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Recipient Name</label>
          <input
            type="text"
            placeholder="Search by name..."
            className="input-field text-sm"
            value={filters.name}
            onChange={set('name')}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Amount</label>
          <input
            type="number"
            placeholder="e.g. 150"
            className="input-field text-sm"
            value={filters.amount}
            onChange={set('amount')}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
          <input
            type="date"
            className="input-field text-sm"
            value={filters.date}
            onChange={set('date')}
          />
        </div>
      </div>
    </div>
  );
};
