import { ComponentSize } from 'element-plus';
import { useStorage } from '@/hooks/useStorage';
import { store } from '../index';

const { getStorage, setStorage } = useStorage();

interface AppState {
  nameSpace: string;
  collapse: boolean;
  fullScreen: boolean;
  mobile: boolean;
  fixedHeader: boolean;
  tagsView: boolean;
  logo: boolean;
  pageLoading: boolean;
  locale: boolean;
  uniqueOpened: boolean;
  breadcrumb: boolean; // 面包屑
  breadcrumbIcon: boolean; // 面包屑图标
  currentSize: ComponentSize;
  sizeMap: ComponentSize[];
  title: string;
  size: boolean;
  layout: LayoutType;
}

export const useAppStore = defineStore('App', {
  state: (): AppState => {
    return {
      nameSpace: 'mholosAdmin',
      mobile: false, // 是否移动端
      collapse: false, // 是否折叠菜单
      fullScreen: true, // 是否展示全屏
      fixedHeader: true, // 是否固定header
      tagsView: true, // 是否展示tagsView
      pageLoading: false, // 路由跳转loading
      breadcrumb: true,
      breadcrumbIcon: true,
      logo: true, // 是否展示logo
      size: true, // 是否展示 size
      locale: true, // 是否展示国际化
      uniqueOpened: true, // 是否只保持一个子菜单的展开
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
    },
    getUniqueOpened(): boolean {
      return this.uniqueOpened;
    },
    getBreadcrumb(): boolean {
      return this.breadcrumb;
    },
    getBreadcrumbIcon(): boolean {
      return this.breadcrumbIcon;
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
    },
    setUniqueOpened(uniqueOpened: boolean) {
      this.uniqueOpened = uniqueOpened;
    }
  },
  persist: true
});

export const useAppStoreWithOut = () => {
  return useAppStore(store);
};
