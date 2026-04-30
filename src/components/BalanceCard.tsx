import { useEffect, useState } from 'react';
import { balanceService } from '../services/balance/balanceService';
import { BalanceResponse } from '../types/Balance';
import formatCurrency from '../helpers/currency';

export const BalanceCard = () => {
  const [balance, setBalance] = useState<BalanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    balanceService
      .getBalance()
      .then(setBalance)
      .catch(() => setError('Failed to load balance'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="card">
      <p className="text-sm text-gray-500 font-medium mb-1">Current Balance</p>
      {loading ? (
        <div className="h-9 w-48 bg-gray-100 animate-pulse rounded" />
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : (
        <p className="text-3xl font-bold text-gray-900">
          {balance ? formatCurrency(balance.accountBalance, balance.currency) : '—'}
        </p>
      )}
      {balance && !loading && (
        <p className="text-xs text-gray-400 mt-1">{balance.currency}</p>
      )}
    </div>
  );
};
