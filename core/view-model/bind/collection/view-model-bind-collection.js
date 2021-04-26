import { forIn } from 'lodash';

class ViewModelBindCollection {
  binds = {};

  /**
   *
   * @param {ViewModelBind} bind
   * @param {String} name
   */
  add({ bind, name }) {
    this.binds[name] = bind;

    Object.defineProperty(this, name, {
      get() {
        return this.binds[name];
      },
    });
  }

  notify() {
    forIn(this.binds, (bind) => bind.notify());
  }
}

export default ViewModelBindCollection;
