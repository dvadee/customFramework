import Button from '@/core/button/button';

/**
 * @class LayoutColumnCollapseBtn
 * @extend Button
 * @prop {String} collapsedCls
 * @prop {LayoutColumn} layoutColumn
 */
class LayoutColumnCollapseBtn extends Button {
  constructor(p) {
    LayoutColumnCollapseBtn.mergeConfig(p, {
      renderTpl: Button.renderTpl,
      suppressLadda: true,
      collapsedCls: 'layout-column-collapse-btn--collapsed',
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    const { direction } = this;
    const { $iconEl } = this.childs;
    const cls = 'layout-column-collapse-btn';

    this.addCls('btn-link', cls, `${cls}--${direction}`);
    this.icon = `icon-${direction === 'left' ? 'previous' : 'next'}2`;

    $iconEl.addClass(`${cls}__icon-el`);
  }

  get collapsed() {
    return this.hasCls(this.collapsedCls);
  }

  set collapsed(collapsed) {
    this[collapsed ? 'addCls' : 'removeCls'](this.collapsedCls);
  }
}

LayoutColumnCollapseBtn.initMixins(['renderable']);

export default LayoutColumnCollapseBtn;
