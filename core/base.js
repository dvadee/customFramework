import {
  assign,
  concat,
  defaults,
  forIn,
  isArray,
  isString,
  mergeWith,
} from 'lodash';
import MixinManager from '@/core/mixin/manager';
import { createId } from '@/core/util/identifier';

/**
 * @class Base
 * @prop {Boolean} destroyed
 */
class Base {
  static mergeConfig = (obj, src) => {
    const mergeFn = (objProp, srcProp) => {
      if (isArray(objProp)) {
        return concat(srcProp, objProp);
      }
    };

    return mergeWith(obj, src, mergeFn);
  };

  static configDefaults = (p, cfg) => defaults(p, cfg);

  static assignConfig = (p, cfg) => assign(p, cfg);

  static setRequiredConfig = (p, cfg) => (p.requiredConfig = cfg);

  static initMixins(mixins = []) {
    const Class = this.prototype;

    mixins.forEach((mixin) => {
      if (isString(mixin)) {
        mixin = MixinManager.resolveMixin(mixin);
      }

      if (mixin) {
        MixinManager.applyMixin(Class, mixin);
      } else {
        new Error(`${mixin} - mixin not resolved!`);
      }
    });
  }

  constructor(p) {
    if (p.requiredConfig) {
      assign(this, p.requiredConfig);

      delete p.requiredConfig;
    }

    this.initConfig(p);

    if (!this.id) {
      this.id = createId();
    }

    this.destroyed = false;
  }

  initConfig(config) {
    // this.createConfig = config;

    forIn(config, (value, name) => {
      this[name] = value;
    });
  }

  isDestroyed() {
    return this.destroyed;
  }

  destroy() {
    this.destroing = true;

    forIn(this, (val, key) => {
      this[key] = null;
    });

    this.destroing = false;
    this.destroyed = true;
  }
}

export default Base;
