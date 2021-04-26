import { isNumber } from 'lodash';
import Component from '@/core/component';
import LayoutColumnCollapseBtn from './collapse-btn/layout-column-collapse-btn';
/**
 * @class LayoutColumn
 * @extend Component
 * @prop {String} collapsedCls
 * @prop {String} expandableCls
 * @prop {String} collapseDirection [left right] - направление сворачивания
 * @prop {Boolean} flexible - расширяется, если рядом сворачивается другая колонка
 * @prop {Number} flexGrowWeight - css flex-grow
 *
 * @description Для корректной работы внутри должен быть компонент card.
 */
class LayoutColumn extends Component {
  constructor(p) {
    LayoutColumn.configDefaults(p, {
      flexGrowWeight: 1,
    });

    LayoutColumn.mergeConfig(p, {
      baseCls: 'layout-column',
      collapsedCls: 'layout-column--collapsed',
    });

    super(p);
  }

  initComponent() {
    super.initComponent();
    const { baseCls, collapseDirection, flexGrowWeight } = this;

    if (this.flexible) {
      this.addCls(`${baseCls}--flexible`);
    }

    if (collapseDirection) {
      this.initCollapseBtn();

      this.addCls(
        `${baseCls}--${collapseDirection}`,
        `${baseCls}--collapsible`
      );
    }

    if (isNumber(flexGrowWeight)) {
      this.setStyle({
        'flex-grow': flexGrowWeight,
      });
    }
  }

  initCollapseBtn() {
    this.collapseBtn = new LayoutColumnCollapseBtn({
      $renderTo: this.$el,
      direction: this.collapseDirection,
      prepend: true,
      layoutColumn: this,
      listeners: {
        click: this.toggleCollapsed.bind(this),
      },
    });
  }

  get collapsed() {
    return this.hasCls(this.collapsedCls);
  }

  set collapsed(collapsed) {
    this[collapsed ? 'addCls' : 'removeCls'](this.collapsedCls);

    this.collapseBtn.collapsed = collapsed;

    this.trigger(collapsed ? 'collapse' : 'expand', this);

    this.triggerGlobalEvent();
  }

  triggerGlobalEvent() {
    $(document).trigger('custom.collapsedpanelresize', [this]);
  }

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }

  collapse() {
    this.collapsed = true;
  }

  expand() {
    this.collapsed = false;
  }
}

export default LayoutColumn;
