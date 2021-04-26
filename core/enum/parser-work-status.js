import Enum from '@/core/enum/enum';

/**
 * @namespace
 * @property waiting
 * @property working
 * @property error
 * @property capcha
 */
const parserWorkStatus = new Enum([
  {
    name: 'waiting',
    title: 'Ожидание',
  },
  {
    name: 'working',
    title: 'В работе',
  },
  {
    name: 'error',
    title: 'Ошибка',
  },
  {
    name: 'capcha',
    title: 'Capcha',
  },
]);

export default parserWorkStatus;
