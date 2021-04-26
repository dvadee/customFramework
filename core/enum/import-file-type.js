import Enum from '@/core/enum/enum';

/**
 * @namespace
 * @property pricelist
 * @property response
 * @property request
 * @property order
 * @property products
 */
const importFileType = new Enum([
  { name: 'pricelist', title: 'Прайс-лист' },
  { name: 'response', title: 'Ответ' },
  { name: 'request', title: 'Запрос' },
  { name: 'order', title: 'Заказ' },
  { name: 'products', title: 'Номенклатура' },
]);

export default importFileType;
