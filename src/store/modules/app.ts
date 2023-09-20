import { ComponentSize } from 'element-plus';
import { useStorage } from '@/hooks/useStorage';
import { store } from '../index';

const { getStorage, setStorage } = useStorage();

interface AppState {
  collapse: boolean;
  fullScreen: boolean;
  currentSize: ComponentSize;
  sizeMap: ComponentSize[];
}

export const useAppStore = defineStore('App', {
  state: (): AppState => {
    return {
      collapse: false,
      fullScreen: false,
      sizeMap: ['default', 'large', 'small'],
      currentSize: getStorage('default') || 'default'
    };
  },
  getters: {
    getCollapse(): boolean {
      return this.collapse;
    },
    getFullScreen(): boolean {
      return this.fullScreen;
    },
    getCurrentSize(): ComponentSize {
      return this.currentSize;
    }
  },
  actions: {
    setCollapse(collapse: boolean) {
      this.collapse = collapse;
    },
    setFullScreen(fullScreen: boolean) {
      this.fullScreen = fullScreen;
    },
    setCurrentSize(currentSize: ComponentSize) {
      console.log(currentSize);
      this.currentSize = currentSize;
      setStorage('currentSize', this.currentSize);
    }
  },
  persist: true
});

export const useAppStoreWithOut = () => {
  return useAppStore(store);
};
