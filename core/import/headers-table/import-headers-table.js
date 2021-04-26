import Table from '@/core/table/table';
import { chain, isEqual } from 'lodash';

const renderTpl = `
  <table>
    <thead>
      <% headers.forEach((headerValue) => { %>
        <th>
            <div class="import-headers-table__th-inner">
              <select name="Headers" class="form-control header-select">
                  <% availableHeaders.forEach((opt, index) => { %>
                      <option value="{{opt.value}}" <% if (opt.value === headerValue) { %> selected <% } %> >{{opt.text}}</option>
                  <% }); %>
              </select>
            </div>
        </th>
      <% }); %>
    </thead>
    <tbody>
        <% rows.forEach((cells) => { %>
            <tr>
                <% cells.forEach((cellValue) => { %>
                    <td class="overflow-hidden text-wrap">{{cellValue}}</td>
                <% }); %>
            </tr>
        <% }); %>
    </tbody>
  </table>
`;

class ImportHeadersTable extends Table {
  static NONE_HEADER = 'None';

  static SKIP_HEADER = 'Skip';

  constructor(p) {
    ImportHeadersTable.mergeConfig(p, {
      cls: ['import-headers-table'],
      autoInit: true,
      size: 'small',
      height: true,
      columnsAutoWidth: false,
      bordered: true,
      scrollResize: true,
      columnDefs: [{ targets: '_all', width: 300 }],
      renderTpl,
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    const $headerSelect = this.getHeaderSelects();

    $headerSelect.change(this.onHeaderSelectChange.bind(this));

    this.$headerSelect = $headerSelect;
  }

  getRenderData() {
    // const { availableHeaders, rows, headers } = this;
    //
    // return {
    //   rows,
    //   availableHeaders,
    //   headers,
    // };
  }

  get headerNameVariants() {
    let variants = this._headerNameVariants;

    if (!variants) {
      variants = chain(this.availableHeaders)
        .map(({ value }) => value)
        .pull('None', 'Skip')
        .value();

      this._headerNameVariants = variants;
    }

    return variants;
  }

  onHeaderSelectChange(e) {
    const $select = $(e.currentTarget);
    const value = $select.val();
    //null - такого значение в select нет
    // запуститься зацикленность
    if (value === null) {
      return;
    }

    const isNoneHeader = value === ImportHeadersTable.NONE_HEADER;

    $select.closest('th').toggleClass('bg-success-300', !isNoneHeader);

    const isUniqHeader =
      ImportHeadersTable.SKIP_HEADER !== value && !isNoneHeader;

    if (isUniqHeader) {
      this.syncSelectHeaderNames($select);
    }

    this.bubbleEvent('headernamechange', this, value, $select);
  }

  resetHeaderNameSelect(headerName) {
    const select = this.headerSelect.find(
      (select) => select.value === headerName
    );

    if (select) {
      this.resetHeaderSelect(select);
    }
  }

  resetHeaderSelect(select) {
    $(select).val(ImportHeadersTable.NONE_HEADER).trigger('change');
  }

  syncSelectHeaderNames($select) {
    const changedSelect = $select.get(0);
    const headerToReset = this.headerSelect.filter(
      (select) =>
        !isEqual(changedSelect, select) && select.value === changedSelect.value
    );

    if (headerToReset.length > 0) {
      headerToReset.forEach((select) => this.resetHeaderSelect(select));
    }
  }

  getHeaderSelects() {
    const header = $(this.dataTable.table().header());
    return header.find('select[name="Headers"]');
  }

  /**
   *
   * @returns {HTMLSelectElement[]}
   */
  get headerSelect() {
    return [...this.$headerSelect];
  }

  get selectedHeaders() {
    return this.headers.filter((name) => name !== 'None');
  }

  get headers() {
    return this.headerSelect.map(({ value }) => value);
  }

  /**
   *
   * @param {String[]} values
   */
  set headers(values) {
    if (values && values.length > 0) {
      [...this.$headerSelect].forEach((select, index) => {
        $(select)
          .prop('selectedIndex', values[index] || 0)
          .trigger('change');
      });

      this.adjustColumnsSize();
    }
  }
}

ImportHeadersTable.initMixins(['renderable']);

export default ImportHeadersTable;
