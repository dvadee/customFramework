import 'jquery.fancytree/dist/modules/jquery.fancytree.filter';
import { get, isNumber } from 'lodash';
import TreeBase from './base/tree-base';
import TreeHeader from './header/tree-header';

/**
 * @class Tree
 * @prop editableNodes
 * @prop readOnly
 */
class Tree extends TreeBase {
  constructor(p) {
    Tree.configDefaults(p, {
      scopedChildsReferences: true,
      editableNodes: false,
      dndEnabled: false,
    });

    super(p);
  }

  renderHeader() {
    const cfg = this.getHeaderCfg();

    this.header = new TreeHeader(cfg);
  }

  getHeaderCfg() {
    return {
      $renderTo: this.$el,
      prepend: true,
      tree: this,
    };
  }

  /**
   * @protected
   */
  getFancyTreeConfig() {
    const config = super.getFancyTreeConfig();
    const { extensions } = config;
    const { filterCfg } = this;

    extensions.push('filter');

    if (this.editableNodes) {
      extensions.push('edit');
    }

    if (this.dndEnabled) {
      extensions.push('dnd');
    }

    Object.assign(config, {
      filter: filterCfg || {
        counter: false,
        mode: 'dimm',
      },
    });

    return config;
  }

  onInit() {
    super.onInit();

    $(`${this.selector} ul`).removeClass('fancytree-helper-hidden');
  }

  enhanceTitle(event, { $title, node }) {
    const html = this.getNodeEnhanceTitleHtml(node);

    if (html) {
      $($title).append(html);
    }
  }

  getNodeEnhanceTitleHtml(node) {
    const productNum = get(node, 'data.productsNumber');
    let prodNumHtml = '';

    if (isNumber(productNum)) {
      prodNumHtml = `<span class="badge badge-primary ml-1">${productNum}</span>`;
    }

    return prodNumHtml;
  }

  onLoadSelectionBtnClick() {
    this.trigger('loadselectionbtnclick', this);
  }

  forceRenderTree() {
    this.tree.render(true, true);
  }
}

export default Tree;
