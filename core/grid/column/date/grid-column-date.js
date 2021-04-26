import { parseServerDate } from '@/core/util/date';

const render = (date) => {
  date = parseServerDate(date);

  return date === null ? '-' : date.toLocaleDateString();
};

export default {
  orderDataType: 'erp-date',
  type: 'num',
  render,
};
