import Card from '@/core/card/card';
import Tree from '@/core/tree/tree';
import { alias } from '@/core/util/function';
/**
 * @class TreeCard
 * @extends Card
 * @prop treeComponent
 * @prop {Object} treeConfig
 * @prop {Tree} tree
 */
class TreeCard extends Card {
  constructor(p) {
    TreeCard.configDefaults(p, {
      treeConfig: {},
      treeComponent: Tree,
    });

    TreeCard.mergeConfig(p, {
      autoRenderBody: true,
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    this.initBody();

    this.renderTreeCt();

    this.initTreeConfig();

    this.tree = this.addChildComponent(this.treeConfig);

    this.load = alias(this.tree, 'load');
    this.reload = alias(this.tree, 'reload');
  }

  initTreeConfig() {
    const { treeConfig } = this;

    treeConfig.$el = this.$treeCt;
    treeConfig.component = this.treeComponent;
  }

  renderTreeCt() {
    const $treeCt = $('<div></div>');

    $treeCt.appendTo(this.$body);

    this.$treeCt = $treeCt;
  }

  initBody() {}

  refresh() {
    this.reload();
  }
}

export default TreeCard;
