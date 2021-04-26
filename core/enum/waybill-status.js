import Enum from '@/core/enum/enum';

/**
 * @namespace
 * @prop queued
 * @prop accepting
 * @prop opened
 * @prop closing
 * @prop closed
 * @prop expired
 * @prop cancelled
 */
const waybillStatus = new Enum([
  {
    title: 'Ожидает приёмки',
    name: 'queued',
  },
  {
    title: 'Принимается',
    name: 'accepting',
  },
  {
    title: 'Открыта',
    name: 'opened',
  },
  {
    title: 'На закрытии',
    name: 'closing',
  },
  {
    title: 'Закрыта',
    name: 'closed',
  },
  {
    title: 'Не приехала',
    name: 'expired',
  },
  {
    title: 'Отказались',
    name: 'cancelled',
  },
]);

export default waybillStatus;
