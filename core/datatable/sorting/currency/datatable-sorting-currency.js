import { registerSorting } from '../datatable-sorting';
import { convertToInt } from '@/core/util/number';

registerSorting('erp-currency', function (v) {
  v = convertToInt(v);

  return v ?? -1;
});
