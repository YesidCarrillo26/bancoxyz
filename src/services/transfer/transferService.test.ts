import { transferService } from './transferService';
import axiosClient from '../../config/axiosClient';
import { API_ENDPOINTS } from '../../config/api';

jest.mock('../../config/axiosClient');
const mockAxios = axiosClient as jest.Mocked<typeof axiosClient>;

const mockPayload = { value: 100, currency: 'USD', payeerDocument: '12345678', transferDate: '2026-04-30' };
const mockTransfer = { payeer: { document: '12345678', name: 'John' }, value: 100, currency: 'USD', date: '2026-04-30T00:00:00Z' };

describe('transferService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('sendTransfer', () => {
    it('returns response on success', async () => {
      mockAxios.post.mockResolvedValue({ data: { message: 'Transfer successful' } });
      const result = await transferService.sendTransfer(mockPayload);
      expect(result).toEqual({ message: 'Transfer successful' });
      expect(mockAxios.post).toHaveBeenCalledWith(API_ENDPOINTS.TRANSFER, mockPayload);
    });

    it('throws error with message from axios error', async () => {
      const axiosError = Object.assign(new Error('Insufficient funds'), {
        isAxiosError: true,
        response: { data: { message: 'Insufficient funds' } },
      });
      mockAxios.post.mockRejectedValue(axiosError);
      await expect(transferService.sendTransfer(mockPayload)).rejects.toThrow('Insufficient funds');
    });

    it('throws fallback error when no response message', async () => {
      mockAxios.post.mockRejectedValue({ isAxiosError: true, response: { data: {} } });
      await expect(transferService.sendTransfer(mockPayload)).rejects.toThrow('Transfer failed. Please try again.');
    });
  });

  describe('getTransferList', () => {
    it('returns transfer list on success', async () => {
      const mockData = { message: 'ok', transfers: [mockTransfer] };
      mockAxios.get.mockResolvedValue({ data: mockData });
      const result = await transferService.getTransferList();
      expect(result).toEqual(mockData);
      expect(mockAxios.get).toHaveBeenCalledWith(API_ENDPOINTS.TRANSFER_LIST);
    });

    it('throws error with message from axios error', async () => {
      const axiosError = Object.assign(new Error('Forbidden'), {
        isAxiosError: true,
        response: { data: { message: 'Forbidden' } },
      });
      mockAxios.get.mockRejectedValue(axiosError);
      await expect(transferService.getTransferList()).rejects.toThrow('Forbidden');
    });

    it('throws fallback error when no response message', async () => {
      mockAxios.get.mockRejectedValue({ isAxiosError: true, response: { data: {} } });
      await expect(transferService.getTransferList()).rejects.toThrow('Failed to load transfer history.');
    });
  });
});
