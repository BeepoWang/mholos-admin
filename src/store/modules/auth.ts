import { fetchUserInfo } from '@/api/auth';
import { store } from '../index';
import { fetchLogin } from '@/api/login';
import { useStorage } from '@/hooks/useStorage';

const { getStorage, setStorage } = useStorage();

interface AuthState {
  token: string;
  refreshToken: string;
  tokenType: string;
  headerKey: string;
  userInfo: UserInfo;
}

export const useAuthStore = defineStore('Auth', {
  state: (): AuthState => {
    return {
      token: getStorage('token') || '',
      refreshToken: getStorage('refreshToken') || '',
      tokenType: getStorage('tokenType') || '',
      headerKey: getStorage('headerKey') || '',
      userInfo: {} as UserInfo
    };
  },
  persist: true,
  getters: {
    getToken(): string {
      return this.token;
    },
    getRefreshToken(): string {
      return this.refreshToken;
    },
    getTokenType(): string {
      return this.tokenType;
    },
    getHeaderKey(): string {
      return this.headerKey;
    },
    getUserInfo(): UserInfo {
      return this.userInfo;
    }
  },
  actions: {
    setToken(token: string) {
      this.token = token;
      setStorage('token', this.token);
    },
    setRefreshToken(refreshToken: string) {
      this.refreshToken = refreshToken;
      setStorage('refreshToken', this.refreshToken);
    },
    setHeader(headerKey: string) {
      this.headerKey = headerKey;
      setStorage('header', this.headerKey);
    },
    setTokenType(tokenType: string) {
      this.tokenType = tokenType;
      setStorage('tokenType', this.tokenType);
    },
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo;
      setStorage('userInfo', this.userInfo);
    },
    async userLogin(params: LoginParams) {
      const res = await fetchLogin(params);
      if (res.responseCode === 0) {
        const recMsg = res.data;
        this.setHeader(recMsg.header);
        this.setToken(recMsg.token);
        this.setRefreshToken(recMsg.refreshToken);
        this.setTokenType(recMsg.tokenType);
        return Promise.resolve(res);
      } else {
        return Promise.reject(res);
      }
    },
    async getUserDetail() {
      const res = await fetchUserInfo();
      if (res.responseCode === 0) {
        this.setUserInfo(res.data);
        return Promise.resolve(res.data);
      } else {
        useRouter().push('/login');
        return Promise.reject(res);
      }
    },

    logout() {
      this.setHeader('');
      this.setToken('');
      this.setRefreshToken('');
      this.setTokenType('');
    }
  }
});

export const useAuthStoreWithOut = () => {
  return useAuthStore(store);
};
