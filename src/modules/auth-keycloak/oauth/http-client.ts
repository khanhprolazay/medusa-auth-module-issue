import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Make a wrapper class in case of future changes
export class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create();
  }

  get<T>(url: string, config: AxiosRequestConfig = {}) {
    return this.client.get<T>(url, config);
  }

  post<T>(url: string, data: any, config: AxiosRequestConfig = {}) {
    return this.client.post<T>(url, data, config);
  }

  put<T>(url: string, data: any) {
    return this.client.put<T>(url, data);
  }

  delete(url: string) {
    return this.client.delete(url);
  }
}