import Enum from '@/core/enum/enum';

/**
 * @namespace
 */
const orderStatus = new Enum([
  {
    name: 'draft',
    title: 'Не передан',
  },
  {
    name: 'integer',
    title: 'Подтверждён',
  },
  {
    name: 'decimal',
    title: 'Дробное число',
  },
  {
    name: 'logical',
    title: 'Логический',
  },
  {
    name: 'date',
    title: 'Дата',
  },
  {
    name: 'identifier',
    title: 'Справочник',
  },
]);

export default orderStatus;
