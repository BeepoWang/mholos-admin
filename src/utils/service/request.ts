import { useAthStoreWithOut } from '@/store/modules/auth';
import axios, { AxiosInstance } from 'axios';
import { addPending, refreshToken, removePending, showErrorInfo } from './tools';
import { MAxiosOpt, MAxiosRequestConfig, MAxiosResponse, MResponse } from './type';

const config: MAxiosOpt = {
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: import.meta.env.VITE_APP_API_TIMEOUT,
  isThrowError: false,
  withCredentials: true,
  isCancelRequest: false
};

class Request {
  instance: AxiosInstance;

  constructor(config: MAxiosOpt) {
    this.instance = axios.create(config);

    this.instance.interceptors.request.use(
      (requestConfig: MAxiosRequestConfig) => {
        const { isCancelRequest } = requestConfig;
        //  取消重复请求
        if (isCancelRequest) {
          removePending(requestConfig);
          addPending(requestConfig);
        }
        // 设置token
        const authStore = useAthStoreWithOut();
        const headerKey = authStore.header || 'Authorization';
        requestConfig.headers[headerKey] = `${authStore.tokenType} ${authStore.token}`;
        return requestConfig;
      },
      (error) => {
        console.log('requestError', error);
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      async (responseData: MAxiosResponse) => {
        const status = responseData.status;
        const res = responseData.data;
        const { isCancelRequest, isShowToast = true } = responseData.config;
        if (isCancelRequest) {
          removePending(responseData.config);
        }
        if (status === 200) {
          if (res.responseCode === 400) {
            // TODO: token 过期处理
            console.log('token 过期处理');
            const authStore = useAthStoreWithOut();
            authStore.setTokenType('');
            responseData.config.headers.Authorization = '';
            const config = await refreshToken(responseData.config);
            if (config) {
              return this.instance.request(config);
            } else {
              console.log('instance');

              await authStore.logout();
            }
            return Promise.reject(res);
          }
          if (res.responseCode === 999) {
            isShowToast && showErrorInfo(res && res.responseMessage);
            return Promise.resolve(res);
          }
          return Promise.resolve(res || {});
        } else {
          showErrorInfo(res && res.message);
          return Promise.reject(res);
        }
      },
      (error: any) => {
        if (!error.config) return Promise.reject(error);
        const { isCancelRequest } = error.config;
        isCancelRequest && removePending(error.config);

        let errMsg;
        if (error && error.response) {
          if (error.response.status === 404) {
            errMsg = '服务不存在';
          } else if (error.response.status === 500) {
            errMsg = '服务器内部错误';
          } else if (error.response.status === 504) {
            errMsg = '请求超时';
          } else {
            errMsg = '网络繁忙，请稍后重试';
          }
        } else {
          errMsg = '网络繁忙，请稍后重试';
        }
        if (error.config.isThrowError) {
          return Promise.reject(errMsg);
        } else {
          showErrorInfo(errMsg);
        }
        return Promise.reject(errMsg);
      }
    );
  }

  get<T = any, U = any>(url: string, data?: U, config = {}): Promise<MResponse<T>> {
    return this.instance.get(url, { params: data, ...config });
  }

  post<T = any, U = any>(url: string, data?: U, config = {}): Promise<MResponse<T>> {
    return this.instance.post(url, data, config);
  }

  put<T = any, U = any>(url: string, data?: U, config = {}): Promise<MResponse<T>> {
    return this.instance.put(url, data, config);
  }

  delete<T = any, U = any>(url: string, data?: U, config = {}): Promise<MResponse<T>> {
    return this.instance.delete(url, { params: data, ...config });
  }
}

const request = new Request(config);

export default request;
