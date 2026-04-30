import axiosClient from '../../config/axiosClient';
import { BalanceResponse } from '../../types/Balance';
import { API_ENDPOINTS } from '../../config/api';
import { getErrorMessage } from '../../helpers/serviceError';

export const balanceService = {
  getBalance: async (): Promise<BalanceResponse> => {
    try {
      const { data } = await axiosClient.get<BalanceResponse>(
        API_ENDPOINTS.BALANCE
      );
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to load balance.'));
    }
  },
};
