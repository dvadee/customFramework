import Component from '../../../../component';

const renderTpl = `
<div class="grid-column-check-header d-flex align-items-center justify-content-center">
    <div class="grid-column-check-header__checkbox"></div>
    <% if (title) { %>
        <div class="grid-column-check-header__text">{{title}}</div>
    <% } %>
</div>
`;

/**
 * @class GridColumnCheckHeader
 * @extend Component
 * @prop {Object} columnConfig
 * @prop {Grid} grid
 * @prop {Object} col
 */
class GridColumnCheckHeader extends Component {
  constructor(p) {
    GridColumnCheckHeader.mergeConfig(p, {
      elementEvents: ['click'],
      renderTpl,
    });

    super(p);
  }

  get title() {
    return this.columnConfig?.title || '';
  }

  get columnData() {
    return this.columnConfig?.data || 'checked';
  }

  get checkboxHidden() {
    return !!this.columnConfig?.headerCheckHidden;
  }

  getRenderData() {
    return {
      title: this.title,
    };
  }

  initComponent() {
    super.initComponent();

    this.on('click', this.onClick.bind(this));

    const cb = this.checkCheckedState.bind(this);

    this.grid.on({
      rowscheckchange: cb,
      tabledraw: cb,
    });

    cb();

    if (this.checkboxHidden) {
      this.addCls('grid-column-check-header--checkbox-hidden');
    }
  }

  get isAllRowsChecked() {
    const { grid, columnData } = this;
    const { rowsCount } = grid;
    const checkedCount = grid.queryRows((data) => data[columnData]).count();

    return rowsCount > 0 && rowsCount === checkedCount;
  }

  onClick() {
    const { grid, columnData } = this;

    if (this.isAllRowsChecked) {
      grid.uncheckAll(columnData);
    } else {
      grid.checkAll(columnData);
    }
  }

  checkCheckedState() {
    this.toggleCls('grid-column-check-header--checked', this.isAllRowsChecked);
  }
}

GridColumnCheckHeader.initMixins(['renderable']);

export default GridColumnCheckHeader;
