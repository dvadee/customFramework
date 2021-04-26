import { template, isString, size } from 'lodash';
import DropdownBase from '@/core/dropdown/base/dropdown-base';
import Component from '../component';
import './dropdown.scss';

const itemTpl = /*html */ `
  <div class="dropdown-item" data-value="{{value}}">{{text}}</div>
`;

const emptyTpl = ({ text }) =>
  /*html */ `<div class="dropdown-item disabled" data-value="empty">${text}</div>`;

/**
 * @class Dropdown
 * @extend Component
 * @mixin RenderableList
 * @prop {jQuery} $btn
 * @prop {jQuery} $dropdownMenu
 * @prop {jQuery} $dropdownItem
 * @prop {Button} btn
 * @prop {Button} arrowBtn
 * @prop {Boolean} isMenuList - if false list features suppress
 * @prop {String} scrollableMenuCls
 * @event menuitemclick
 * @event menushow
 * @event menuhide
 */
class Dropdown extends DropdownBase {
  /**
   * @param {Object} p
   * @param {String} p.itemTpl
   * @param {Object} p.renderConfig
   * @param {Object[]} p.renderConfig.items
   */
  constructor(p) {
    Component.configDefaults(p, {
      emptyText: 'Нет данных',
      scrollableMenu: true,
      isMenuList: true,
      itemTpl,
      emptyTpl,
    });

    Component.mergeConfig(p, {
      scrollableMenuCls: 'dropdown-menu-scrollable',
      childs: ['.dropdown-item'],
      props: {
        dropdownItems: undefined,
      },
    });

    super(p);
  }

  applyDropdownItems(items) {
    if (!items) {
      items = [];
    }

    return items;
  }

  updateDropdownItems(items) {
    this.setItems(items);
  }

  initComponent() {
    super.initComponent();

    const { itemTpl } = this;
    const { $dropdownItem, $dropdownMenu } = this.childs;

    if (this.isMenuList) {
      this.$listEl = $dropdownMenu;

      if (isString(itemTpl)) {
        this.itemTpl = template(itemTpl);
      }

      if ($dropdownItem.length === 0) {
        this.items = [];
      }
    }

    if (this.scrollableMenu) {
      this.childs.$dropdownMenu.addClass(this.scrollableMenuCls);
    }
  }

  initEvents() {
    this.initItemsEvents();

    super.initEvents();
  }

  initItemsEvents() {
    if (this.isMenuList) {
      const { $dropdownItem } = this.childs;

      $dropdownItem.click((e) => this.onMenuItemClick(e));
    }
  }

  onMenuItemClick(e) {
    const item = e.currentTarget;
    const { value } = item.dataset;
    // submenu case
    if ($(item).is('.dropdown-toggle') || value === 'empty') {
      return;
    }

    this.trigger('menuitemclick', this, item, value, e);
  }

  onButtonClick(btn, e) {
    e.preventDefault();

    const value = this.btn.getDataAttrValue('value');

    this.trigger('buttonclick', this, btn, value, e);
  }

  get loadedItemsCount() {
    return size(this.items);
  }

  onItemsUpdate() {
    const mixin = this.renderableListMixin;

    mixin.onItemsUpdate.call(this);

    this.updateBtnState();
  }

  onListItemUpdate() {
    this.updateBtnState();
  }

  updateBtnState() {}

  clear() {
    this.items = [];
  }
}

Dropdown.initMixins(['renderable-list']);

export default Dropdown;
