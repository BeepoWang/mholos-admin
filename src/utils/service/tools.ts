import { fetchRefreshToken } from '@/api/auth';
import { useAuthStore } from '@/store/modules/auth';
import { MAxiosRequestConfig, AxiosRequestConfig } from './type';
import axios from 'axios';

const pendingMap = new Map();
const generateReqKey = (config: MAxiosRequestConfig) => {
  const { method, url, params, data } = config;
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&');
};

export const addPending = (config: MAxiosRequestConfig) => {
  const pendingKey = generateReqKey(config);
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pendingMap.has(pendingKey)) {
        pendingMap.set(pendingKey, cancel);
      }
    });
};

export const removePending = (config: MAxiosRequestConfig) => {
  const pendingKey = generateReqKey(config);
  if (pendingMap.has(pendingKey)) {
    const cancel = pendingMap.get(pendingKey);
    cancel && cancel(pendingKey);
    pendingMap.delete(pendingKey);
  }
};

export const showErrorInfo = (msg: string) => {
  ElMessage({
    type: 'error',
    message: msg && msg.toString()
  });
};

export const refreshToken = async (axiosConfig: AxiosRequestConfig) => {
  const res = await fetchRefreshToken({
    refreshToken: useAuthStore().refreshToken
  });
  if (res.responseCode === 0) {
    useAuthStore().setToken(res.data.token);
    useAuthStore().setRefreshToken(res.data.refreshToken);
    useAuthStore().setTokenType(res.data.tokenType);
    const config = { ...axiosConfig };
    if (config.headers) {
      config.headers.Authorization = `${useAuthStore().tokenType} ${useAuthStore().token}`;
    }
    return config;
  }
  return null;
};
