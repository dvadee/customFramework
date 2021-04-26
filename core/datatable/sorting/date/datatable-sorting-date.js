import { registerSorting } from '../datatable-sorting';
import { parseServerDate } from '@/core/util/date';

registerSorting('erp-date', function (d) {
  d = parseServerDate(d);

  return d === null ? -1 : d.getTime();
});
