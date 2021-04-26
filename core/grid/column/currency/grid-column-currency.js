import { formatCurrency } from '@/core/util/number';

const render = (num) =>
  `<div class="text-right w-100">${formatCurrency(num)}</div>`;

const summaryRenderer = (num) => render(num);

export default {
  render,
  summaryRenderer,
  type: 'num',
  orderDataType: 'erp-currency',
};
