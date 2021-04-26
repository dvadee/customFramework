import Enum from '@/core/enum/enum';

/**
 * @namespace
 * @property string
 * @property integer
 * @property decimal
 * @property logical
 * @property date
 * @property identifier
 */
const parameterValueType = new Enum([
  {
    name: 'string',
    title: 'Строка',
  },
  {
    name: 'integer',
    title: 'Целое число',
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

export default parameterValueType;
