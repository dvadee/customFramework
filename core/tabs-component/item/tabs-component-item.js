import Container from '@/core/container/container';
import renderTpl from './tabs-component-item.pug';

/**
 * @class TabsComponentItem
 * @extend Component
 * @prop {Boolean} [animate=false]
 */
class TabsComponentItem extends Container {
  isTabsComponentItem = true;

  constructor(p) {
    TabsComponentItem.configDefaults(p, {
      animate: false,
      renderTpl,
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    if (this.animate) {
      this.addCls('fade');
    }

    if (this.fitContent) {
      this.addCls('h-100');
    }
  }

  onTabShow() {}

  onTabHidden() {}
}

TabsComponentItem.initMixins(['renderable']);

export default TabsComponentItem;
