import Enum from '@/core/enum/enum';

/**
 * @namespace
 * @property client
 * @property supplier
 */
const priceRequestType = new Enum([
  {
    name: 'client',
    title: 'Запрос клиента',
  },
  {
    name: 'supplier',
    title: 'Запрос по товарам поставщика',
  },
]);

export default priceRequestType;
