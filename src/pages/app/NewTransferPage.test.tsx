import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NewTransferPage } from './NewTransferPage';
import { transferService } from '../../services/transfer/transferService';

jest.mock('../../services/transfer/transferService');
jest.mock('../../components/PageHeader', () => ({
  PageHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockNavigate = jest.fn();
const mockTransferService = transferService as jest.Mocked<typeof transferService>;

const renderPage = () => render(<MemoryRouter><NewTransferPage /></MemoryRouter>);

const fillForm = (amount: string, document: string) => {
  fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: amount } });
  fireEvent.change(screen.getByLabelText(/recipient document/i), { target: { value: document } });
};

describe('NewTransferPage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows validation error when amount is empty or zero', async () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /send transfer/i }));
    expect(await screen.findByText('Amount must be greater than 0')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: /send transfer/i }));
    expect(await screen.findByText('Amount must be greater than 0')).toBeInTheDocument();
  });

  it('shows validation error when document is empty', async () => {
    renderPage();
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '100' } });
    fireEvent.click(screen.getByRole('button', { name: /send transfer/i }));
    expect(await screen.findByText('Recipient document is required')).toBeInTheDocument();
  });

  it('calls sendTransfer and navigates to /home on success', async () => {
    mockTransferService.sendTransfer.mockResolvedValue({ message: 'ok' });
    renderPage();
    fillForm('150', '12345678');
    fireEvent.click(screen.getByRole('button', { name: /send transfer/i }));
    await waitFor(() => {
      expect(mockTransferService.sendTransfer).toHaveBeenCalledWith(
        expect.objectContaining({ value: 150, payeerDocument: '12345678' })
      );
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it('shows API error when sendTransfer fails', async () => {
    mockTransferService.sendTransfer.mockRejectedValue(new Error('Insufficient funds'));
    renderPage();
    fillForm('150', '12345678');
    fireEvent.click(screen.getByRole('button', { name: /send transfer/i }));
    expect(await screen.findByText('Insufficient funds')).toBeInTheDocument();
  });

  it('navigates to /home on cancel', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });
});
