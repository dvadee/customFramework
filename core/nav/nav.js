import List from '../list/list.js';

const renderTpl = `
<div class="nav nav-tabs"></div>
`;

const itemTpl = `
<div>
  <a href="#" class="nav-link list-item" data-value="{{value}}">{{text}}</a>
</div>
`;

/**
 * @class Nav
 * @extend List
 */
class Nav extends List {
  /**
   * @param p
   * @param {String} p.navStyleCls
   */
  constructor(p) {
    Nav.configDefaults(p, {
      childs: ['nav-link'],
      itemCls: ['nav-item'],
      renderTpl,
      itemTpl,
    });

    Nav.mergeConfig(p, {
      selectable: true,
      allowDeselect: false,
      cls: ['nav', 'nav-tabs'],
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    if (this.navStyleCls) {
      this.addCls(this.navStyleCls);
    }

    this.addCls('nav', 'nav-tabs');
  }
}

Nav.initMixins(['renderable']);

export default Nav;
