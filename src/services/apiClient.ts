
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import config from '../config';
import { AUTH_CONFIG, ERROR_MESSAGES } from '../constants';
import logger from '../utils/logger';

interface QueuedRequest {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  config: AxiosRequestConfig;
}

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: QueuedRequest[] = [];

  constructor() {
    this.client = axios.create({
      baseURL: config.api.baseUrl,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private processQueue(error: Error | null, token: string | null = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        if (token) {
          prom.config.headers = {
            ...prom.config.headers,
            Authorization: `Bearer ${token}`,
          };
        }
        prom.resolve(this.client(prom.config));
      }
    });

    this.failedQueue = [];
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        config.headers['X-Request-ID'] = this.generateRequestId();

        logger.debug('API Request:', {
          method: config.method,
          url: config.url,
          params: config.params,
        });

        return config;
      },
      (error) => {
        logger.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        logger.debug('API Response:', {
          status: response.status,
          url: response.config.url,
        });
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (!error.response) {
          logger.error('Network error:', error);
          toast.error(ERROR_MESSAGES.NETWORK);
          return Promise.reject(error);
        }

        const { status } = error.response;

        logger.apiError(originalRequest.url || '', error);

        switch (status) {
          case 401:
            if (!originalRequest._retry) {
              originalRequest._retry = true;

              if (!this.isRefreshing) {
                this.isRefreshing = true;
                
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                  try {
                    const response = await this.refreshToken(refreshToken);
                    const { token } = response.data;
                    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
                    this.processQueue(null, token);
                    this.isRefreshing = false;
                    
                    if (originalRequest.headers) {
                      originalRequest.headers.Authorization = `Bearer ${token}`;
                    }
                    return this.client(originalRequest);
                  } catch (refreshError) {
                    this.processQueue(refreshError as Error, null);
                    this.isRefreshing = false;
                    this.handleLogout();
                  }
                } else {
                  this.handleLogout();
                }
              }

              return new Promise((resolve, reject) => {
                this.failedQueue.push({ resolve, reject, config: originalRequest });
              });
            }
            break;

          case 403:
            toast.error(ERROR_MESSAGES.FORBIDDEN);
            break;

          case 404:
            if (!originalRequest.url?.includes('/search')) {
              toast.error(ERROR_MESSAGES.NOT_FOUND);
            }
            break;

          case 422:
            const validationErrors = error.response?.data as any;
            if (validationErrors?.errors) {
              const firstError = Object.values(validationErrors.errors)[0];
              toast.error(Array.isArray(firstError) ? firstError[0] : ERROR_MESSAGES.VALIDATION);
            } else {
              toast.error(ERROR_MESSAGES.VALIDATION);
            }
            break;

          case 500:
          case 502:
          case 503:
          case 504:
            toast.error(ERROR_MESSAGES.SERVER_ERROR);
            break;

          default:
            toast.error(ERROR_MESSAGES.GENERIC);
        }

        return Promise.reject(error);
      }
    );
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async refreshToken(refreshToken: string): Promise<AxiosResponse> {
    return this.client.post('/auth/refresh', { refreshToken });
  }

  private handleLogout() {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.USER_KEY);
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
    toast.error(ERROR_MESSAGES.UNAUTHORIZED);
  }

  async retryRequest<T>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as Error;
        
        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
        }
      }
    }

    throw lastError;
  }

  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }
}

const apiClient = new ApiClient();
export default apiClient;