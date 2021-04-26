import { get, isNumber, upperFirst, defer, isFunction, forIn } from 'lodash';
import { blockEl, unblockEl } from '@/base/js/limitlessAppCustom';
import Component from '../component';
import GridSettingsWidget from '@/core/grid/settings/widget/grid-settings-widget';
import GridFilter from './filter/grid-filter';
import GridProxy from './proxy/grid-proxy';
import GridColumn from './column/grid-column';
import GridHighlight from './highlight/grid-highlight';
import gridi18n from './i18n/grid-i18n';
import { showInfo } from '../notify/alert';
import GridSearch from './search/grid-search';
import Base from '@/core/base';
import './grid.scss';
/**
 * @class Grid
 * @extend Base
 * @mixes ObservableMixin
 * @mixes StatefulMixin
 * @mixes BindableMixin
 * @mixes PropertiableMixin
 * @prop {GridColumn} columnsManager
 * @prop {String} selectionType
 * @prop {Boolean} enableSearch
 * @prop {Boolean} enableHighlightRows
 * @prop {Boolean} selectionEnabled
 * @prop {Boolean} hoverableRows
 *
 * @event gridready
 * @event rowselect
 * @event selectionchange
 * @prop {String} selector
 * @prop {Object} ajaxCfg
 * @prop {String} ajaxCfg.url
 * @prop {Object} dataTableCfg DataTable addCfg
 * @prop {Boolean} enableFilter
 * @prop {Boolean} enableSettings
 * @prop {Array[]} columns DataTable columns config
 * @prop {String} columns.data
 * @prop {String} columns.title
 * @prop {String|Function} columns.render
 * @prop {Object} listeners
 * @prop {Function} saveRowEditProxy
 * @prop {Boolean} selectionEnabled
 * @prop {Object} selectionConfig
 * @prop {String} tableWidth
 * @prop {Boolean} hoverableRows
 * @prop {Boolean} enableHighlightRows
 * @prop {String} highlightCls
 * @prop {Function} isHighlightRow
 * @prop {Boolean} enableSearch
 * @prop {Array[]} sorting
 * @prop {Object[]} localData
 * @prop {Object[]} columns
 */
class Grid extends Base {
  enableTableFooter;
  /**
   *
   * @type {[string]}
   * К этим колонкам не применяется строка фильтра и переключатель видимости колонки
   */
  get specialColumns() {
    return this.columnsManager.specialColumns;
  }

  constructor(p) {
    Grid.configDefaults(p, {
      enableFilter: true,
      enableSettings: true,
      hoverableRows: false,
      enableSearch: false,
      enableHighlightRows: false,
      columnDefaults: {},
      tableFooterEnabled: false,
      baseCls: 'grid',
      headerCls: 'grid__header',
      footerCls: 'grid__footer',
      columnsCls: 'grid__columns',
      headerPanelCls: 'grid__panel-header',
      bodyCls: 'grid__body',
      settingsCtCls: 'grid__settings-ct',
      toolbarCls: 'grid__toolbar',
      pagingCls: 'grid__paging',
      actionBtnCls: 'grid__action-btn',
      disablePagingCls: 'grid--paging-disabled',
      disableSettingsCls: 'grid--settings-disabled',
      hiddenHeaderCls: 'grid--header-hidden',
      tableFixedCls: 'grid--table-fixed',
      hoverableRowsCls: 'grid--hover',
      height: 500,
      rowHeight: 27,
      initialized: false,
      tableCls: 'grid__table table datatable-basic table-bordered bg-white',
      tdCls: 'grid__td',
      thCls: 'grid__th',
      rowCls: 'grid__row',
      selectedRowCls: 'grid__row--selected',
      highlightCls: 'bg-primary-300',
      stateEvents: ['columnsvisiblechange'],
      selectFirstOnDraw: false,
      idField: 'id',
    });

    Grid.mergeConfig(p, {
      props: {
        searchValue: undefined,
        tableData: undefined,
        readOnly: false,
      },
    });

    super(p);

    if (this.loadProxy) {
      this.proxyApi = this.loadProxy;
    }

    this.$tableEl = this.$tableEl || this.$el || $(this.selector);

    if (!this.$tableEl || !this.$tableEl.get(0)) {
      throw new Error('Grid - $tableEl required!');
    }

    this.initObservable();

    this.initProps();

    this.initViewModel();

    this.initColumnsManager();

    this.initDataTableConfig();

    this.render();

    this.initComponent();

    this.ready = true;

    if (this.localData) {
      this.loadRawData(this.localData);

      this.localData = null;

      return;
    }

    if (this.autoLoad) {
      this.load();
    }

    // this.adjustSize();
  }

  get isServerSideTable() {
    return this.dataTableCfg.serverSide || false;
  }

  get $tableHead() {
    return this.$tableEl.find('thead');
  }

  get $tableScrollHead() {
    return this.$el.find('.dataTables_scrollHead');
  }

  get $tableScrollHeadInner() {
    return this.$el.find('.dataTables_scrollHeadInner');
  }

  get $tableScrollHeaderTable() {
    return this.$tableScrollHeadInner.find('.table');
  }

  get $tableScrollContainer() {
    return this.$body.find('.dataTables_scrollBody');
  }

  updateSearchValue(value) {
    if (this.gridSearch) {
      this.gridSearch.searchValue = value;
    }
  }

  updateTableData(data) {
    if (this.isLoadable) {
      return;
    }

    if (this.ready) {
      this.loadRawData(data);
    } else {
      this.localData = data;
    }
  }

  updateReadOnly(readOnly, oldState) {
    if (oldState !== undefined) {
      this.redrawCurrentPage();
    }
  }

  initColumnsManager() {
    this.columnsManager = new GridColumn({ grid: this });

    this.columnsManager.prepareColumns();
  }

  initDataTableConfig() {
    const config = this.getDataTableConfig();
    const dtConfig = this.dataTableCfg || this.dataTableConfig || {};

    if (!config.serverSide) {
      Component.configDefaults(dtConfig, {
        info: false,
        lengthChange: false,
        paging: !!dtConfig.scroller,
      });

      if (dtConfig.scroller === true) {
        dtConfig.scroller = {
          rowHeight: this.rowHeight,
          displayBuffer: 2,
          boundaryScale: 0.75,
        };
      }
    }

    Component.mergeConfig(config, dtConfig);

    this.dataTableCfg = config;
  }

  initComponent() {
    const {
      $el,
      enableFilter,
      enableSettings,
      hoverableRows,
      enableHighlightRows,
      dataTableCfg,
      headerHidden,
    } = this;

    this.columnsManager.initColumns();

    if (dataTableCfg.scrollY === true) {
      this.initScrollResize();
    }

    this.initEvents();

    this.initHeaderColumns();

    if (enableFilter) {
      this.filter = this.createGridFilter();
    }

    if (this.enableSearch) {
      this.gridSearch = this.createGridSearch();
    }

    if (enableSettings) {
      this.settings = this.createSettingsWidget();
    } else {
      $el.addClass(this.disableSettingsCls);
    }

    if (hoverableRows) {
      $el.addClass(this.hoverableRowsCls);
    }

    if (dataTableCfg.scroller || !dataTableCfg.paging) {
      $el.addClass(this.disablePagingCls);
    }

    if (headerHidden) {
      $el.addClass(this.hiddenHeaderCls);
    }

    if (enableHighlightRows) {
      this.hightlightRows = new GridHighlight({ grid: this });
    }

    this.initState();
  }

  createGridFilter() {
    return new GridFilter({ grid: this });
  }

  getSettingsWidgetConfig() {
    return { grid: this };
  }

  createSettingsWidget() {
    return new GridSettingsWidget(this.getSettingsWidgetConfig());
  }

  createGridSearch() {
    return new GridSearch({ grid: this });
  }

  render() {
    const { $tableEl, baseCls, dataTableCfg, tableWidth } = this;

    $tableEl.addClass(this.tableCls);

    if (tableWidth) {
      $tableEl.css('width', tableWidth);
    }

    if (
      this.enableTableFooter ||
      this.columnsManager.summaryColumns.length > 0
    ) {
      this.renderTFoot();
    }

    const table = $tableEl.DataTable(dataTableCfg);

    const $el = $tableEl.closest(`.${baseCls}`);

    this.table = table;

    this.$el = $el;

    this.$toolbarCt = $el.find(`.${this.toolbarCls}`);

    this.$body = $el.find(`.${this.bodyCls}`);

    this.$settingsCt = $el.find(`.${this.settingsCtCls}`);

    this.$header = $el.find(`.${this.headerCls}`);

    this.$footer = $el.find(`.${this.footerCls}`);

    this.$el.get(0).__erp_component = this;
  }

  renderTFoot() {
    $(`
      <tfoot>
        <tr>
          ${this.columns.map(() => '<th></th>')}
        </tr>
      </tfoot>
    `).appendTo(this.$tableEl);
  }

  initScrollResize() {
    this.scrollResize = new $.fn.dataTable.ScrollResize(this.table);
  }

  initEvents() {
    const { table, $tableEl } = this;

    $tableEl.on('mousedown', 'td', this.onCellClick.bind(this));
    $tableEl.on(
      'click',
      'button[data-action]',
      this.onCellActionBtnClick.bind(this)
    );

    table.on('deselect', this.onDeselect.bind(this));
    table.on('select', this.onSelect.bind(this));
    table.on('search.dt', this.onTableSearch.bind(this));
    table.on('order.dt', this.onTableOrder.bind(this));
    table.on('column-visibility.dt', this.onGridColumnVisibility.bind(this));
    table.on('column-sizing.dt', this.onGirdColumnSizing.bind(this));
    table.on('draw.dt', this.onTableRowsDraw.bind(this));
    table.on('preDraw', this.onBeforeTableRowsDraw.bind(this));
    table.on('checkchange.dt', this.onCheckChange.bind(this));
    table.on('rowsdatachange.dt', this.onRowsDataChange.bind(this));
    table.on('user-select', this.onTableUserSelect.bind(this));

    $(document).on({
      'dashboard.sidebartoggle': () => this.adjustSize(),
      'custom.collapsedpanelresize': () => this.adjustSize(),
    });

    $(window).resize(() => this.adjustSize());
  }

  getDataTableConfig() {
    const {
      columns = [],
      headerCls,
      footerCls,
      settingsCtCls,
      bodyCls,
      toolbarCls,
      pagingCls,
      baseCls,
      ajaxCfg,
      height,
      sorting,
    } = this;

    const me = this;
    const cfg = {
      dom: `
        <"${baseCls} d-flex flex-column h-100"
          <"${headerCls} d-flex align-items-center p-3"
            <"${toolbarCls} flex-fill d-flex">
          >
          <"${settingsCtCls} position-relative">
          <"${bodyCls}-wrapper flex-fill"
            <"${bodyCls}"rt>
          >
          <"${footerCls}"
            <"${pagingCls} row align-items-center flex-xl-nowrap p-2"
              <"col-12 col-xl-auto"i>
              <"col-12 col-xl-auto"l>
              <"col-12 col-xl-auto ml-xl-auto"p>
            >
          >
        >
      `,
      paging: true,
      language: gridi18n,
      drawCallback: this.drawCallback.bind(this),
      initComplete: this.onGridReady.bind(this),
      rowCallback: this.rowCallback.bind(this),
      createdRow: this.createdRow.bind(this),
      footerCallback() {
        me.footerCallback.apply(me, [this.api().table(), ...arguments]);
      },
      scrollY: height || true,
      scrollX: true,
      autoWidth: false,
      lengthMenu: [25, 50, 100, 300, 1000],
      ordering: true,
      order: sorting || [],
      searching: true,
      colReorder: false,
      columnDefs: [
        { target: '_all', orderable: false },
        { target: '_all', searchable: true },
      ],
      columns,
    };

    if (cfg.scrollY === true) {
      cfg.scrollCollapse = true;
    }

    if (ajaxCfg) {
      Object.assign(cfg, {
        ajax: async (query, cb) => {
          const res = await this._load(query);

          cb(res || { data: {} });
        },
        serverSide: true,
      });
    }

    cfg.select = this.getSelectConfig();

    return cfg;
  }

  getSelectConfig() {
    const {
      selectionEnabled = false,
      allowDeselect = false,
      selectionType = 'single',
    } = this;

    let selectCfg;

    if (selectionEnabled) {
      selectCfg = {
        className: this.selectedRowCls,
        style: selectionType,
        toggleable: allowDeselect,
      };
    }

    return selectCfg;
  }

  get isMultipleSelect() {
    return get(this, 'dataTableCfg.select.style') === 'multi';
  }

  get selectPluginInit() {
    return !!this.dataTableCfg.select;
  }

  /**
   *
   * @param {Object[]} items
   * @param {Boolean} append
   */
  loadRawData(items = [], append = false) {
    const { table } = this;

    this.onLoad({ items });

    if (!append) {
      table.clear();
    }

    table.rows.add(items).draw();

    this.adjustColumnsSize();
  }

  /**
   *
   * @return {Object[]} rowsData
   */
  get rowsData() {
    return this.table.rows().data().toArray();
  }

  resetLoadParams() {
    this.loadParams = {};
    this.loadFilter = {};
  }

  clearTable() {
    this.resetLoadParams();

    this.table.clear().draw();

    this.trigger('clear', this);
  }

  toggleGridColumnVisible(name) {
    this.columnsManager.toggleGridColumnVisible(name);
  }

  toggleFilterRow() {
    const { filter } = this;

    if (!filter) {
      return;
    }

    // Строка показана и в есть установленные значения
    if (!filter.isHidden && this.hasFilterValues) {
      showInfo('Нельзя скрыть строку фильтров если в них есть значения');
    } else {
      filter.toggle();
    }
  }

  clearFilters() {
    const { filter } = this;

    if (filter) {
      filter.clearAll();
    }
  }

  onGridColumnVisibility(e, settings, index, state) {
    const dtColumn = this.table.column(index);

    this.trigger('columnsvisiblechange', this, dtColumn, state);
  }

  onTableSearch() {
    this.trigger('tablesearch', this);
  }

  onTableOrder() {
    this.trigger('tableorder', this);
  }

  onGirdColumnSizing() {
    this.trigger('columnsizing', this);
  }

  onTableRowsDraw() {
    const { event } = window;
    /**
     * Пока так
     */
    if (event && event.type === 'scroll') {
      return;
    }

    if (this.selectPluginInit && this.selectFirstOnDraw) {
      defer(() => {
        //Если снова не то выбирает - попробуй nth(0)
        this.table.row(':nth(0)').select();
      });
    }

    //Очень лагает
    // Надо понять зачем это и сделать по другому
    // defer(() => {
    //   this.columnsManager.adjustColumns();
    // });

    this.trigger('tabledraw', this, this.table);
  }

  onBeforeTableRowsDraw(e) {
    const { event } = window;
    /**
     * Пока так
     */
    if (event && event.type === 'scroll') {
      return;
    }

    this.trigger('beforetablerowdraw', this, this.table, e);
  }

  drawCallback() {}

  onGridReady() {
    this.initialized = true;

    this.trigger('gridready', this);

    if (this.isServerSideTable) {
      this._load();
    }
  }

  reload() {
    const { loadParams, loadFilter } = this;

    this.load({ loadParams, loadFilter });
  }

  /**
   * @param p
   * @returns {Promise<void>}
   */
  load(p = {}) {
    const { loadParams = {}, loadFilter = {} } = p;
    this.loadParams = loadParams;
    this.loadFilter = loadFilter;

    if (this.isServerSideTable) {
      return this.table.ajax.reload();
    } else {
      this.loading = true;

      return this._load({})
        .then(({ data }) => this.loadRawData(data))
        .catch((err) => {
          this.clearTable();

          throw err;
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }

  getDataByRowIndexes(indexes = []) {
    return indexes.map((idx) => this.table.row(idx).data());
  }

  onTableUserSelect(e, dt, type, cell) {
    // e, dt, type, cell, originalEvent
    if (
      type === 'type' &&
      this.trigger('beforerowselect', this, e, dt, cell) === false
    ) {
      e.preventDefault();
    }
  }

  onSelect(e, dt, type, indexes) {
    if (!type) {
      return;
    }

    if (type === 'row') {
      const data = this.getDataByRowIndexes(indexes);

      const rows = this.isMultipleSelect ? data : data[0];

      this.trigger('rowselect', this, rows);

      this.onSelectionChange(rows);
    }
  }

  onDeselect(e, dt, type, indexes) {
    if (type === 'row') {
      const data = this.getDataByRowIndexes(indexes);

      this.trigger('rowdeselect', this, this.isMultipleSelect ? data : data[0]);
    }

    this.onSelectionChange(null);
  }

  onSelectionChange(selection) {
    this.publishState('selection', selection);

    this.trigger('selectionchange', this, selection);
  }

  onLoad(res) {
    this.deselectAll();

    this.trigger('load', this, res, !!res);
  }

  onBeforeLoad(proxy) {
    return this.trigger('beforeload', this, proxy);
  }

  /**
   * @private
   * @param {Object} query DataTableAjaxParams
   */
  async _load(query) {
    const { emptyDataTableLoadResponse } = GridProxy;
    const { initialized } = this;

    if (!initialized) {
      return emptyDataTableLoadResponse;
    }

    const proxy = new GridProxy({
      grid: this,
      query,
    });

    if (this.onBeforeLoad(proxy) === false) {
      return emptyDataTableLoadResponse;
    }

    this.setLoading(true);

    try {
      const res = await proxy.load();

      this.onLoad(res);

      return res;
    } catch {
      this.onLoad(false);

      return GridProxy.emptyDataTableLoadResponse;
    } finally {
      this.setLoading(false);
    }
  }

  getColumnsFilters() {
    const filters = get(this.table.ajax.params(), 'columns', null);

    if (filters === null) {
      return null;
    }

    const columnsFilter = {};

    filters
      .filter(({ search }) => search.value)
      .forEach(({ data, search: { value } }) => {
        const key = this.getColumnEnumValue(data);

        columnsFilter[key] = value;
      });

    return columnsFilter;
  }

  set loading(loading) {
    this.setLoading(loading);
  }

  setLoading(loading) {
    const { $el } = this;

    loading ? blockEl($el) : unblockEl($el);
  }

  /**
   *
   * @param {String/Number} p
   * @description pass index or column key
   * @returns {String}
   */

  getColumnEnumValue(p) {
    const key = isNumber(p) ? this.table.column(p).dataSrc() : p;

    return upperFirst(key);
  }

  getCellMetaByTd(td) {
    const { table } = this;

    const dataSrc = table.column(td).dataSrc();

    if (!dataSrc) {
      return null;
    }

    const cell = table.cell(td);
    const dtRow = table.row(td);
    const row = dtRow.data();
    const value = row[dataSrc];

    return { dataSrc, row, cell, value, dtRow };
  }

  onCellActionBtnClick(e) {
    const btn = $(e.currentTarget);
    const td = btn.closest(`.${this.tdCls}`);
    const action = btn.data('action');
    const meta = this.getCellMetaByTd(td);

    if (meta === null) {
      return;
    }

    const fn = isFunction(action) ? action : this[action];

    if (!fn) {
      console.error(`Grid - action ${action} not found`);
      return;
    }

    // Сначала пусть случиться select
    defer(() => {
      fn.call(this, meta, btn);
    });
  }

  onCellClick(e) {
    const { currentTarget } = e;
    const meta = this.getCellMetaByTd(currentTarget);

    if (meta === null || meta.dtRow.loading()) {
      return;
    }

    //setTimeout(() => {
    this.columnsManager.onCellClick(meta, currentTarget, e);
    //}, 0);

    this.trigger('cellclick', this, meta);

    return meta;
  }

  onRemoveRowActionBtnClick(meta) {
    if (this.trigger('removerowactionbtnclick', this, meta) !== false) {
      meta.row.remove();
    }
  }

  getColumnByName(name) {
    return this.columnsManager.getColumnByName(name);
  }

  getRowByCell(cell) {
    return this.table.row(cell.index().row);
  }

  onCheckChange(e, rows) {
    /**
     * @event rowscheckchange
     */
    this.trigger('rowscheckchange', this, rows);
  }

  onRowsDataChange(e, rows) {
    /**
     * @event rowsdatachange
     */
    this.trigger('rowsdatachange', this, rows);

    rows.forEach((row) => {
      this.updateRowHighlight(row);
    });

    this.adjustColumnsSize();
  }

  onCellValueEdit(cell, dataSrc, value, oldValue) {
    const row = this.getRowByCell(cell);

    const meta = {
      data: row.data(),
      row,
      dataSrc,
      cell,
      value,
      oldValue,
    };

    if (this.hasListener('cellvalueedit')) {
      this.trigger('cellvalueedit', this, meta);
    }

    return this.saveRowEditValue(meta);
  }

  getSaveRowEditData({ data, value, dataSrc }) {
    return {
      id: data[this.idField],
      field: upperFirst(dataSrc),
      value,
    };
  }

  async saveRowEditValue(meta) {
    const { saveRowEditProxy } = this;

    if (!saveRowEditProxy) {
      return;
    }

    const data = this.getSaveRowEditData(meta);

    const { row, cell, oldValue } = meta;

    row.loading(true);

    try {
      const response = await saveRowEditProxy(data);

      this.processSaveCellEditResponse({ response, meta });

      this.onCellEditValueSaved({ response, meta });
    } catch {
      cell.data(oldValue);
    } finally {
      row.loading(false);
    }
  }

  processSaveCellEditResponse({ response, meta }) {
    const { row } = meta;

    row.setData(response);
  }

  onCellEditValueSaved({ response, meta }) {
    this.trigger('cellvalueeditsaved', this, meta, response, !!response);
  }

  getSelectedRow() {
    return this.table.row({ selected: true }).data();
  }

  getSelection() {
    return this.table.rows({ selected: true });
  }

  /**
   *
   * @param {Function} query
   * @returns {*}
   */
  queryRows(query) {
    return this.table.rows((idx, data) => query(data));
  }

  getChecked() {
    return this.queryRows((data) => data.checked);
  }

  initHeaderColumns() {
    this.columnsManager.initHeaderColumns();
  }

  rowCallback(row, data) {
    this.trigger('rowdraw', this, $(row), data);

    $(row).addClass('');
  }

  footerCallback(table, footer) {
    setTimeout(() => {
      this.trigger('footercallback', this, table, $(footer));
    }, 0);
  }

  createdRow(row, data, dataIndex, cells) {
    row = $(row);

    this.trigger('rowcreate', this, row, data, dataIndex, cells);

    row.addClass(this.rowCls);

    return row;
  }

  redrawCurrentPage() {
    this.table.draw('page');
  }

  /**
   * @protected
   * @description вернуть bool или { className: isHighlight }
   * @returns {Boolean|Object}
   */
  isHighlightRow() {
    return false;
  }

  /**
   * @readonly
   * @returns {Number[]}
   */
  get selectionIds() {
    return this.selectionData.map((data) => data[this.idField]);
  }

  /**
   * @readonly
   * @returns {Number[]}
   */
  get checkedIds() {
    return this.checkedData.map((data) => data[this.idField]);
  }

  get rowsCount() {
    return this.table.rows().count();
  }

  get selectionData() {
    return this.getSelection().data().toArray();
  }

  get checkedData() {
    return this.getChecked().data().toArray();
  }

  get selectionCount() {
    return this.getSelection().count();
  }

  get checkedCount() {
    return this.getChecked().count();
  }

  getTableOuterWidth() {
    return this.$tableEl.outerWidth();
  }

  getTableOuterHeight() {
    return this.$tableScrollContainer.outerHeight();
  }

  get columnsHeaders() {
    return this.$tableScrollHead.find(`.${this.thCls}`);
  }

  /**
   *
   * @return {Object[]}
   */
  get filterValues() {
    return this.table.columns().search().toArray();
  }

  get filterColumnsValues() {
    return this.columnsManager.filterColumnsValues;
  }

  get hasFilterValues() {
    const { filterValues } = this;

    return filterValues.some((val) => !!val);
  }

  adjustSize() {
    this.scrollResize?._size();

    this.adjustColumnsSize();
  }

  adjustColumnsSize() {
    this.table?.columns?.adjust();
  }

  selectById(id) {
    const row = this.findRowById(id);

    if (row) {
      row.select();
    }
  }

  selectAll() {
    this.table.rows().select();
  }

  deselectAll() {
    this.table.rows().deselect();
  }

  checkAll(data) {
    this.table.rows().check(data);

    this.trigger('allrowscheckchange', this, true, data);
  }

  uncheckAll(data) {
    this.table.rows().uncheck(data);

    this.trigger('allrowscheckchange', this, false, data);
  }

  getRowNumber(row) {
    const { table } = this;
    const rowsNodes = table.rows({ order: 'applied' }).nodes();
    const rowNode = table.row(row).node();

    return rowsNodes.indexOf(rowNode) + 1;
  }

  /**
   * @returns state {{columns: [{ name: '', visible: true }]}}
   */
  getState() {
    const { tableColumns } = this.columnsManager;
    const state = {
      columns: [],
    };

    forIn(tableColumns, (column, colName) => {
      state.columns.push({
        name: colName,
        visible: column.visible(),
      });
    });

    return state;
  }

  /**
   *
   * @param {Object} state
   * @param {Object[]} state.columns {{ visible, name }}
   */
  applyState(state) {
    const { columns } = state;

    const { tableColumns } = this.columnsManager;

    this.suspendStateSave();

    columns.forEach(({ name, visible }) => {
      const column = tableColumns[name];

      if (column) {
        column.visible(visible);
      }
    });

    this.resumeStateSave();
  }

  /**
   *
   * @param {String} field
   * @param {*} value
   * @returns {null|*}
   */
  findRow(field, value) {
    const { rowsData } = this;

    const idx = rowsData.findIndex((row) => row[field] === value);

    if (idx === -1) {
      return null;
    }

    return this.table.row(idx);
  }

  findRowById(id) {
    return this.findRow(this.idField, id);
  }

  updateRowHighlight(row) {
    this.hightlightRows?.updateRowHighlight(row);
  }

  get isLoadable() {
    return !!this.proxyApi || !!this.ajaxCfg;
  }

  destroy() {
    this.columnsManager?.destroy();
    this.hightlightRows?.destroy();
    this.filter?.destroy();
    this.settings?.destroy();

    super.destroy();
  }
}

Component.initMixins.call(Grid, [
  'observable',
  'stateful',
  'propertiable',
  'bindable',
]);

export default Grid;
