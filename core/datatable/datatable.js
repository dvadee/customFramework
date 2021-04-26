import 'datatables.net';
import 'datatables.net-scroller';
import 'datatables.net-select';
import '../../../../../node_modules/datatables.net-plugins/features/scrollResize/dataTables.scrollResize';
import { registerApi } from './api/datatable-api';
import './api/sum/datatable-api-sum';
import './sorting/date/datatable-sorting-date';
import './sorting/currency/datatable-sorting-currency';

class DataTable {
  static initCustomApi() {
    registerApi('row().setData()', function (data) {
      const row = this;

      DataTable.setRowData(row, data);

      DataTable.triggerRowsDataChangeEvent(this, [row]);
    });

    registerApi('rows().setData()', function (data) {
      const rows = this;

      const rowsArr = [];

      rows.every(function () {
        const row = this;

        DataTable.setRowData(row, data);

        rowsArr.push(row);
      });

      DataTable.triggerRowsDataChangeEvent(this, rowsArr);
    });

    registerApi('row().toggleChecked()', function (data) {
      const row = this;
      const rowData = row.data();

      DataTable.setRowCheck(row, !(rowData && rowData[data]), data);
    });

    registerApi('row().check()', function (data) {
      DataTable.setRowCheck(this, true, data);
    });

    registerApi('row().uncheck()', function (data) {
      DataTable.setRowCheck(this, false, data);
    });

    registerApi('rows().check()', function (data) {
      DataTable.setRowsCheck(this, true, data);
    });

    registerApi('rows().uncheck()', function (data) {
      DataTable.setRowsCheck(this, false, data);
    });

    registerApi('row().loading()', function (isLoading) {
      if (isLoading !== undefined) {
        DataTable.markRowLoading(this, isLoading);
      } else {
        return DataTable.isRowLoading(this);
      }
    });
  }

  static triggerEvent(ctx, eventName, args) {
    const table = ctx.table().node();

    $(table).trigger(`${eventName}.dt`, args);
  }

  static setRowData(row, data) {
    row.data({
      ...row.data(),
      ...data,
    });
  }

  static setRowCheck(row, checked, data = 'checked') {
    row.setData({ [data]: checked });

    /**
     * @event checkchange
     */
    DataTable.triggerEvent(row, 'checkchange', [[row], checked, data]);
  }

  static setRowsCheck(rows, checked, data = 'checked') {
    rows.every(function () {
      const row = this;

      row.setData({ [data]: checked });
    });

    DataTable.triggerEvent(rows, 'checkchange', [rows, checked, data]);
  }

  /**
   *
   * @param row
   * @param {Boolean} isLoading
   */
  static markRowLoading(row, isLoading) {
    $(row.node()).toggleClass('loading', isLoading);
  }

  static isRowLoading(row) {
    return $(row.node()).hasClass('loading');
  }

  static triggerRowsDataChangeEvent(ctx, rows) {
    DataTable.triggerEvent(ctx, 'rowsdatachange', [rows]);
  }
}

export default DataTable;
