import axios, { AxiosResponse } from 'axios';

import { SellerDocument } from '@francislagares/jobber-shared';

import { config } from '@gateway/config';
import { AxiosService } from '@gateway/services/axios';

export let axiosSellerInstance: ReturnType<typeof axios.create>;

class SellerService {
  constructor() {
    const axiosService: AxiosService = new AxiosService(
      `${config.USERS_BASE_URL}/api/v1/seller`,
      'seller',
    );
    axiosSellerInstance = axiosService.axios;
  }

  async getSellerById(sellerId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosSellerInstance.get(
      `/id/${sellerId}`,
    );
    return response;
  }

  async getCurrentSellerByUsername(): Promise<AxiosResponse> {
    const response = await axiosSellerInstance.get('/username');

    return response;
  }

  async getSellerByUsername(username: string): Promise<AxiosResponse> {
    const response = await axiosSellerInstance.get(`/username/${username}`);

    return response;
  }

  async getRandomSellers(size: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosSellerInstance.get(
      `/random/${size}`,
    );

    return response;
  }

  async createSeller(body: SellerDocument): Promise<AxiosResponse> {
    const response = await axiosSellerInstance.post('/create', body);

    return response;
  }

  async updateSeller(
    sellerId: string,
    body: SellerDocument,
  ): Promise<AxiosResponse> {
    const response = await axiosSellerInstance.put(`${sellerId}`, body);

    return response;
  }

  async seed(count: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosSellerInstance.post(
      `/seed/${count}`,
    );

    return response;
  }
}

export const sellerService: SellerService = new SellerService();
