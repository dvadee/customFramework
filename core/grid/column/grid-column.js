import {
  get,
  map,
  clone,
  template,
  isString,
  isFunction,
  isNumber,
  find,
  defer,
  defaults,
} from 'lodash';
import Base from '@/core/base';
import { parseServerDate } from '../../util/date';
import GridCellEdit from '../cell-edit/grid-cell-edit';
import columnsConfig from './config/grid-column-config';
import GridColumnCheckHeader from './check/header/grid-column-check-header';

/**
 * @render actionsColumn
 * @example
 * : {
 *   buttons: [
 *     {
              title: 'Создать',
              icon: 'icon-add',
              cls: 'btn-success',
              action: 'onCreateProductActionBtnClick',
            },
            {
              title: 'Удалить',
              icon: 'icon-trash-alt',
              cls: 'btn-danger',
              action: 'onDeleteProductActionBtnClick',
            },
 *   ]
 * }
 * 
 * @render actions
 * @render io (check)
 * @render url
 * @render date
 * @render datetime
 * @render currency
 * @render rowNumber
 * 
 * @class GridColumn
 * @prop {Grid} grid
 */
class GridColumn extends Base {
  cellTpl = /*html */ `
    <div class="grid__cell <% if (isHead) {%> grid__cell--header <% } %>"
      style="<% if (maxWidth) { %>max-width: {{maxWidth}}px;<% } %><% if (minWidth) { %> min-width: {{minWidth}}px <% } %>"
      <% if (title) { %>title="{{title}}"<% } %>>
      <div class="grid__cell-inner  <% if (editable) {%>form-control<% } %>">{{value}}</div>
    </div>
  `;

  types = {
    image: columnsConfig.image.render,
    currency: columnsConfig.currency.render,
    url: columnsConfig.url.render,
    actions: columnsConfig.actions.render,
    date: 'renderDate',
    datetime: 'renderDateTime',
    io: 'renderIO',
  };

  customHeaders = {
    check: GridColumnCheckHeader,
  };

  specialColumns = ['check', 'actions', 'rowNumber', 'drag'];

  get table() {
    return this.grid.table;
  }

  get columns() {
    return this.grid.columns;
  }

  get tableColumns() {
    return this._columns;
  }

  constructor(p) {
    GridColumn.assignConfig(p, {
      _columns: {},
    });

    super(p);

    this.grid.on({
      footercallback: this.onGridFooterCallback.bind(this),
    });

    this.cellTpl = template(this.cellTpl);
  }

  initColumns() {
    const { columns } = this.grid;

    this._columns = columns.reduce((obj, config) => {
      const { name, initColumn } = config;
      const column = this.getColumnByName(name);

      obj[name] = column;

      if (initColumn) {
        initColumn(this, config, column);
      }

      return obj;
    }, {});
  }

  prepareColumns() {
    const { types } = this;
    const { columns, columnsEnum, tdCls, columnDefaults = {} } = this.grid;

    this.grid.columns = map(columns, (colCfg) => {
      /**
       * columnsDefaults - устанавливается в конструкторе грида
       *
       */
      const col = clone(columnDefaults);

      Object.assign(col, colCfg);

      const { type } = col;

      if (type) {
        //Конфилик с dataTables
        col.columnType = type;

        delete col.type;
      }
      /**
       * Cпецифичный конфиг для колонки
       */
      const columnTypeConfig = columnsConfig[type];

      if (columnTypeConfig) {
        defaults(col, columnTypeConfig);
      }

      const { name, data } = col;

      const key = name || data;

      const {
        className = '',
        hidden = false,
        align = 'left',
        editable = false,
        width,
      } = col;
      let { render } = col;

      if (!render && types[type]) {
        render = types[type];
      }

      if (!name) {
        col.name = data;
      }

      if (hidden) {
        col.visible = false;
      }

      if (isNumber(width)) {
        col.width = `${width}px`;
      }

      col.render = this.renderCell.bind(this, render);

      col.key = key;

      col.enumValue = get(columnsEnum, key, null);

      col.className = `${className} ${tdCls} text-${align} ${
        editable ? tdCls + '--editable' : ''
      }`;

      return col;
    });
  }

  renderDate(date) {
    date = parseServerDate(date);

    return date === null ? '-' : date.toLocaleDateString();
  }

  renderDateTime(date) {
    date = parseServerDate(date);

    return date === null ? '-' : date.toLocaleString();
  }

  renderIO(on = false) {
    return !on
      ? `
        <div class="text-center">
            <i class="icon-checkmark3"></i>
        </div>
        `
      : '';
  }

  renderCell(renderFn, data, type, row, meta) {
    const { cellTpl, types, grid } = this;
    const dataSrc = this.getColumnSrc(meta.col);
    const config = this.getColumnConfig(dataSrc);
    const { minWidth = null, maxWidth = null } = config;

    let html = null;

    if (isString(renderFn)) {
      const fn = types[renderFn];
      renderFn = isString(fn) ? this[fn] : fn;
    }

    if (isFunction(renderFn)) {
      /**
       * TODO
       * убрать call(this)
       * Вынести все функции рендера отдельно
       */
      html = renderFn.call(this, data, type, row, meta, this, config);
    }

    const hasHtml = html !== null;

    return cellTpl({
      value: hasHtml ? html : data,
      title: hasHtml ? '' : data,
      isHead: false,
      editable: config.editable && !grid.readOnly,
      minWidth,
      maxWidth,
    });
  }

  getColumnConfig(dataSrc = '') {
    return find(this.columns, ['data', dataSrc]) || {};
  }

  getColumnConfigByIndex(colIdx) {
    const src = this.getColumnSrc(colIdx);
    return this.getColumnConfig(src);
  }

  getColumnByName(name = '') {
    const { _columns } = this;
    const { table } = this.grid;

    if (!name) {
      return null;
    }

    return _columns[name] || table.column(`${name}:name`) || null;
  }

  getColumnSrc(colIdx) {
    return this.table.column(colIdx).dataSrc();
  }

  isColumnVisible(name) {
    const column = this.getColumnByName(name);

    return !column.visible();
  }

  isEditableCell(src) {
    if (isNumber(src)) {
      src = this.getColumnSrc(src);
    }

    const cfg = this.getColumnConfig(src);

    return cfg.editable;
  }

  /**
   *
   * @param {Object} col datatable config column
   */
  toggleGridColumnVisible(name) {
    const column = this.getColumnByName(name);

    const visible = !column.visible();

    column.visible(visible);
  }

  getCellEditor() {
    return (
      this.cellEditor ||
      (this.cellEditor = new GridCellEdit({ grid: this.grid }))
    );
  }

  startEditCell(meta) {
    if (meta.dtRow.loading()) {
      return;
    }

    const editor = this.getCellEditor();

    editor.endEdit();

    const config = this.getColumnConfig(meta.dataSrc);

    meta.editor = config.editor;
    meta.editorConfig = config.editorConfig;

    editor.setCell(meta);

    editor.startEdit();
  }

  onCellClick(meta, domEl, e) {
    const { dataSrc } = meta;
    const config = this.getColumnConfig(dataSrc);
    const handler = config.onCellClick;

    if (this.isEditableCell(dataSrc) && !this.grid.readOnly) {
      defer(() => this.startEditCell(meta));
    }

    if (handler) {
      handler(this, config, meta, domEl, e);
    }
  }

  initHeaderColumns() {
    const { columns, grid } = this;

    columns.forEach((columnConfig) => {
      const { title, name, type, minWidth, maxWidth } = columnConfig;
      const col = this.getColumnByName(name);

      if (!col) {
        return;
      }
      const CustomHeader = this.customHeaders[type];
      const $th = $(col.header());

      $th.addClass(grid.thCls);

      $th.empty();

      if (CustomHeader) {
        columnConfig.customHeader = new CustomHeader({
          $renderTo: $th,
          columnConfig,
          col,
          grid,
        });
      } else {
        const $cell = $(
          this.cellTpl({
            isHead: true,
            value: title,
            maxWidth: null,
            editable: false,
            minWidth: null,
            title,
          })
        );

        $cell.appendTo($th);

        $th.attr('title', title);
      }

      $th.css({
        'min-width': minWidth + 'px',
        'max-width': maxWidth + 'px',
      });
    });
  }

  // eslint-disable-next-line no-unused-vars
  onGridFooterCallback(grid, datatable) {
    this.summaryColumns.forEach((col) => {
      const dtCol = this.getColumnByName(col.name);
      const footer = dtCol?.footer();

      if (footer) {
        const sum = dtCol.sum();
        const html = this.cellTpl({
          value: col.summaryRenderer ? col.summaryRenderer(sum) : sum,
          isHead: false,
          editable: false,
          maxWidth: null,
          minWidth: null,
          title: '',
        });

        $(footer).html(html);
      }
    });
  }

  adjustColumns() {
    this.grid.adjustColumnsSize();
  }

  get summaryColumns() {
    return this.columns.filter((col) => col.summary);
  }

  get filterColumnsValues() {
    return this.columns
      .map(({ name, title }) => {
        const dtCol = this.getColumnByName(name);

        return { title, value: dtCol.search() };
      })
      .filter(({ value }) => !!value);
  }
}

export default GridColumn;
