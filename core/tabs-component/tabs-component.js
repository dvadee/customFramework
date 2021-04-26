import { clone, defer } from 'lodash';
import Component from '../component';
import TabsComponentHeader from '@/core/tabs-component/header/tabs-component-header';
import TabsComponentBody from '@/core/tabs-component/body/tabs-component-body';
import { createId } from '@/core/util/identifier';
import renderTpl from './tabs-component.pug';

/**
 * @class TabsComponent
 * @extend Component
 * @prop {TabsComponentHeader} header
 * @prop {TabsComponentBody} body
 * @prop {Boolean} fitContent
 * @prop {Boolean} [hiddenHeader=false]
 */

class TabsComponent extends Component {
  constructor(p) {
    TabsComponent.configDefaults(p, {
      fitContent: false,
      tabs: [],
      headerHidden: false,
    });

    TabsComponent.mergeConfig(p, {
      baseCls: 'tabs-component',
      childs: [
        'wrapper-el',
        'header-ct',
        'body-ct',
        {
          reference: 'header',
          renderToRef: 'header-ct',
          component: TabsComponentHeader,
        },
        {
          reference: 'body',
          component: TabsComponentBody,
        },
      ],
      renderTpl,
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    this.header.on({
      tabshown: this.onTabShown.bind(this),
      tabhidden: this.onTabHidden.bind(this),
    });

    if (this.fitContent) {
      const { $wrapperEl } = this.childs;

      $wrapperEl.addClass(['d-flex', 'flex-column']);

      this.body.addCls('flex-fill', 'h-0', 'overflow-hidden');
    }

    if (this.hiddenHeader) {
      this.header.hide();
    }
  }

  getItems() {
    return this._items;
  }

  /**
   * @param {Object[]} items
   * @param {Object} items.title
   */
  setItems(items) {
    const { header, body } = this;

    const tabs = [];

    items.forEach((item) => {
      const { header, body } = this.prepareItem(item);

      tabs.push({ header, body });
    });

    header.setItems(tabs.map(({ header }) => header));
    body.setItems(tabs.map(({ body }) => body));

    this.items = tabs;

    defer(() => {
      header.active = 0;
    });
  }

  getBodyItemComponentById(id) {
    return this.body.getChildComponentById(id);
  }

  prepareItem(item) {
    const body = clone(item);
    const header = { text: item.title };

    header.id = body.id = createId('tabpane');

    body.fitContent = this.fitContent;

    return { header, body };
  }

  /**
   * @param {Object} item
   * @param {Object} item.title
   */
  addItem(item) {
    const { header, body } = this.prepareItem(item);

    this.header.addItem(header);
    this.body.addItem(body);
  }

  /**
   * @protected
   */
  onTabShown(header, { id }) {
    const tabItem = this.body.getItemById(id);

    if (tabItem && tabItem.isTabsComponentItem) {
      tabItem.onTabShow();
    }
  }

  /**
   * @protected
   */
  onTabHidden(header, { id }) {
    const tabItem = this.body.getItemById(id);

    if (tabItem && tabItem.isTabsComponentItem) {
      tabItem.onTabHidden();
    }
  }
}

TabsComponent.initMixins(['renderable']);

export default TabsComponent;
