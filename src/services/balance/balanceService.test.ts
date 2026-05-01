import { balanceService } from './balanceService';
import axiosClient from '../../config/axiosClient';
import { API_ENDPOINTS } from '../../config/api';

jest.mock('../../config/axiosClient');
const mockAxios = axiosClient as jest.Mocked<typeof axiosClient>;

const mockBalance = { balance: 5000, currency: 'BRL' };

describe('balanceService.getBalance', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns balance data on success', async () => {
    mockAxios.get.mockResolvedValue({ data: mockBalance });
    const result = await balanceService.getBalance();
    expect(result).toEqual(mockBalance);
    expect(mockAxios.get).toHaveBeenCalledWith(API_ENDPOINTS.BALANCE);
  });

  it('throws error with message from axios error', async () => {
    const axiosError = Object.assign(new Error('Unauthorized'), {
      isAxiosError: true,
      response: { data: { message: 'Unauthorized' } },
    });
    mockAxios.get.mockRejectedValue(axiosError);
    await expect(balanceService.getBalance()).rejects.toThrow('Unauthorized');
  });

  it('throws fallback error when no response message', async () => {
    mockAxios.get.mockRejectedValue({ isAxiosError: true, response: { data: {} } });
    await expect(balanceService.getBalance()).rejects.toThrow('Failed to load balance.');
  });
});
