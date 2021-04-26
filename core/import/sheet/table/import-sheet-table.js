import { defer } from '@/core/util/function';
import ImportHeadersTable from '@/core/import/headers-table/import-headers-table';
import ContextMenu from '@/core/context-menu/context-menu';
import markupType from '@/core/enum/markup-type';

/**
 * @class ImportSheetTable
 * @extend Table
 * @prop {SelectItem[]} availableHeaders
 * @prop {ImportForm} form
 * @prop {Object} sheet - инфа вкладки
 * @prop {Boolean} [enableMarkup=true]
 */
class ImportSheetTable extends ImportHeadersTable {
  constructor(p) {
    ImportSheetTable.configDefaults(p, {
      enableMarkup: true,
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    if (this.enableMarkup) {
      this.contextMenu = new ContextMenu({
        $renderTo: this.$body,
        $targetEl: this.$tableRows,
        items: [
          {
            text: 'Использовать строку для разметки',
            handler: this.onUseRowForMarkMenuItemClick.bind(this),
          },
        ],
      });

      this.initFormMarkupUpdateEvent();
    }
  }

  get form() {
    const form = this.lookupReference('form');

    if (!form) {
      throw new Error('ImportSheetTable - vm form required!');
    }

    return form;
  }

  initFormMarkupUpdateEvent() {
    this.form.on('sheetmarkupchange', this.onFormSheetMarkupChange.bind(this));
  }

  onUseRowForMarkMenuItemClick(context) {
    this.markupRow = this.dataTable.row(context);
  }

  onFormSheetMarkupChange() {
    const markup = this.form.getSheetMarkup(this.sheetIndex);

    this.setSheetMarkup(markup);
  }

  getSheetMarkup() {
    const markup = {
      headers: this.headers || [],
    };

    if (this.enableMarkup) {
      markup.markupType = this.markupType;

      const isTitleMarkupType = markup.markupType === markupType.title;

      if (isTitleMarkupType) {
        markup.criteriaValue = this.titleRow;
      }
    }

    return markup;
  }

  /**
   *
   * @param markup
   * @param markup.markupType
   * @param markup.headers
   * @param markup.criteriaValue
   */
  setSheetMarkup(markup) {
    if (!markup) {
      // this.headers = [];
      // this.titleRow = null;
      return;
    }

    const isTitleMarkupType = markup.markupType === markupType.title;

    this.headers = markup.headers;

    this.titleRow = isTitleMarkupType ? markup.criteriaValue : null;
  }

  get availableHeaders() {
    return this.lookupViewModel()?.get('availableHeaders') || [];
  }

  getRenderData() {
    //markupType
    //titleRow
    const {
      availableHeaders,
      sheet: { data, headers },
    } = this;

    return {
      rows: data,
      availableHeaders,
      headers,
    };
  }

  get sheetIndex() {
    return this.sheet?.index;
  }

  get markupType() {
    return this.titleRow === null ? markupType.number : markupType.title;
  }

  get titleRow() {
    const row = this.markupRow;

    return row ? row.index() : null;
  }

  /**
   * criteriaValue - номер строки для разметки
   * по заголовкам и количество столбцов для разметки
   * по номерам столбцов (последнее на фронте можно проигнорировать)
   */
  set titleRow(value) {
    this.markupRow = value !== null ? this.dataTable.row(value) : null;
  }

  get markupRow() {
    return this._markupRow;
  }

  set markupRow(row) {
    row = this.updateMarkupRow(row, this.markupRow);

    this._markupRow = row;
  }

  updateMarkupRow(newRow, oldRow) {
    const toggleCls = (row, state = false) =>
      $(row.node()).toggleClass('bg-success-300', state);

    if (oldRow) {
      toggleCls(oldRow, false);
    }

    if (newRow) {
      toggleCls(newRow, true);
    }

    defer(() => this.trigger('markuprowchange', this, newRow, oldRow));

    return newRow;
  }
}

export default ImportSheetTable;
