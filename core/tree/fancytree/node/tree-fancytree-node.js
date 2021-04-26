import { getObjMethodsNames } from '@/core/util/function';
/**
 * @class TreeFancytreeNode
 * @prop {String[]} methods - методы которые будут записаны в prototype FancyTreeNodeClass
 * @prop {String} nodeScopeName - подкатегория куда запишутся методы (node.catalogs.save())
 *
 * Применять имена методов с осторожностью!
 *
 * В вызове метода this- FancyTreeNode
 */
class TreeFancytreeNode {
  static init() {
    const NodeExtClass = this;

    new NodeExtClass();
  }

  constructor() {
    this.FTNodeClass = $.ui.fancytree._FancytreeNodeClass;

    this.initMethods();

    this.initFTNodeMethods();
  }

  initMethods() {
    const exclude = ['constructor', 'initFTNodeMethods', 'initMethods'];

    this.methods = getObjMethodsNames(Object.getPrototypeOf(this), { exclude });
  }

  initFTNodeMethods() {
    const { FTNodeClass, methods } = this;
    const node = this;

    methods.forEach((method) => {
      if (!FTNodeClass.prototype[method]) {
        FTNodeClass.prototype[method] = function () {
          return node[method].apply(this, arguments);
        };
      }
    });
  }

  isTreeRootNode() {
    const tree = this.getCoreTree();

    return tree.addRootNode ? this.key === tree.rootKey : this.isRootNode();
  }

  setLoading(loading) {
    this.toggleClass('fancytree-pending', loading);
  }

  getCoreTree() {
    return this.tree.coreTree;
  }

  getProductCount() {
    return this.data.productNumber ?? 0;
  }
}

export default TreeFancytreeNode;
