import Dropdown from '../dropdown';
import { emptyFn, alias } from '../../util/function';
/**
 * @description dropdown with custom menu
 */
class DropdownCustom extends Dropdown {
  initComponent() {
    this.$listEl = this.childs.$dropdownMenu;
    const list = this.createList();

    if (!list) {
      throw new Error('DropdownCustom - list is required!');
    }

    this.list = list;

    this.initButton();

    this.load = alias(list, 'load');
    this.reload = alias(list, 'reload');
    this.clear = alias(list, 'clear');
  }
  /**
   * @protected
   */
  createList() {}

  initItemsEvents() {}

  get items() {
    return [];
  }

  set items(v) {
    this._items = v;
  }

  set loadedData(v) {
    emptyFn(v);
  }

  get loading() {
    return this.list ? this.list.loading : false;
  }

  set loading(loading) {
    if (this.list) {
      this.list.loading = loading;
    }
  }
}

export default DropdownCustom;
