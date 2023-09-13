import { store } from '../index';

interface AppState {
  collapse: boolean;
  fullScreen: boolean;
}

export const useAppStore = defineStore('App', {
  state: (): AppState => {
    return {
      collapse: false,
      fullScreen: false
    };
  },
  getters: {
    getCollapse(): boolean {
      return this.collapse;
    },
    getFullScreen(): boolean {
      return this.fullScreen;
    }
  },
  actions: {
    setCollapse(collapse: boolean) {
      this.collapse = collapse;
    },
    setFullScreen(fullScreen: boolean) {
      this.fullScreen = fullScreen;
    }
  },
  persist: true
});

export const useAppStoreWithOut = () => {
  return useAppStore(store);
};
