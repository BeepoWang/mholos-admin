import { fetchCheckEmail } from '@/api/login';

export const validateEmail = (rule: any, value: any, callback: any) => {
  fetchCheckEmail({ email: value })
    .then((res) => {
      if (res.responseCode === 0) {
        console.log('data', res);
        callback();
      } else {
        callback(res.responseMessage);
      }
    })
    .catch((err) => {
      console.log(err);
      callback(err.responseMessage);
    });
};
