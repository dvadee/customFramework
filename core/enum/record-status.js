import Enum from '@/core/enum/enum';

/**
 * @namespace
 * @property hidden
 * @property draft
 * @property regular
 * @property disabled
 */
const recordStatus = new Enum([
  {
    name: 'hidden',
    title: 'Убран с витрины',
  },
  {
    name: 'draft',
    title: 'Черновик',
  },
  {
    name: 'regular',
    title: 'В продаже',
  },
  {
    name: 'disabled',
    title: 'Недействителен',
  },
]);

export default recordStatus;
