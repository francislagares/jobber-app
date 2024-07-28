import axios, { AxiosResponse } from 'axios';

import { config } from '@gateway/config';
import { AxiosService } from '@gateway/services/axios';

export let axiosAuthInstance: ReturnType<typeof axios.create>;

class GigService {
  axiosService: AxiosService;

  constructor() {
    this.axiosService = new AxiosService(
      `${config.GIG_BASE_URL}/api/v1/gig`,
      'gig',
    );
    axiosAuthInstance = this.axiosService.axios;
  }

  async getGigs(
    query: string,
    from: string,
    size: string,
    type: string,
  ): Promise<AxiosResponse> {
    const response = await this.axiosService.axios.get(
      `/search/gig/${from}/${size}/${type}?${query}`,
    );

    return response;
  }

  async getGig(gigId: string): Promise<AxiosResponse> {
    const response = await this.axiosService.axios.get(`/search/gig/${gigId}`);

    return response;
  }
}

export const gigService: GigService = new GigService();
