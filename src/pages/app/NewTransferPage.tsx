import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { transferService } from '@/services/transfer/transferService';
import { TransferRequest } from '../../types/Transfer';

const CURRENCIES = ['BRL', 'USD', 'EUR', 'GBP'];

const todayISO = () => new Date().toISOString().split('T')[0];

interface FieldErrors {
  value: string;
  payeerDocument: string;
  transferDate: string;
}

export const NewTransferPage = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const [currency, setCurrency] = useState('BRL');
  const [payeerDocument, setPayeerDocument] = useState('');
  const [transferDate, setTransferDate] = useState(todayISO());
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({ value: '', payeerDocument: '', transferDate: '' });
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const errors: FieldErrors = { value: '', payeerDocument: '', transferDate: '' };
    const numericValue = parseFloat(value);
    if (!value || isNaN(numericValue) || numericValue <= 0) errors.value = 'Amount must be greater than 0';
    if (!payeerDocument.trim()) errors.payeerDocument = 'Recipient document is required';
    if (!transferDate) errors.transferDate = 'Transfer date is required';
    setFieldErrors(errors);
    return !errors.value && !errors.payeerDocument && !errors.transferDate;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    const payload: TransferRequest = {
      value: parseFloat(value),
      currency,
      payeerDocument: payeerDocument.trim(),
      transferDate,
    };

    setIsLoading(true);
    try {
      await transferService.sendTransfer(payload);
      navigate('/home');
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Transfer failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900">
      <PageHeader title="New Transfer" />
      <div className="max-w-4xl mx-auto px-6 pb-8 flex justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Transfer Details</h2>

          <form onSubmit={handleSubmit} noValidate>
            {/* Amount + Currency */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="value">
                  Amount
                </label>
                <input
                  id="value"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className={`input-field ${fieldErrors.value ? 'border-red-400 focus:ring-red-400 bg-red-50' : ''}`}
                  value={value}
                  onChange={(e) => { setValue(e.target.value); setFieldErrors(prev => ({ ...prev, value: '' })); }}
                />
                {fieldErrors.value && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.value}</p>
                )}
              </div>

              <div className="w-28">
                <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="currency">
                  Currency
                </label>
                <select
                  id="currency"
                  className="input-field"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  {CURRENCIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Recipient Document */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="payeerDocument">
                Recipient Document
              </label>
              <input
                id="payeerDocument"
                type="text"
                placeholder="CPF / ID number"
                className={`input-field ${fieldErrors.payeerDocument ? 'border-red-400 focus:ring-red-400 bg-red-50' : ''}`}
                value={payeerDocument}
                onChange={(e) => { setPayeerDocument(e.target.value); setFieldErrors(prev => ({ ...prev, payeerDocument: '' })); }}
              />
              {fieldErrors.payeerDocument && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.payeerDocument}</p>
              )}
            </div>

            {/* Transfer Date */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="transferDate">
                Transfer Date
              </label>
              <input
                id="transferDate"
                type="date"
                className={`input-field ${fieldErrors.transferDate ? 'border-red-400 focus:ring-red-400 bg-red-50' : ''}`}
                value={transferDate}
                min={todayISO()}
                onChange={(e) => { setTransferDate(e.target.value); setFieldErrors(prev => ({ ...prev, transferDate: '' })); }}
              />
              {fieldErrors.transferDate && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.transferDate}</p>
              )}
            </div>

            {apiError && (
              <p className="text-red-500 text-sm mb-4">{apiError}</p>
            )}

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full"
              >
                {isLoading ? 'Sending...' : 'Send Transfer'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/home')}
                className="btn-secondary w-full"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
