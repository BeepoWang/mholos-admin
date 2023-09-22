import { ComponentSize } from 'element-plus';
import { useStorage } from '@/hooks/useStorage';
import { store } from '../index';

const { getStorage, setStorage } = useStorage();

interface AppState {
  collapse: boolean;
  fullScreen: boolean;
  mobile: boolean;
  fixedHeader: boolean;
  tagsView: boolean;
  logo: boolean;
  pageLoading: boolean;
  locale: boolean;
  currentSize: ComponentSize;
  sizeMap: ComponentSize[];
  title: string;
  size: boolean;
  layout: LayoutType;
}

export const useAppStore = defineStore('App', {
  state: (): AppState => {
    return {
      mobile: false,
      collapse: false,
      fullScreen: true,
      fixedHeader: true,
      tagsView: false,
      pageLoading: false,
      logo: true,
      size: true,
      locale: true,
      title: import.meta.env.VITE_APP_TITLE,
      sizeMap: ['default', 'large', 'small'],
      currentSize: getStorage('default') || 'default',
      layout: getStorage('layout') || 'classic'
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
    },
    getTitle(): string {
      return this.title;
    },
    getLayout(): LayoutType {
      return this.layout;
    },
    getMobile(): boolean {
      return this.mobile;
    },
    getFixedHeader(): boolean {
      return this.fixedHeader;
    },
    getTagsView(): boolean {
      return this.tagsView;
    },
    getLogo(): boolean {
      return this.logo;
    },
    getSize(): boolean {
      return this.size;
    },
    getLocale(): boolean {
      return this.locale;
    },
    getPageLoading(): boolean {
      return this.pageLoading;
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
      this.currentSize = currentSize;
      setStorage('currentSize', this.currentSize);
    },
    setLayout(layout: LayoutType) {
      this.layout = layout;
      setStorage('layout', this.layout);
    },
    setTitle(title: string) {
      this.title = title;
    },
    setMobile(mobile: boolean) {
      this.mobile = mobile;
    },
    setFixHeader(fixedHeader: boolean) {
      this.fixedHeader = fixedHeader;
    },
    setTagView(tagsView: boolean) {
      this.tagsView = tagsView;
    },
    setLogo(logo: boolean) {
      this.logo = logo;
    },
    setSize(size: boolean) {
      this.size = size;
    },
    setLocale(locale: boolean) {
      this.locale = locale;
    },
    setPageLoading(pageLoading: boolean) {
      this.pageLoading = pageLoading;
    }
  },
  persist: true
});

export const useAppStoreWithOut = () => {
  return useAppStore(store);
};
