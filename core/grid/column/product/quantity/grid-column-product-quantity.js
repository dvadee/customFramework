import { chain, each, isNaN, map, template, toNumber } from 'lodash';
import currencyColumn from '../../currency/grid-column-currency';
const cls = 'grid-product-quantity-cell';

const gridMultiRowEnabledCls = 'grid--product-quantity-cell-multi-row-enabled';

const tpl = template(`
    <div class="w-100 h-100 flex-column ${cls}__content">
      <% items.forEach((v, index) => {%>
        <div class="${cls}__content-item p-2">{{v || '-'}}</div>
      <% });%>
    </div>
    <div class="${cls}__simple-content p-2">{{common}}</div>
`);

const renderCurrency = currencyColumn.render;
/**
 * Разбивает данные по столбцами, который пришли с сервера
 * Закидывать в метод грида onLoad
 * @param data
 */
const processLoadedData = (data) => {
  each(data, (row) => {
    const { quantity } = row;

    row._quantity = quantity;

    Object.assign(row, {
      store: map(quantity, 'storeName'),
      quantity: map(quantity, 'quantity'),
      incomingPrice: map(quantity, 'incomingPrice'),
      marginSum: map(quantity, 'marginSum'),
      marginPercent: map(quantity, 'marginPercent'),
    });
  });
};

const render = function (value, isCurrency) {
  let items = value || [];
  let common;

  if (isCurrency) {
    items = items.map((v) => renderCurrency(v));
    common = items.length === 1 ? items[0] : '-';
  } else {
    const hasStringValue = items.some((v) => isNaN(+v));
    if (hasStringValue) {
      //Если все равны, показывает 1ое значение
      common = items.every((v) => v === value[0]) ? value[0] : 'Несколько';
    } else {
      //тут все числа, можно суммировать
      common = chain(items).map(toNumber).sum().value();
    }
  }

  return tpl({ items, common });
};

export default {
  render,
  className: cls,
  gridMultiRowEnabledCls,
  processLoadedData,
};
