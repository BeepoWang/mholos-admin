import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export type { AxiosRequestConfig } from 'axios';

export interface MAxiosOpt {
  baseURL?: string;
  timeout?: number;
  withCredentials?: boolean;
  isThrowError?: boolean;
  isShowToast?: boolean;
  isCancelRequest?: boolean;
}

export interface MAxiosRequestConfig extends InternalAxiosRequestConfig {
  isThrowError?: boolean;
  isShowToast?: boolean;
  isCancelRequest?: boolean;
}

export interface MAxiosResponse extends AxiosResponse {
  config: MAxiosRequestConfig;
}

export interface MResponse<T = any> {
  responseCode: number | string;
  responseMessage: string;
  data: T;
}
