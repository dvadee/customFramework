import { chain, difference } from 'lodash';
import Table from '@/core/table/table';

/**
 * @class ServerFormHeadersTable
 * @extend Table
 */
class ServerFormHeadersTable extends Table {
  _headerNameVariants;

  constructor(p) {
    debugger;

    // ServerFormHeadersTable.configDefaults(p, {
    //   height: 300,
    //   size: 'small',
    //   columnsAutoWidth: false,
    //   autoInit: true,
    //   columnsDefs: [
    //     {
    //       targets: [...Array(headCellCount)].map((item, index) => index),
    //       width: '300px',
    //     },
    //     {
    //       target: '_all',
    //       orderable: false,
    //       width: '300px',
    //       searchable: false,
    //     },
    //   ],
    // });

    super(p);
  }

  initComponent() {
    super.initComponent();

    const $headerSelect = this.getHeaderSelects();

    $headerSelect.change(this.onHeaderSelectChange.bind(this));

    this.$headerSelect = $headerSelect;
  }

  get headerNameVariants() {
    let variants = this._headerNameVariants;

    if (!variants) {
      const select = this.headerSelect[0];

      if (!select) {
        throw new Error('ServerFormHeadersTable - no header select find');
      }

      variants = chain(select.options)
        .toArray()
        .map(({ value }) => value)
        .pull('None')
        .value();

      this._headerNameVariants = variants;
    }

    return variants;
  }

  onHeaderSelectChange(e) {
    const $select = $(e.currentTarget);
    const value = $select.val();

    $select.parent().toggleClass('bg-success-300', value !== 'None');

    this.syncDisabledSelectHeaderNames();

    this.trigger('headerselectchange', this, $select, value);
  }

  syncDisabledSelectHeaderNames() {
    const { selectedHeaders, $headerSelect, headerNameVariants } = this;
    const buildQueryString = (names) =>
      names.map((name) => `option[value=${name}]`).join(', ');
    const toggleDisabled = (queryString, disabled = true) =>
      $headerSelect.find(queryString).attr('disabled', disabled);

    const disabledQueryString = buildQueryString(selectedHeaders);
    const enabledQueryString = buildQueryString(
      difference(headerNameVariants, selectedHeaders)
    );

    toggleDisabled(disabledQueryString, true);
    toggleDisabled(enabledQueryString, false);
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
    if (values && values.length) {
      [...this.$headerSelect].forEach((select, index) => {
        $(select)
          .val(values[index] || 'None')
          .trigger('change');
      });
    }
  }
}

export default ServerFormHeadersTable;
