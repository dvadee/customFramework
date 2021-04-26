import Nav from '@/core/nav/nav';
import renderTpl from './tabs-component-header.pug';
import itemTpl from './item/tabs-component-header-item.pug';

class TabsComponentHeader extends Nav {
  constructor(p) {
    TabsComponentHeader.configDefaults(p, {
      valueField: 'id',
      childs: ['.nav-link', '.nav-item'],
      renderTpl,
      itemTpl,
    });

    super(p);
  }

  initItemsEvents() {
    const { $navLink } = this.childs;

    super.initItemsEvents();

    $navLink.on({
      click: this.onNavLinkClick.bind(this),
      'shown.bs.tab': this.onTabShown.bind(this),
      'hidden.bs.tab': this.onTabHidden.bind(this),
    });
  }

  /**
   *
   * @param {HTMLElement} navLink
   */
  getNavLinkIndex(navLink) {
    const listItem = navLink.parentNode;

    return this.childs.$navItem.index(listItem);
  }

  onTabShown(e) {
    const meta = this.getItemDataByValue(e.target.dataset.value);

    this.trigger('tabshown', this, meta, e);
  }

  onTabHidden(e) {
    const meta = this.getItemDataByValue(e.target.dataset.value);

    this.trigger('tabhidden', this, meta, e);
  }

  onNavLinkClick(e) {
    e.preventDefault();

    $(e.currentTarget).tab('show');
  }

  set active(idx) {
    const $item = this.childs.$navLink.eq(idx);

    $item.tab('show');
  }
}

export default TabsComponentHeader;
