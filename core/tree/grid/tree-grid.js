import 'jquery.fancytree/dist/modules/jquery.fancytree.table';
import TreeBase from '../base/tree-base';

class TreeGrid extends TreeBase {
  constructor(
    elementSelector,
    loadDataUrl,
    saveDataUrl,
    deleteDataUrl,
    readOnly
  ) {
    super(elementSelector, loadDataUrl, saveDataUrl, deleteDataUrl, readOnly);
    this.afterAdding = function () {};
    let self = this;
    let extensions = this.readOnly ? ['table'] : ['table', 'edit', 'dnd5'];
    $(elementSelector).fancytree({
      extensions: extensions,
      table: {
        indentation: 20,
        nodeColumnIdx: 0,
      },
      source: {
        url: loadDataUrl,
        cache: false,
      },

      activate: function (event, data) {
        self.onActivate(event, data);
      },
      click: function (event, data) {
        self.onClick(event, data);
      },
      init: function (event, data) {
        self.afterInit(event, data);
      },
    });
  }

  addNode(title) {
    let node = $(this.selector).fancytree('getActiveNode');
    let newNode;
    if (node) {
      newNode = node.addNode({ title: title }, 'after');
    } else {
      node = $(this.selector).fancytree('getTree').rootNode;
      newNode = node.addNode({ title: title }, 'child');
    }
    this.afterAdding(new Event('afteradding'), { node: newNode });
    this.saveNode(newNode);
    return newNode;
  }
}

export default TreeGrid;
