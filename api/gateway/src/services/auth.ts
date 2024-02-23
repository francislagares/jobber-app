import { config } from '@gateway/config';
import { AxiosService } from '@gateway/services/axios';
import axios from 'axios';

export let axiosAuthInstance: ReturnType<typeof axios.create>;

class AuthService {
  axiosService: AxiosService;

  constructor() {
    this.axiosService = new AxiosService(
      `${config.AUTH_BASE_URL}/api/v1/auth`,
      'auth',
    );
    axiosAuthInstance = this.axiosService.axios;
  }
}

export const authService: AuthService = new AuthService();
