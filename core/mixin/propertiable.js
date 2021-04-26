import { forIn, keys } from 'lodash';
import { isGetter, isSetter } from '@/core/util/function';
import { getUpdateFnName, getApplyFnName } from '@/core/util/string';
/**
 *
 * @mixin PropertiableMixin
 *
 * Чтобы не создавать каждый раз getter setter
 *
 * в конструктор класса передать
 * {
 *   props: {
 *     width: null
 *   }
 * }
 *
 * создасться getter и setter
 *
 * в setter вызывается apply[name](applyWidth) update[name](updateWidth) если есть
 *
 * в apply делать валидацию. Вернуть undefined если невалидное
 *
 * в update прописывать логику
 */

const PropertiableMixin = {
  get propertiableMixin() {
    return PropertiableMixin;
  },

  props: null,

  getPropsNames() {
    return keys(this.props);
  },

  initProps() {
    forIn(this.props, (value, name) => {
      value = this[name] ?? value;

      this.props[name] = this.initProp(name);

      this[name] = value;
    });
  },

  forceProps() {
    forIn(this.props, ({ getValue, apply, update }) => {
      if (!update) {
        return;
      }

      let value = getValue();

      if (apply) {
        value = apply(value, value);
      }

      if (value !== undefined) {
        update(value, value);
      }
    });
  },

  initProp(name) {
    const valueKey = `_${name}`;
    const applyFn = this[getApplyFnName(name)];
    const updateFn = this[getUpdateFnName(name)];
    const hasGetter = isGetter(this, name);
    const hasSetter = isSetter(this, name);
    const desc = {};

    if (!hasGetter) {
      desc.get = function () {
        return this[valueKey];
      };
    }

    if (!hasSetter) {
      desc.set = function (value) {
        if (this.destroing) {
          return;
        }

        const oldValue = this[valueKey];

        if (value === oldValue) {
          return;
        }

        if (applyFn) {
          value = applyFn.call(this, value, valueKey);
        }

        if (value === undefined) {
          return;
        }

        if (updateFn) {
          updateFn.call(this, value, oldValue);
        }

        this[valueKey] = value;
      };
    }

    if (desc.get || desc.set) {
      Object.defineProperty(this, name, desc);
    }

    return {
      getValue: () => this[name],
      setValue: (value) => (this[name] = value),
      apply: applyFn?.bind(this),
      update: updateFn?.bind(this),
      name,
    };
  },
};

export default PropertiableMixin;
