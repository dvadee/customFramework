import Enum from './enum';

/**
 * @namespace
 * @property all
 * @property current
 * @property newlyCreated
 * @property drafts
 * @property hidden
 */
const productReadiness = new Enum([
  {
    name: 'all',
    title: 'Все товары',
  },
  {
    name: 'current',
    title: 'Текущие товары',
  },
  {
    name: 'newlyCreated',
    title: 'Недавно созданныe',
  },
  {
    name: 'drafts',
    title: 'Ожидают создания',
  },
  {
    name: 'hidden',
    title: 'Отключенные',
  },
]);

export default productReadiness;
