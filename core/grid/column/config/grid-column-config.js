/**
 * Применяется к колонкам как defaults
 */

import ActionsColumn from '../actions/grid-column-actions';
import RowNumberColumn from '../row-number/row-numberer';
import CheckColumn from '../check/grid-column-check';
import ImageColumn from '../image/grid-column-image';
import DragColumn from '../drag/grid-column-drag';
import UrlColumn from '../url/grid-column-url';
import CurrencyColumn from '../currency/grid-column-currency';
import DateColumn from '../date/grid-column-date';

const check = {
  data: 'checked',
  width: 30,
  minWidth: 30,
  orderable: false,
  ...CheckColumn,
};

const rowNumber = {
  data: 'rowNumber',
  minWidth: 30,
  title: '№',
  orderable: false,
  search: false,
  ...RowNumberColumn,
};

const actions = {
  data: 'actions',
  orderable: false,
  search: false,
  ...ActionsColumn,
};

const image = {
  orderable: false,
  search: false,
  ...ImageColumn,
};

const drag = {
  width: 30,
  data: 'drag',
  align: 'center',
  orderable: false,
  search: false,
  ...DragColumn,
};

const url = {
  ...UrlColumn,
};

const currency = {
  ...CurrencyColumn,
};

const date = {
  ...DateColumn,
};

export default { actions, check, rowNumber, image, drag, url, currency, date };
