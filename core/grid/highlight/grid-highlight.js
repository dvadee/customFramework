import { isObject, forIn } from 'lodash';
import Base from '@/core/base';

/**
 * @class GridHighlight
 * @prop grid
 */
class GridHighlight extends Base {
  /**
   *
   * @param p
   * @param {Grid} p.grid
   */
  constructor(p) {
    super(p);

    this.grid.on('rowdraw', this.onGridRowDraw.bind(this));
  }

  onGridRowDraw(grid, row, data) {
    this.applyHighlightRow(row, data);
  }

  updateRowsRenderedHighlight() {
    const { table } = this.grid;

    table
      .rows()
      .indexes()
      .toArray()
      .forEach((idx) => this.updateRowHighlight(table.row(idx)));
  }

  updateRowHighlight(dtRow) {
    this.applyHighlightRow($(dtRow.node()), dtRow.data());
  }

  applyHighlightRow($row, data) {
    let highlight = this.grid.isHighlightRow(data);

    if (!isObject(highlight)) {
      highlight = {
        [this.grid.highlightCls]: highlight,
      };
    }

    forIn(highlight, (isHighlight, cls) => {
      $row.toggleClass(cls, isHighlight);
    });
  }
}

export default GridHighlight;
