import Enum from '@/core/enum/enum';

/**
 * @namespace
 * @property start
 * @property stop
 * @property abort
 */
const parserManageStatus = new Enum([
  {
    name: 'start',
    title: 'Стартовать',
  },
  {
    name: 'stop',
    title: 'Остановить',
  },
  {
    name: 'abort',
    title: 'Отключить',
  },
]);

export default parserManageStatus;
