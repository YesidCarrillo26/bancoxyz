import axiosClient from '../config/axiosClient';
import { API_ENDPOINTS } from '../config/api';
import { LoginRequest, LoginResponse } from '../types/Auth';
import { getErrorMessage } from '../helpers/serviceError';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const { data } = await axiosClient.post<LoginResponse>(
        API_ENDPOINTS.LOGIN,
        credentials
      );
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Login failed. Please try again.'));
    }
  },
};
