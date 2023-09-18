import zhCn from 'element-plus/es/locale/lang/zh-cn';
import en from 'element-plus/es/locale/lang/en';
import { useStorage } from '@/hooks/useStorage';
import { store } from '../index';
interface Language {
  el: Recordable;
  name: string;
}

interface LocaleDropdownType {
  lang: LocaleType;
  name?: string;
  elLocale?: Language;
}

interface LocaleState {
  currentLocale: LocaleDropdownType;
  localeMap: LocaleDropdownType[];
}

const elLocaleMap = {
  'zh-CN': zhCn,
  en: en
};

const { getStorage, setStorage } = useStorage();

export const useLocaleStore = defineStore('Locale', {
  state: (): LocaleState => {
    return {
      currentLocale: {
        lang: getStorage('lang') || 'zh-CN',
        elLocale: elLocaleMap[getStorage('lang') || 'zh-CN']
      },
      localeMap: [
        {
          lang: 'zh-CN',
          name: '简体中文'
        },
        {
          lang: 'en',
          name: 'English'
        }
      ]
    };
  },
  getters: {
    getCurrentLocale(): LocaleDropdownType {
      return this.currentLocale;
    },
    getLocaleMap(): LocaleDropdownType[] {
      return this.localeMap;
    }
  },
  actions: {
    setCurrentLocale(localeMap: LocaleDropdownType) {
      this.currentLocale.lang = localeMap.lang;
      this.currentLocale.elLocale = elLocaleMap[localeMap.lang];
      setStorage('lang', localeMap.lang);
    }
  }
});

export const useLocaleStoreWithOut = () => {
  return useLocaleStore(store);
};
