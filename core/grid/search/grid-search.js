import GridSearchWidget from './widget/grid-search-widget';
import Base from '@/core/base';
/**
 * @class GridSearch
 * @prop {Grid} grid
 */

class GridSearch extends Base {
  constructor(p) {
    super(p);

    this.renderSearchWidget();
  }

  renderSearchWidget() {
    const { $toolbarCt } = this.grid;

    this.widget = new GridSearchWidget({
      $renderTo: $toolbarCt,
      listeners: {
        applyclick: this.search.bind(this),
        clearclick: this.clearSearch.bind(this),
      },
    });
  }

  get table() {
    return this.grid.table;
  }

  get searchStr() {
    return this.table.search();
  }

  get searchValue() {
    return this.widget.searchValue;
  }

  set searchValue(val) {
    this.widget.searchValue = val;
  }

  search() {
    this.doTableSearch(this.widget.searchValue);
  }

  clearSearch() {
    this.doTableSearch('');
  }

  doTableSearch(str) {
    this.triggerSearchChange();

    this.table.search(str).draw();
  }

  triggerSearchChange() {
    const { grid } = this;

    grid.publishState('searchValue', this.searchValue);

    grid.trigger('searchvaluechange', grid, this, this.searchValue);
  }

  destroy() {
    this.widget?.destroy();

    super.destroy();
  }
}

export default GridSearch;
