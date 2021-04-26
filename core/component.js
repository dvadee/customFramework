import { forIn, isArray, isString } from 'lodash';
import Base from '@/core/base';
import { isVisible, setElVisible } from './util/dom';
import { getSetFnName } from '@/core/util/string';
import assert from 'assert';

/**
 * @class Component
 * @extend Base
 * @prop {jQuery} $el
 * @prop {Object} renderConfig
 * @prop {String[]|Object[]} childs
 * @prop {Boolean} autoInit
 * @prop {String[]|String}c ls
 * @prop {String[]} elementEvents
 * @prop {Object} listeners
 * @prop {Object} renderConfig
 * @prop {Boolean} autoLoad
 * @prop {String} disabledCls
 * @mixes ChildOwnerMixin
 * @mixes ObservableMixin
 * @mixes BindableMixin
 * @mixes PropertiableMixin
 * @mixes LoadableMixin
 */

class Component extends Base {
  /**
   * @event load
   * @event loadingstart
   * @event loadingend
   * @event ready
   */
  constructor(p) {
    Component.setRequiredConfig(p, {
      renderConfig: {},
      childs: [],
    });

    Component.configDefaults(p, {
      childs: [],
      autoInit: true,
      cls: '',
      elementEvents: [],
      listeners: {},
      autoLoad: false,
      disabledCls: 'component--disabled',
    });

    Component.mergeConfig(p, {
      props: {
        disabled: false,
        proxyLoadParams: null,
        loading: false,
      },
    });

    const $el = p.$el;

    /**
     * dianamic add value input product create error
     */
    // delete p.$el;

    super(p);

    this.$el = $el;

    this.ready = false;

    if (this.autoInit) {
      this._init();
    }

    if (this.domEl) {
      this.domEl.__erp_component = this;
    }
  }

  getId() {
    return this.id;
  }

  _init() {
    this.initObservable();

    this.eventsSuspended = true;

    if (this.renderable) {
      this.onBeforeRender();

      this.render();
    }

    this.initViewModel();

    this.initChilds();

    this.initPluginConfig();

    this.initComponent();

    this.initEvents();

    this.initProps();

    this.eventsSuspended = false;

    this.onReady();

    if (this.loadable && this.autoLoad) {
      this.load();
    }
  }

  onBeforeRender() {}

  onReady() {
    this.ready = true;

    this.trigger('ready', this);

    const { renderConfig, bind } = this;

    if (bind) {
      bind.notify();
    }

    if (renderConfig) {
      Object.assign(this, renderConfig);
    }
  }

  /**
   * @protected
   * Инициализация конфига какого нибудь внешнего модуля(если есть)
   */
  initPluginConfig() {}

  /**
   * @protected
   */
  initComponent() {
    const { $el, baseCls = '', cls = '' } = this;

    if ($el) {
      $el.addClass(baseCls);
      $el.addClass(cls);
      $el.addClass('component');
    }
  }

  /**
   * @protected
   * init triggers
   */

  initEvents() {
    const { elementEvents, $el } = this;

    if ($el && elementEvents && elementEvents.length) {
      this.relayEvents($el, elementEvents);
    }
  }

  getBlockTarget() {
    let { $blockTarget } = this;

    if (!$blockTarget) {
      $blockTarget = this.$el;
    }

    return $blockTarget;
  }

  disable() {
    this.disabled = true;
  }

  enable() {
    this.disabled = false;
  }

  updateDisabled(disabled) {
    this.$el?.toggleClass(this.disabledCls, disabled);
  }

  updateLoading(loading) {
    this.setLoading(loading);
  }

  setLoading(loading) {
    if (this.destroyed) {
      return;
    }

    const { blockCfg = {} } = this;
    const $blockTarget = this.getBlockTarget();

    if (loading) {
      const msg = isString(loading) ? loading : 'Загрузка';

      const cfg = Object.assign(
        {
          message: /*html */ `
          <div class="d-flex justify-content-center text-center align-items-center w-100 h-100">
            <div class="mr-3">
              <i class="icon-spinner2 spinner"></i>
            </div>
            <div>${msg}</div>
          </div>
        `,
          overlayCSS: {
            backgroundColor: '#fff',
            opacity: 0.8,
            cursor: 'wait',
            border: 0,
            // 'box-shadow': '0 0 0 1px #ddd',
          },
          css: {
            border: 0,
            padding: 0,
            backgroundColor: 'none',
          },
        },
        blockCfg
      );

      $blockTarget.block(cfg);

      this.trigger('loadingstart', this);
    } else {
      $blockTarget.unblock();

      this.trigger('loadingend', this);
    }

    this._loading = !!loading;
  }

  destroy() {
    const { $el, removeElOnDestroy = true } = this;

    this.destroyChildsComponents();

    if ($el && removeElOnDestroy) {
      $el.remove();
    }

    this.trigger('destroy', this);

    super.destroy();
  }

  get domEl() {
    return this.$el.get(0);
  }

  /**
   * @return {Boolean}
   */
  get visible() {
    return isVisible(this.$el);
  }

  /**
   * @param {Boolean} visible
   */
  set visible(visible) {
    this.setProp('visible', visible);
  }

  setVisible(visible) {
    setElVisible(this.$el, visible);
  }

  get html() {
    return this.$el.html();
  }

  /**
   * @param {String} html
   */
  set html(v) {
    this.$el.html(v);
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  addCls(cls) {
    if (!isArray(cls)) {
      cls = Array.from(arguments);
    }

    this.$el.addClass(cls);
  }

  removeCls(cls) {
    if (!isArray(cls)) {
      cls = Array.from(arguments);
    }

    this.$el.removeClass(cls);
  }

  hasCls(cls) {
    return this.$el.hasClass(cls);
  }

  toggleCls(cls, state) {
    this.$el.toggleClass(cls, state);
  }

  getClsList() {
    return Array.from(this.domEl.classList);
  }

  setStyle(style) {
    this.$el.css(style);
  }

  getElAttr(name) {
    const { $el } = this;

    if (!$el) {
      return;
    }

    return $el.attr(name);
  }

  setElAttr(name, value) {
    const { $el } = this;

    if (!$el) {
      return;
    }

    $el.attr(name, value);
  }

  /**
   * getDataAttrValue
   * Возвращает значение data-[name] dom элемента
   * @param {String} name
   * @returns {string|undefined}
   */
  getDataAttrValue(name) {
    const { domEl } = this;

    return domEl ? domEl.dataset[name] : undefined;
  }

  setDataAttrValues(values) {
    const { domEl } = this;

    forIn(values, (value, key) => {
      domEl.dataset[key] = value;
    });
  }

  processLoadData(data) {
    this.loadedData = data;
  }

  get box() {
    const { width, height } = this;

    return {
      width,
      height,
    };
  }

  set box({ width, height }) {
    this.width = width;
    this.height = height;
  }

  get width() {
    return this.$el.width();
  }

  set width(v) {
    if (this.ready) {
      this.$el.width(v);
    } else {
      this.addRenderConfigProp('width', v);
    }
  }

  get height() {
    return this.$el?.height();
  }

  set height(v) {
    this.setProp('height', v);
  }

  setHeight(height) {
    this.$el.height(height);
  }

  getProp(name) {
    return this[name];
  }

  setProp(name, value) {
    if (this.ready) {
      const setFn = this.getSetPropFn(name);

      setFn(value);
    } else {
      this.addRenderConfigProp(name, value);
    }
  }

  getSetPropFn(propName) {
    const fnName = getSetFnName(propName);
    const fn = this[fnName];

    assert.ok(typeof fn === 'function', `${fnName} is not a function!`);

    return fn.bind(this);
  }

  addRenderConfigProp(prop, val) {
    this.renderConfig[prop] = val;
  }

  onBeforeComponentAdd() {}

  onComponentAdd() {}
}

Component.initMixins([
  'observable',
  'child-owner',
  'popover',
  'vm-holder',
  'propertiable',
  'loadable',
]);

export default Component;
