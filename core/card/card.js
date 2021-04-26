import Container from '../container/container';
import Header from './header/card-header';
import './card.scss';
import renderTpl from './card.pug';

/**
 * @class Card
 * @extend Container
 * @prop headerClass
 * @prop {String} title
 * @prop {Boolean} closable
 * @prop {Object} refreshable
 * @prop {Boolean} collapsible
 * @prop {Component} childCmp
 * @prop {Boolean} enableHeader
 * @prop {Boolean} autoRenderBody
 * @prop {Object} headerConfig
 */
class Card extends Container {
  static renderTpl = renderTpl;
  /**
   * @event collapse
   * @event expand
   */

  constructor(p) {
    Card.configDefaults(p, {
      headerClass: Header,
      headerConfig: {},
      collapsed: false,
      closable: false,
      refreshable: false,
      collapsible: false,
      autoRenderBody: false,
      maximizable: false,
      maximized: false,
      bodyCls: '',
      title: '',
    });

    Card.mergeConfig(p, {
      baseCls: 'card',
      childs: ['body-el'],
      collapsedCls: 'card-collapsed',
      animSpeed: 0,
    });

    if (p.autoRenderBody && p.$el.find('.card-body').empty) {
      const body = $('<div class="card-body" data-ref="body-el"></div>');

      body.appendTo(p.$el);
    }

    super(p);
  }

  get $containerEl() {
    const { $bodyEl, bodyEl } = this.childs;

    return bodyEl ? $bodyEl : this.$el;
  }

  get isEnableHeader() {
    return (
      this.closable ||
      this.refreshable ||
      this.collapsible ||
      this.title ||
      this.maximizable ||
      this.enableHeader
    );
  }

  initComponent() {
    super.initComponent();

    this.$body.addClass(this.bodyCls);

    this.initHeader();
  }

  initHeader() {
    if (this.isEnableHeader) {
      const Header = this.headerComponent || this.headerClass;
      const config = this.getHeaderConfig();

      this.header = new Header(config);
    }
  }

  getHeaderConfig() {
    return {
      $renderTo: this.$el,
      card: this,
      blockCmp: this.blockCmp,
      parentCmp: this,
      ...this.headerConfig,
    };
  }

  getCollapseEl() {
    const { header } = this;

    return header ? header.$el.nextAll() : this.$el.children();
  }

  get $body() {
    const { $bodyEl } = this.childs;

    return $bodyEl || $();
  }

  get collapsed() {
    return this._collapsed;
  }

  get animationSpeed() {
    return this.ready ? this.slidingSpeed : 0;
  }

  /**
   * @private
   * @param {Boolean} collapse
   */
  set collapsed(collapse) {
    if (!this.ready) {
      this.renderConfig.collapsed = collapse;
      return;
    }

    if (this.collapsing) {
      return;
    }

    if (collapse === null) {
      collapse = !this._collapsed;
    }

    const $collapseEl = this.getCollapseEl();

    const { collapsedCls, $el } = this;

    $el.toggleClass(collapsedCls, collapse);

    this.collapsing = true;

    if (collapse) {
      $collapseEl.slideUp(this.animationSpeed, this.onCollapse.bind(this));
    } else {
      $collapseEl.slideDown(this.animationSpeed, this.onExpand.bind(this));
    }

    this.trigger(collapse ? 'collapse' : 'expand', this);

    this._collapsed = collapse;
  }

  onExpand() {
    this.collapsing = false;

    this.trigger('expand', this);
  }

  onCollapse() {
    this.collapsing = false;

    this.trigger('collapse', this);
  }

  get headerVisible() {
    const { header } = this;

    return header && header.visible;
  }

  set headerVisible(visible) {
    const { header } = this;

    if (header) {
      header.visible = visible;
    }
  }

  get title() {
    return this._title;
  }

  set title(title) {
    if (this.header) {
      this.header.title = title;
    }

    this._title = title;
  }

  collapse() {
    this.collapsed = true;
  }

  expand() {
    this.collapsed = false;
  }

  toggleCollapsed() {
    this.collapsed = null;
  }

  refresh() {
    const { childCmp } = this;

    if (childCmp && childCmp.loadable) {
      childCmp.reload();
    } else {
      this.trigger('refresh', this);
    }
  }

  show() {
    const { $el } = this;

    $el.removeClass('d-none');
  }

  close() {
    const { $el } = this;

    if (this.trigger('beforeclose') === false) {
      return;
    }

    $el.addClass('d-none');
  }

  triggerHeaderToolEvent(event) {
    this.trigger(event, this, this.header);
  }
}

Card.initMixins(['maximizable']);

export default Card;
