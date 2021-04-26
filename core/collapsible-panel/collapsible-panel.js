/**
 * @class CollapsiblePanel
 * @deprecated
 */
class CollapsiblePanel {
  static init() {
    const panels = Array.from(document.querySelectorAll('.collapsible-panel'));

    panels.forEach((panel) => new CollapsiblePanel(panel));
  }

  constructor(el) {
    this.el = el;
    this.btn = el.querySelector('.collapsible-panel__btn');
    this.collapsed = false;
    this.collapsedCls = 'collapsible-panel--collapsed';
    if (!this.btn) {
      return;
    }

    this.btn.addEventListener('click', this.onBtnClick.bind(this));
  }

  onBtnClick() {
    const { collapsed, el } = this;

    this[collapsed ? 'expand' : 'collapse']();

    this.collapsed = !collapsed;

    $(document).trigger('custom.collapsedpanelresize', [this, el]);
  }

  collapse() {
    const { el, collapsedCls } = this;

    el.classList.add(collapsedCls);
  }

  expand() {
    const { el, collapsedCls } = this;

    el.classList.remove(collapsedCls);
  }
}

export default CollapsiblePanel;
