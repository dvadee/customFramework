import { isArray } from 'lodash';
import gridi18n from '../grid/i18n/grid-i18n';
import Component from '../component';
import $ from 'jquery';

const tableSizes = {
  small: 'table-xs',
  default: '',
  large: 'table-lg',
  xl: 'table-xl',
};

/**
 * lightweight grid
 * @class Table
 * @extend Component
 * @prop {Object[]} columns
 * @prop {Object[]} columnDefs
 * @prop {Object[]} data
 * @prop {Boolean} bordered
 * @prop {String} size
 * @prop {Number} [height=300]
 * @prop {String} [width='100%']
 * @prop {Boolean} [columnsAutoWidth=true]
 * @prop {Boolean} [hiddenTableHead=false]
 * @prop {Boolean} [sortable=false]
 * @prop {Boolean} [scrollResize=false]
 */
class Table extends Component {
  static renderTpl = '<table></table>';

  constructor(p) {
    Table.configDefaults(p, {
      autoInit: false,
      sortable: false,
      hiddenTableHead: false,
      columnsAutoWidth: true,
      scrollResize: false,
      height: 300,
      width: '100%',
    });

    super(p);
  }
  initComponent() {
    this.baseCls = 'table';

    super.initComponent();

    const { $el, size, bordered, hiddenTableHead } = this;

    if (size) {
      this.addCls(tableSizes[size]);
    }

    if (bordered) {
      this.addCls('table-bordered');
    }

    if (hiddenTableHead) {
      $el.find('thead').hide();
    }

    $el.width(this.width);

    const config = this.getDataTableConfig();

    this.dataTable = $el.DataTable(config);

    if (this.scrollResize) {
      this.initScrollResize();
    }
  }

  initEvents() {
    super.initEvents();

    $(document).on({
      'dashboard.sidebartoggle': () => this.adjustSize(),
      'custom.collapsedpanelresize': () => this.adjustSize(),
    });

    $(window).resize(() => this.adjustSize());
  }

  getDataTableConfig() {
    const { columns, columnDefs } = this;

    const config = {
      scrollX: true,
      scrollY: this.height,
      language: gridi18n,
      paging: false,
      ordering: this.sortable,
      searching: false,
      colReorder: false,
      info: false,
      scrollCollapse: true,
      autoWidth: this.columnsAutoWidth,
    };

    if (columnDefs) {
      config.columnDefs = columnDefs;
    }

    if (columns) {
      config.columns = columns;
    }

    return config;
  }

  addRows(rows) {
    if (!isArray(rows)) {
      rows = [rows];
    }

    this.dataTable.rows.add(rows).draw();
  }

  clear() {
    this.dataTable.clear().draw();
  }

  destroy() {
    this.dataTable.destroy();

    super.destroy();
  }

  get $body() {
    return this.$el.find('tbody');
  }

  get $tableRows() {
    return this.$el.find('tbody tr');
  }

  initScrollResize() {
    this.scrollResize = new $.fn.dataTable.ScrollResize(this.dataTable);
  }

  adjustColumnsSize() {
    this.dataTable?.columns?.adjust();
  }

  adjustSize() {
    this.scrollResize?._size();

    this.adjustColumnsSize();
  }

  loadRawData(data) {
    this.clear();

    this.addRows(data);
  }

  processLoadData(data) {
    super.processLoadData(data);

    this.loadRawData(data);
  }
}

export default Table;
