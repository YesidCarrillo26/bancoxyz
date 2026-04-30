import { Transfer } from '../types/Transfer';
import formatCurrency from '../helpers/currency';

interface TransferListProps {
  transfers: Transfer[];
  loading: boolean;
  error: string;
}

export const TransferList = ({ transfers, loading, error }: TransferListProps) => {
  return (
    <div className="card">
      <p className="text-sm font-semibold text-gray-800 mb-4">
        {loading ? '...' : `${transfers.length} transfer${transfers.length !== 1 ? 's' : ''}`}
      </p>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-14 bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="text-red-500 text-sm text-center py-4">{error}</p>
      )}

      {!loading && !error && transfers.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-4">No transfers found</p>
      )}

      {!loading && !error && transfers.length > 0 && (
        <ul className="divide-y divide-gray-100">
          {transfers.map((t, i) => (
            <li key={i} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900 text-sm">{t.payeer.name}</p>
                <p className="text-xs text-gray-400">{t.payeer.document} · {t.date}</p>
              </div>
              <span className="font-semibold text-gray-800 text-sm">
                {formatCurrency(t.value, t.currency)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
