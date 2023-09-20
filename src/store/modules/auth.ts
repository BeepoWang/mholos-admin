import { fetchUserInfo } from '@/api/auth';
import { store } from '../index';
import { fetchLogin } from '@/api/login';

interface AuthState {
  token: string;
  refreshToken: string;
  tokenType: string;
  header: string;
  userInfo: UserInfo;
}

export const useAuthStore = defineStore('Auth', {
  state: (): AuthState => {
    return {
      token: '',
      refreshToken: '',
      tokenType: '',
      header: '',
      userInfo: {} as UserInfo
    };
  },
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
    getHeaderType(): string {
      return this.header;
    },
    getUserInfo(): UserInfo {
      return this.userInfo;
    }
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setRefreshToken(refreshToken: string) {
      this.refreshToken = refreshToken;
    },
    setHeader(header: string) {
      this.header = header;
    },
    setTokenType(tokenType: string) {
      this.tokenType = tokenType;
    },
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo;
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

    logout() {}
  }
});

export const useAthStoreWithOut = () => {
  return useAuthStore(store);
};
