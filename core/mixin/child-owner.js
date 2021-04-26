import assert from 'assert';
import { isString, mapValues } from 'lodash';
import {
  isSelectorString,
  isDisabledEl,
  setElDisabled,
  isVisible,
  setElVisible,
} from '../util/dom';
import { emptyFn } from '@/core/util/function';
import { createRefName } from '@/core/util/identifier';

const refKey = '__reference';

const simpleDomEnds = ['el', 'ct'].map((str) => '-' + str);

/**
 * @mixin ChildOwnerMixin
 */
const ChildOwnerMixin = {
  get childOwnerMixin() {
    return ChildOwnerMixin;
  },

  setChilds(childs) {
    this.childs = childs;

    this.initChilds();
  },

  initChilds() {
    const { childs = [], $el } = this;

    if (!$el) {
      return;
    }

    if (!this.childsRefs) {
      this.childsRefs = childs;
    }

    //create childs els
    this.childs = [];
    //clear childs components
    this._components = [];

    const childsRefs = this.childsRefs.map((cfg) => {
      return {
        isComponent: !isString(cfg) && !!cfg.component,
        cfg,
      };
    });

    childsRefs
      .filter((item) => !item.isComponent)
      .forEach((item) => this.addDomChildEl(item.cfg));

    childsRefs
      .filter((item) => item.isComponent)
      .forEach((item) => this.addChildComponent(item.cfg));
  },
  /**
   *
   * @param {String} ref
   */
  findChildEl(ref) {
    const el = this.$el.get(0);

    if (!ref) {
      return { child: null, $child: null };
    }

    const child = isSelectorString(ref)
      ? el.querySelectorAll(ref)
      : el.querySelector(`[data-ref=${ref}]`);

    // if (!child) {
    //   console.error(`${this.constructor.name} - child ${ref} not founded!`);
    // }

    return { child, $child: $(child) };
  },

  addDomChildEl(ref) {
    const childObj = this.childs;
    const name = createRefName(ref);
    const $name = '$' + name;
    const { child, $child } = this.findChildEl(ref);
    const isSimpleDom = simpleDomEnds.some((end) => ref.endsWith(end));

    childObj[$name] = $child;

    if (child) {
      childObj[name] = child;
      childObj.push(child);
      child[refKey] = ref;

      Object.defineProperty(childObj, `${$name}Disabled`, {
        get: () => isDisabledEl($child),
        set: (v) => {
          setElDisabled($child, v);
        },
      });

      /**
       * Сеттер только для простых элементов, на которые не будут инициализированы компоненты.
       */
      if (isSimpleDom) {
        Object.defineProperty(childObj, `${$name}Visible`, {
          get: () => isVisible($child),
          set: (v) => {
            setElVisible($child, v);
          },
        });

        Object.defineProperty(childObj, `${$name}Html`, {
          get: () => $child.html(),
          set: (v) => {
            $child.html(v);
          },
        });
      }
    }
  },

  addChildComponent(config) {
    const ref = config.reference || '';
    const name = createRefName(ref);
    const { isRenderable } = config.component.prototype;

    if (isRenderable) {
      config = this.initRenderableChildRenderConfig(name, config);
    } else if (!config.$el) {
      config = this.initChildRenderConfig(name, config);
    }

    return this.addComponent(name, config);
  },

  initChildRenderConfig(name, config) {
    const { child, $child } = this.findChildEl(config.reference);

    assert.ok(
      !!child,
      `ChildOwner - ${this.reference} - el for ${config.reference} not found!`
    );

    config.$el = $child;

    return config;
  },

  initRenderableChildRenderConfig(name, config) {
    const { renderToRef, reference } = config;

    if (renderToRef) {
      const { $child, child } = this.findChildEl(renderToRef);

      assert.ok(
        !!child,
        `ChildOwner - ${renderToRef} renderToRef dom element not found!`
      );

      config.$renderTo = $child;
    } else if (!config.$renderTo) {
      const { child, $child } = this.findChildEl(reference);

      config.$renderTo = child ? $child : this.$containerEl || this.$el;
    }

    return config;
  },
  /**
   * @private
   * @param {String} name
   * @param {Object} config
   */
  addComponent(name, config) {
    const ComponentClass = config.component;

    config.blockCmp = this.blockCmp || this;
    config.parentCmp = this;

    if (this.scopedChildsReferences) {
      config.scopedChildsReferences = true;
      config.scopedReference = true;
    }

    if (config.listeners) {
      this.prepareChildListeners(config);
    }

    this.onBeforeComponentAdd(config);

    delete config.component;

    const component = new ComponentClass(config);

    if (name || !(name in this)) {
      this[name] = component;
    }

    this.childComponents.push(component);

    this.onComponentAdd(component);

    return component;
  },

  removeComponent(component) {
    const { childComponents } = this;

    const index = childComponents.findIndex((cmp) => cmp.id === component.id);

    if (index > -1) {
      childComponents.splice(index, 1);

      component.destroy();
    }
  },

  onBeforeComponentAdd: emptyFn,

  onComponentAdd: emptyFn,

  prepareChildListeners(config) {
    const { blockCmp, listeners } = config;
    const controller = blockCmp?.controller;

    config.listeners = mapValues(listeners, (fn) => {
      if (isString(fn)) {
        const scope = listeners.scope;

        if (this[fn]) {
          fn = this[fn].bind(scope || this);
        } else if (blockCmp[fn]) {
          fn = blockCmp[fn].bind(scope || blockCmp);
        } else if (controller && controller[fn]) {
          fn = controller[fn].bind(scope || controller);
        } else {
          throw new Error(`${fn} - listener handler not found!`);
        }
      }

      return fn;
    });

    return config;
  },

  childComponents: {
    get() {
      return this._components;
    },
  },

  getChildComponentById(id) {
    return this.childComponents.find((cmp) => cmp.getId() === id);
  },

  destroyChildsComponents() {
    const { childComponents } = this;

    if (childComponents) {
      childComponents.forEach((cmp) => {
        cmp.destroy && cmp.destroy();
      });

      childComponents.splice(0);
    }
  },
};

export default ChildOwnerMixin;
