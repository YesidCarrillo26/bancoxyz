import { authService } from './authService';
import axiosClient from '../../config/axiosClient';
import { API_ENDPOINTS } from '../../config/api';

jest.mock('../../config/axiosClient');
const mockAxios = axiosClient as jest.Mocked<typeof axiosClient>;

const mockCredentials = { email: 'test@test.com', password: '123456' };
const mockResponse = { token: 'abc123', user: { id: 1, email: 'test@test.com', name: 'Test' } };

describe('authService.login', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns data on success', async () => {
    mockAxios.post.mockResolvedValue({ data: mockResponse });
    const result = await authService.login(mockCredentials);
    expect(result).toEqual(mockResponse);
    expect(mockAxios.post).toHaveBeenCalledWith(API_ENDPOINTS.LOGIN, mockCredentials);
  });

  it('throws error with message from axios error', async () => {
    const axiosError = Object.assign(new Error('Invalid credentials'), {
      isAxiosError: true,
      response: { data: { message: 'Invalid credentials' } },
    });
    mockAxios.post.mockRejectedValue(axiosError);
    await expect(authService.login(mockCredentials)).rejects.toThrow('Invalid credentials');
  });

  it('throws fallback error when no response message', async () => {
    mockAxios.post.mockRejectedValue({ isAxiosError: true, response: { data: {} } });
    await expect(authService.login(mockCredentials)).rejects.toThrow('Login failed. Please try again.');
  });
});
