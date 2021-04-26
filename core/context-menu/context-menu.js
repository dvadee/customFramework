import 'bootstrap-contextmenu';
import Component from '../component';

const renderTpl = /*html */ `
  <div class="context-menu" id="{{owner.id}}">
    <div class="dropdown-menu" data-ref="menu"></div>
  </div>
`;

const itemRenderTpl = ({ text, id }) => {
  let tpl;

  if (text === '-') {
    tpl = '<div class="dropdown-divider"></div>';
  } else {
    tpl = `<div class="dropdown-item" data-id="${id}">${text}</div>`;
  }

  return $(tpl);
};

class ContextMenu extends Component {
  /**
   *
   * @param {Object} p
   * @param {JqueryDom} p.$targetEl
   * @param {Object[]} p.items
   * @param {String} p.items.text
   * @param {Function} p.items.handler
   * @param {String} p.items.id
   *
   * @event itemclick
   *
   * @event beforeshow
   */
  constructor(p) {
    Object.assign(p, {
      childs: ['menu', '.dropdown-item'],
      menuOpenCls: 'show',
      renderTpl,
    });

    Component.configDefaults(p, {
      $renderTo: $('body'),
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    this.renderItems();

    const { $el, $targetEl } = this;

    if (!$targetEl || !$targetEl.get(0)) {
      new Error('ContextMenu - $targetEl required!');
    }

    $targetEl.contextmenu({
      target: `#${this.id}`,
      before: this.onBeforeShow.bind(this),
      onItem: this.onItemClick.bind(this),
    });

    $el.on({
      'show.bs.context': this.onShow.bind(this),
      'hide.bs.context': this.onHide.bind(this),
    });
  }

  onShow() {
    this.childs.$menu.addClass(this.menuOpenCls);
  }

  onHide() {
    this.childs.$menu.removeClass(this.menuOpenCls);
  }

  onBeforeShow(e, context) {
    if (this.trigger('beforeshow', this, context, e) === false) {
      e.preventDefault();

      return false;
    }

    this.context = context.get(0);
  }

  onItemClick(context, e) {
    const item = $(e.target);

    this.trigger('itemclick', this, item, e);
  }

  renderItems() {
    const { $menu } = this.childs;

    this.items.forEach(({ text, id, handler }) => {
      const $item = itemRenderTpl({ text, id });

      if (handler) {
        $item.click((e) => handler(this.context, e));
      }

      $item.appendTo($menu);
    });
  }
}

ContextMenu.initMixins(['renderable']);

export default ContextMenu;
