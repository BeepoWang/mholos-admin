import { useAppStoreWithOut } from '@/store/modules/app';

const appStore = useAppStoreWithOut();

export const usePageLoading = () => {
  const loadStart = () => {
    console.log('start', appStore.getPageLoading);
    appStore.setPageLoading(true);
  };

  const loadDone = () => {
    console.log('done', appStore.getPageLoading);
    appStore.setPageLoading(false);
  };

  return {
    loadStart,
    loadDone
  };
};
