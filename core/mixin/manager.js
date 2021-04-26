import { forIn, has } from 'lodash';

const aliasMap = {
  'renderable-list': () => require('./renderable-list').default,
  'child-owner': () => require('./child-owner').default,
  bindable: () => require('./bindable').default,
  'vm-holder': () => require('./bindable').default,
  observable: () => require('./observable').default,
  renderable: () => require('./renderable').default,
  popover: () => require('./popover').default,
  stateful: () => require('./stateful').default,
  filter: () => require('../filter/filter').default,
  maximizable: () => require('./maximizable').default,
  propertiable: () => require('./propertiable').default,
  loadable: () => require('./loadable').default,
};

class MixinManager {
  static resolveMixin = (name) => {
    return aliasMap[name]();
  };

  static applyMixin = (target, mixin) => {
    forIn(mixin, (prop, key) => {
      if (!target[key]) {
        const isGetterSetter = has(prop, 'get') || has(prop, 'set');

        if (isGetterSetter) {
          Object.defineProperty(target, key, prop);
        } else {
          target[key] = prop;
        }
      }
    });
  };
}

export default MixinManager;
