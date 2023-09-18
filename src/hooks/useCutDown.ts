import { useI18n } from '@/hooks/useI18n';

const { t } = useI18n();

export const useCutDown = (totalTime: number) => {
  const timer = ref();
  const count = ref();
  const codeTips = ref(t('common.getCode'));
  const isSend = ref(false);

  const setCountdown = () => {
    if (!timer.value) {
      count.value = totalTime;
      isSend.value = true;

      timer.value = setInterval(() => {
        if (count.value > 0 && count.value <= totalTime) {
          count.value--;
          codeTips.value = `${t('common.resend')}(${count.value}s)`;
        } else {
          clearInterval(timer.value);
          timer.value = null;
          codeTips.value = t('common.resend');
          isSend.value = false;
        }
      }, 1000);
    }
  };

  return {
    codeTips,
    isSend,
    setCountdown
  };
};
