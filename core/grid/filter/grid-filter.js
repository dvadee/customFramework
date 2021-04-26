import Component from '../../component';
import GridFilterWidget from '@/core/grid/filter/widget/grid-filter-widget';
/**
 * @class GridFilter
 * @extend Component
 * Строка фильтров грида.
 */
class GridFilter extends Component {
  constructor(p) {
    Object.assign(p, {
      baseCls: 'grid-filter',
      $inputs: [],
      hidden: true,
      renderable: true,
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    this.grid.on({
      columnsvisiblechange: this.onColumnVisibleChange.bind(this),
    });
  }

  /**
   *
   * @param data
   * @returns {GridFilterWidget}
   */
  getColumnFilter(data) {
    return this.filters.find((filter) => filter.dataSrc === data);
  }

  onColumnVisibleChange(grid, dtColumn, visible) {
    const data = dtColumn.dataSrc();

    const filter = this.getColumnFilter(data);

    filter.visible = visible;
  }

  render() {
    const { grid } = this;
    const { table, specialColumns, $tableScrollHeaderTable } = grid;
    const filters = [];

    const $tbody = $('<tbody></tbody>');
    const $filterRow = $('<tr></tr>');

    $tbody.appendTo($tableScrollHeaderTable);
    $filterRow.appendTo($tbody);

    table
      .columns()
      .header()
      .each((col) => {
        const dtColumn = table.column(col);
        const data = dtColumn.dataSrc();
        const isEmptyFilter = specialColumns.includes(data);

        const filter = new GridFilterWidget({
          $renderTo: $filterRow,
          listeners: {
            change: this.onFilterInputValueChange.bind(this),
          },
          isEmptyFilter,
          dtColumn,
        });

        filters.push(filter);
      });

    this.$filterRow = this.$el = $filterRow;
    this.filters = filters;

    this.hide();
  }

  onFilterInputValueChange(filter, value) {
    filter.dtColumn.search(value).draw();
  }

  get isHidden() {
    return this._hidden;
  }

  toggle() {
    const { _hidden } = this;

    this[_hidden ? 'show' : 'hide']();
  }

  show() {
    this.$filterRow.show();

    const { grid } = this;

    grid.adjustSize();

    this._hidden = false;
  }

  hide() {
    this.$filterRow.hide();

    const { grid } = this;

    grid.adjustSize();

    this._hidden = true;
  }

  clearAll() {
    this.filters.forEach((filter) => {
      filter.silentClearValue();
    });

    this.grid.table.columns().search('').draw();
  }
}

export default GridFilter;
