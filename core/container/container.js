import { castArray, size } from 'lodash';
import Component from '@/core/component';

/**
 * @class Container
 * @extend Component
 * @description контейнер для компонентов
 * @prop $containerEl
 */
class Container extends Component {
  constructor(p) {
    Container.configDefaults(p, {
      renderTpl: '<div></div>',
    });

    super(p);
  }
  initComponent() {
    super.initComponent();

    this.initItems();
  }

  initItems() {
    const { items } = this;

    if (items) {
      this.add(items);
    }
  }

  get $containerEl() {
    return this.$el;
  }

  getItems() {
    return this.childComponents;
  }

  setItems(items) {
    this.removeAll();

    this.add(items);
  }

  /**
   * @param {Object[]} items
   */
  add(items) {
    castArray(items).forEach((config) => {
      if (!config.$el && !config.component.prototype.isRenderable) {
        throw new Error(
          `${config.name} - Items in container component must be renderable or have $el in config!`
        );
      }

      this.addChildComponent(config);
    });
  }

  remove(item) {
    this.removeComponent(item);
  }

  removeAll() {
    this.destroyChildsComponents();
  }

  get itemsCount() {
    return size(this.getItems());
  }

  getItemById(id) {
    return this.getItems().find((item) => item.id === id);
  }
}

export default Container;
