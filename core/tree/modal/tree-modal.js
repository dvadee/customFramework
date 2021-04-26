import { clone, assign } from 'lodash';
import Modal from '@/core/modal/modal';
import Tree from '@/core/tree/tree';

const bodyRenderTpl = `
  <div data-ref="tree"></div>
`;
/**
 * @class TreeModal
 * @extend Modal
 * @description Окно с древовидным списком
 * @prop treeConfig
 * @prop treeClass
 */
class TreeModal extends Modal {
  constructor(p) {
    TreeModal.mergeConfig(p, {
      childs: ['tree'],
      bodyRenderTpl,
    });

    TreeModal.configDefaults(p, {
      bodyHeight: '400px',
      treeConfig: {},
      centered: true,
      treeClass: Tree,
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    this.addChildComponent(this.getTreeConfig());

    this.childs.$body.css('height', this.bodyHeight);
  }

  getTreeConfig() {
    const treeConfig = clone(this.treeConfig);

    assign(treeConfig, {
      reference: 'tree',
      component: this.treeClass,
      $el: this.childs.$tree,
    });

    return treeConfig;
  }
}

export default TreeModal;
