export const registerSorting = (name, fn) => {
  $.fn.dataTable.ext.order[name] = function (settings, col) {
    const cols = this.api().column(col, { order: 'index' });
    const data = cols.data();

    return cols.nodes().map((td, i) => fn(data[i]));
  };
};
