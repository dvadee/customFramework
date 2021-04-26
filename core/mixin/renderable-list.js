import { filter } from 'lodash';

/**
 * Only from Component
 * @mixin
 * @requires
 * @property {String} itemTpl
 * @property {String} emptyTpl
 * @property {String} emptyText
 * @property {jQuery} $listEl
 */
const RenderableList = {
  get renderableListMixin() {
    return RenderableList;
  },

  initListMixin() {
    if (!this.$listEl) {
      this.$listEl = this.$el;
    }
    /**
     * Установить пустое значение
     */
    if (this.$listEl.children().length === 0) {
      this.items = [];
    }
  },

  isEmptyList: {
    get: function () {
      const { itemsData } = this;

      return !itemsData || itemsData.length === 0;
    },
  },

  itemsCount: {
    get: function () {
      return this.itemsData.length;
    },
  },

  /**
   * @param {Number} idx
   * @returns {jQuery|HTMLElement|null}
   */
  getItem(idx) {
    const data = this.itemsData[idx];

    return data ? data.$item : null;
  },

  getItems() {
    return this.itemsData;
  },

  setItems(data) {
    data = data || [];

    this.removeAllItems();

    this.itemsData = data;

    let items;

    if (this.filter) {
      data = filter(data, this.filter);
    }

    if (data.length === 0) {
      items = [this.renderEmpty()];
    } else {
      items = data.map((data) => this.renderItem(data));
    }

    items.forEach((html, index) => {
      this._addItem(html, data[index]);
    });

    this.onItemsUpdate();
  },

  items: {
    get() {
      return this.getItems();
    },
    /**
     *
     * @param {Object[]} [data=[]]
     */
    set(data) {
      this.setItems(data);
    },
  },

  /**
   * @private
   * @param html
   * @param data
   * @private
   */
  _addItem(html, data) {
    const { $listEl, itemCls } = this;

    const item = $(html);

    if (data) {
      item.get(0)._data = data;

      data.$item = item;
    }

    if (itemCls) {
      item.addClass(itemCls);
    }

    item.appendTo($listEl);
  },

  renderEmpty() {
    return this.emptyTpl({ text: this.emptyText });
  },

  renderItem(data) {
    return this.itemTpl(data);
  },

  /**
   * @public
   * @param Object[] items
   */
  addItem(items) {
    const { itemsData } = this;

    items.forEach((data) => {
      itemsData.push(data);

      const html = this.renderItem(data);

      this._addItem(html, data);
    });

    this.onItemsUpdate();
  },

  removeItem() {},

  removeAllItems() {
    this.$listEl.empty();
    this.itemsData = [];
  },

  loadedData: {
    set(data) {
      this.items = data;
    },
  },

  loadRawData(data) {
    this.items = data;
  },

  onItemsUpdate() {
    this.initChilds();

    this.initEvents();
  },

  getItemMetaData(item) {
    const { value } = item.dataset;

    return this.getItemDataByValue(value);
  },

  getItemDataByValue(id) {
    const { valueField = 'value' } = this;
    return this.itemsData.find((item) => item[valueField] == id);
  },

  /**
   * TODO
   *
   * ListItem Class
   */
  updateItem(item) {
    const { itemTpl } = this;
    const tpl = $(itemTpl(item._data));

    $(item).html(tpl.html());

    if (this.onListItemUpdate) {
      this.onListItemUpdate();
    }
  },

  setFilter(filter) {
    this.filter = filter;

    this.items = this.itemsData;
  },
};

export default RenderableList;
