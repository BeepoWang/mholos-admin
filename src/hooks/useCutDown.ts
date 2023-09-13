export const useCutDown = (totalTime: number) => {
  const timer = ref();
  const count = ref();
  const codeTips = ref('获取验证码');
  const isSend = ref(false);

  const setCountdown = () => {
    if (!timer.value) {
      count.value = totalTime;
      isSend.value = true;

      timer.value = setInterval(() => {
        if (count.value > 0 && count.value <= totalTime) {
          count.value--;
          codeTips.value = `重新发送(${count.value}s)`;
        } else {
          clearInterval(timer.value);
          timer.value = null;
          codeTips.value = '重新发送';
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
