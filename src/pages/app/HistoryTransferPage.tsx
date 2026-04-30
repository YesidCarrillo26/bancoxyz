import { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { TransferFilters, TransferFiltersValue } from '../../components/TransferFilters';
import { TransferList } from '../../components/TransferList';
import { transferService } from '../../services/transfer/transferService';
import { Transfer } from '../../types/Transfer';

const EMPTY_FILTERS: TransferFiltersValue = { name: '', amount: '', date: '' };

export const HistoryTransferPage = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<TransferFiltersValue>(EMPTY_FILTERS);

  useEffect(() => {
    transferService
      .getTransferList()
      .then(res => setTransfers(res.transfers))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load transfer history'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return transfers.filter(t => {
      const matchName = !filters.name || t.payeer.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchAmount = !filters.amount || Math.abs(t.value - parseFloat(filters.amount)) < 0.01;
      const transferDate = t.date.split('T')[0];
      const matchDate = !filters.date || transferDate === filters.date;
      return matchName && matchAmount && matchDate;
    });
  }, [transfers, filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900">
      <PageHeader title="Transfer History" />
      <div className="max-w-4xl mx-auto px-6 pb-8 space-y-4">
        <TransferFilters filters={filters} onChange={setFilters} />
        <TransferList transfers={filtered} loading={loading} error={error} />
      </div>
    </div>
  );
};
