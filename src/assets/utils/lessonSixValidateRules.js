export const validateOrderForm = (data) => {
  const errors = {};

  if (!data.name) {
    errors.name = '請輸入收件人姓名';
  }

  if (!data.email) {
    errors.email = '請輸入 Email';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = '請輸入正確的 Email 格式';
  }

  if (!data.tel) {
    errors.tel = '請輸入電話';
  } else if (data.tel.length <= 8) {
    errors.tel = '請輸入超過 8 碼的電話號碼';
  }

  if (!data.address) {
    errors.address = '請輸入收件地址';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};