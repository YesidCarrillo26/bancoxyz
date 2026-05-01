import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HistoryTransferPage } from './HistoryTransferPage';
import { transferService } from '../../services/transfer/transferService';

jest.mock('../../services/transfer/transferService');
jest.mock('../../components/PageHeader', () => ({
  PageHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

const mockTransferService = transferService as jest.Mocked<typeof transferService>;

const mockTransfers = [
  { value: 100, currency: 'USD', date: '2026-04-01T00:00:00Z', payeer: { document: '111', name: 'Alice' } },
  { value: 200, currency: 'BRL', date: '2026-04-15T00:00:00Z', payeer: { document: '222', name: 'Bob' } },
];

const renderPage = () => render(<MemoryRouter><HistoryTransferPage /></MemoryRouter>);

describe('HistoryTransferPage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders transfer list on success', async () => {
    mockTransferService.getTransferList.mockResolvedValue({ message: 'ok', transfers: mockTransfers });
    renderPage();
    expect(await screen.findByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('shows error when service fails', async () => {
    mockTransferService.getTransferList.mockRejectedValue(new Error('Failed to load transfer history'));
    renderPage();
    expect(await screen.findByText('Failed to load transfer history')).toBeInTheDocument();
  });

  it('filters by recipient name', async () => {
    mockTransferService.getTransferList.mockResolvedValue({ message: 'ok', transfers: mockTransfers });
    renderPage();
    await screen.findByText('Alice');
    fireEvent.change(screen.getByPlaceholderText(/search by name/i), { target: { value: 'alice' } });
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
  });

  it('filters by amount', async () => {
    mockTransferService.getTransferList.mockResolvedValue({ message: 'ok', transfers: mockTransfers });
    renderPage();
    await screen.findByText('Alice');
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. 150/i), { target: { value: '200' } });
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('filters by date', async () => {
    mockTransferService.getTransferList.mockResolvedValue({ message: 'ok', transfers: mockTransfers });
    renderPage();
    await screen.findByText('Alice');
    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: '2026-04-01' } });
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
  });

  it('shows "No transfers found" when filter matches nothing', async () => {
    mockTransferService.getTransferList.mockResolvedValue({ message: 'ok', transfers: mockTransfers });
    renderPage();
    await screen.findByText('Alice');
    fireEvent.change(screen.getByPlaceholderText(/search by name/i), { target: { value: 'xyz' } });
    expect(await screen.findByText('No transfers found')).toBeInTheDocument();
  });

});
