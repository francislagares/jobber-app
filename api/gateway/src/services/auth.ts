import axios, { AxiosResponse } from 'axios';

import { Auth } from '@francislagares/jobber-shared';

import { config } from '@gateway/config';
import { AxiosService } from '@gateway/services/axios';

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

  async getCurrentUser(): Promise<AxiosResponse> {
    const response = await axiosAuthInstance.get('/current-user');

    return response;
  }

  async getRefreshToken(username: string): Promise<AxiosResponse> {
    const response = await axiosAuthInstance.get(`/refresh-token/${username}`);

    return response;
  }

  async signUp(body: Auth) {
    const response = await this.axiosService.axios.post('/signup', body);

    return response;
  }

  async signIn(body: Auth) {
    const response = await this.axiosService.axios.post('/signin', body);

    return response;
  }

  async verifyEmail(token: string): Promise<AxiosResponse> {
    const response = await axiosAuthInstance.put('/verify-email', { token });

    return response;
  }

  async resendEmail(data: {
    userId: number;
    email: string;
  }): Promise<AxiosResponse> {
    const response = await axiosAuthInstance.post('/resend-email', data);

    return response;
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<AxiosResponse> {
    const response = await axiosAuthInstance.put('/change-password/', {
      currentPassword,
      newPassword,
    });

    return response;
  }

  async forgotPassword(email: string): Promise<AxiosResponse> {
    const response = await this.axiosService.axios.put('/forgot-password/', {
      email,
    });

    return response;
  }

  async resetPassword(
    token: string,
    password: string,
    confirmPassword: string,
  ): Promise<AxiosResponse> {
    const response = await this.axiosService.axios.put(
      `/reset-password/${token}`,
      {
        password,
        confirmPassword,
      },
    );

    return response;
  }

  async seed(count: string): Promise<AxiosResponse> {
    const response = await this.axiosService.axios.post(`/seed/${count}`);

    return response;
  }
}

export const authService: AuthService = new AuthService();
