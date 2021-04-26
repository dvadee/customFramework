import { defaults, isNumber, get, defer, isString, isFunction } from 'lodash';
import template from '@/core/util/lodash-template';
import Component from '../component';

const itemTpl =
  '<button type="button" class="list-group-item-action py-1" data-value="{{value}}" >{{text}}</button>';

const emptyTpl =
  ' <div class="list-group-item disabled item-group-item-empty">{{text}}</div>';

/**
 * @class List
 * @extends Component
 * @mixes RenderableList
 * @prop {String} valueField
 * @event deselect
 * @event selectionchange
 * @event itemclick
 */
class List extends Component {
  _activeItemMeta;
  _active;
  /**
   *
   * @param {Object} p
   * @param {String} p.emptyText
   * @param {String} p.itemTpl
   * @param {String} p.emptyTpl
   * @param {Boolean} p.selectable
   * @param {Boolean} p.autoSelect
   */
  constructor(p) {
    defaults(p, {
      displayField: 'text',
      valueField: 'value',
      emptyText: 'Нет данных',
      selectable: true,
      allowDeselect: true,
      activeItemCls: 'active',
      autoSelect: false,
      itemCls: ['list-item', 'list-group-item'],
      itemTpl,
      emptyTpl,
    });

    Component.mergeConfig(p, {
      mixins: ['renderable-list'],
      childs: ['.list-item'],
    });

    super(p);
  }

  initComponent() {
    const { itemTpl, emptyTpl } = this;

    super.initComponent();

    if (itemTpl && isString(itemTpl)) {
      this.itemTpl = template(itemTpl);
    }

    if (emptyTpl && isString(emptyTpl)) {
      this.emptyTpl = template(emptyTpl);
    }

    this.initListMixin();

    this.ensureActiveItem();
  }

  get activeItem() {
    return this._active;
  }

  get selectedItemData() {
    return this._activeItemMeta || null;
  }

  ensureActiveItem() {
    if (this.autoSelect && this.itemsCount > 0) {
      defer(() => {
        this.activeItem = 0;
      });
    }
  }

  getItemByIndex(index) {
    const items = get(this, 'childs.$listItem', $());

    return items.get(index);
  }

  set activeItem(newActive) {
    if (isNumber(newActive)) {
      newActive = this.getItemByIndex(newActive);
    }

    const { activeItemCls } = this;
    const oldActive = this._active;
    let meta = null;
    let isEqualNode =
      newActive && oldActive && newActive.isEqualNode(oldActive);

    if (isEqualNode && !this.allowDeselect) {
      return;
    }

    if (oldActive) {
      $(oldActive).removeClass(activeItemCls);
    }

    if (isEqualNode && this.allowSelect) {
      newActive = null;

      this.trigger('deselect', this);
    }

    if (newActive) {
      $(newActive).addClass(activeItemCls);

      meta = this.getItemDataByValue(newActive.dataset.value);
    }

    this.trigger('selectionchange', this, meta);

    this._activeItemMeta = meta;
    this._active = newActive;
  }

  get firstItemCls() {
    const { itemCls } = this;
    return isString(itemCls) ? itemCls : itemCls[0];
  }

  initEvents() {
    this.initItemsEvents();
  }

  initItemsEvents() {
    const { $listItem } = this.childs;

    $listItem.click(this.onItemClick.bind(this));

    $listItem.dblclick(this.onItemDblClick.bind(this));

    $listItem.on(
      'click',
      '[data-action]',
      this.onItemActionBtnClick.bind(this)
    );
  }

  onItemClick(e) {
    this.trigger('itemclick', this, e);

    if (this.selectable) {
      this.activeItem = e.currentTarget;
    }
  }

  onItemDblClick(e) {
    const item = e.currentTarget;

    const meta = this.getItemDataByValue(item.dataset.value);

    this.trigger('itemdblclick', this, meta, e);
  }

  onItemActionBtnClick(e) {
    const $target = $(e.currentTarget);
    const action = $target.attr('data-action');
    const $item = $target.closest(`.${this.firstItemCls}`);
    const meta = this.getItemMetaData($item[0]);

    if (!meta) {
      return;
    }

    const fn = isFunction(action) ? action : this[action];

    if (!fn) {
      console.error(`List - action ${action} not found`);
      return;
    }

    defer(() => {
      fn.call(this, meta);
    });
  }

  onBeforeLoad() {
    this.activeItem = null;
  }

  processLoadData(data) {
    this.activeItem = null;

    super.processLoadData(data);

    this.ensureActiveItem();
  }

  removeAllItems() {
    this.activeItem = null;

    this.renderableListMixin.removeAllItems.call(this);
  }
}

List.initMixins(['renderable-list']);

export default List;
