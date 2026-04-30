import axiosClient from '@/config/axiosClient';
import { API_ENDPOINTS } from '@/config/api';
import { TransferRequest, TransferResponse, TransferListResponse } from '@/types/Transfer';
import { getErrorMessage } from '@/helpers/serviceError';

export const transferService = {
  sendTransfer: async (payload: TransferRequest): Promise<TransferResponse> => {
    try {
      const { data } = await axiosClient.post<TransferResponse>(
        API_ENDPOINTS.TRANSFER,
        payload
      );
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Transfer failed. Please try again.'));
    }
  },

  getTransferList: async (): Promise<TransferListResponse> => {
    try {
      const { data } = await axiosClient.get<TransferListResponse>(
        API_ENDPOINTS.TRANSFER_LIST
      );
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to load transfer history.'));
    }
  },
};
