import { clone, assign } from 'lodash';
import Card from '@/core/card/card';
import Grid from '@/core/grid/grid';
import { alias, batchCreateGetterSetterAlias } from '@/core/util/function';
import './grid-card.scss';
/**
 * @class GridCard
 * @extend Card
 * @prop {Grid} grid
 */
class GridCard extends Card {
  gridClass;

  /**
   *
   * @param {Object} p
   * @param {jQuery} p.$el
   * @param {Object} p.gridConfig
   */
  constructor(p) {
    const body = $('<div class="card-body" data-ref="body-el"></div>');

    body.appendTo(p.$el);

    GridCard.configDefaults(p, {
      gridComponent: Grid,
      collapsed: false,
      closable: false,
      refreshable: false,
      collapsible: false,
      gridConfig: {},
      minHeight: '150px',
    });

    super(p);
  }

  initComponent() {
    const config = clone(this.gridConfig);

    this.addCls('grid-card');

    super.initComponent();

    this.initBody();

    this.renderTable();

    assign(config, {
      component: this.gridClass || this.gridComponent,
      $el: this.$table,
      $fullHeightCt: this.$body,
    });

    this.grid = this.addChildComponent(config);

    this.initAliases();

    this.initGridEvents();
  }

  refresh() {
    this.grid.reload();
  }

  initGridEvents() {
    const events = ['rowselect', 'selectionchange', 'rowdeselect'];

    this.relayEvents(this.grid, events);
  }

  initAliases() {
    const methods = [
      'load',
      'reload',
      'getSelectedRow',
      'clearTable',
      'getColumnsFilters',
      'adjustColumnsSize',
      'adjustSize',
      'findRow',
      'selectAll',
      'deselectAll',
      'selectById',
    ];

    methods.forEach((fn) => {
      this[fn] = alias(this.grid, fn);
    });

    batchCreateGetterSetterAlias({
      obj: this,
      targetObj: this.grid,
      props: [
        'selectionIds',
        'checkedIds',
        'checkedCount',
        'selectionCount',
        'rowsCount',
      ],
      setter: false,
    });
  }

  initBody() {
    const { $body } = this;

    $body.css('min-height', this.minHeight).addClass('p-0');
  }

  renderTable() {
    const { $body } = this;

    const table = $('<table></table>');

    this.$table = table;

    table.appendTo($body);
  }

  onExpand() {
    super.onExpand();

    this.grid?.adjustColumnsSize();
  }
}

export default GridCard;
