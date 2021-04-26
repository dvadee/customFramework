import { isNumber } from 'lodash';

const formatCurrency = (num) => {
  return isNumber(num)
    ? num.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })
    : '';
};

const convertToInt = (int) => parseInt(int) || null;

export { formatCurrency, convertToInt };
