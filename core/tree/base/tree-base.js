import { pull } from 'lodash';
import { createTree } from 'jquery.fancytree';
import 'jquery.fancytree/dist/modules/jquery.fancytree.ui-deps';
import 'jquery.fancytree/dist/modules/jquery.fancytree.dnd';
import 'jquery.fancytree/dist/modules/jquery.fancytree.edit';
import 'jquery.fancytree/dist/modules/jquery.fancytree.persist';
import '../fancytree/plugin/tree-fancytree-plugin';
import './tree-base.scss';
import Component from '@/core/component';
import ErrorHandler from '@/core/error/handler/error-handler';
import { selectInputText } from '@/core/util/dom';
import TreeFancytreeNode from '@/core/tree/fancytree/node/tree-fancytree-node';

/**
 * @class TreeBase
 * @mixes ChildOwnerMixin
 * @mixes ChildOwnerMixin
 * @mixes ObservableMixin
 * @mixes BindableMixin
 * @mixes PropertiableMixin
 * @prop loadProxy
 * @prop nodeClass
 * @prop {Boolean} addRootNode
 * @prop {String} rootTitle
 * @prop {String} rootKey
 */
class TreeBase extends Component {
  static copyTreeSourceToAnotherTree(tree, descTree) {
    const nodesForCopy = tree.rootNode.children;
    const { rootNode } = descTree;

    rootNode.removeChildren();

    nodesForCopy.forEach((node) => {
      node.copyTo(rootNode);
    });
  }

  constructor(p) {
    TreeBase.configDefaults(p, {
      autoLoad: false,
      baseCls: 'tree',
      _singleSelectMode: 1,
      _multiSelectMode: 3,
      _selected: null,
      addRootNode: false,
      rootTitle: 'root',
      rootKey: 'root',
      nodeClass: TreeFancytreeNode,
    });

    p.$el = p.$el || $(p.selector);

    super(p);
  }

  initComponent() {
    this.initFancyNode();

    this.initFancyTree();

    if (this.multiSelectModeEnabled !== undefined) {
      this.multiSelectMode = this.multiSelectModeEnabled;
    }
  }

  initFancyNode() {
    if (this.nodeClass) {
      this.nodeClass.init();
    }
  }

  initFancyTree() {
    const { $el, baseCls, headerEnabled = true } = this;
    const config = this.getFancyTreeConfig();

    $el.addClass(baseCls);

    this.$body = $(`<div class="${baseCls}__body"></div>`);

    this.$body.appendTo($el);

    this.tree = createTree(this.$body, config);

    if (headerEnabled) {
      this.renderHeader();
    }
  }

  getFancyTreeConfig() {
    const { loadUrl, source = [], treeConfig = {}, treeId } = this;

    const cfg = {
      treeId,
      extensions: ['coretree'],
      source: loadUrl
        ? {
            url: loadUrl,
            cache: false,
          }
        : source,
      edit: {
        triggerStart: ['dblclick', 'f2', 'mac+enter', 'shift+click'],
        beforeEdit: this.onBeforeNodeEdit.bind(this),
        edit: this.onNodeEditStart.bind(this),
        beforeClose: this.onBeforeNodeEditClose.bind(this),
        save: this.saveNodeEdit.bind(this),
        close: this.onNodeEditClose.bind(this),
      },
      init: this.onInit.bind(this),
      click: this.onClick.bind(this),
      beforeActivate: this.onBeforeActivate.bind(this),
      activate: this.onActivate.bind(this),
      beforeSelect: this.onBeforeSelect.bind(this),
      select: this.onSelect.bind(this),
      dblclick: this.onDblClick.bind(this),
      enhanceTitle: this.enhanceTitle.bind(this),
      strings: {
        loading: 'Загрузка...',
        loadError: 'Ошибка загрузки!',
        moreData: 'Показать еще...',
        noData: 'Нет данных.',
      },
      coreTree: this,
    };

    if (this.dndEnabled) {
      cfg.dnd = {
        autoExpandMS: 800,
        focusOnClick: false,
        preventRecursiveMoves: true,
        preventVoidMoves: true,
        dropMarkerInsertOffsetX: 24,
        dragStart: this.onDragStart.bind(this),
        dragEnter: this.onDragEnter.bind(this),
        dragDrop: this.onDragDrop.bind(this),
      };
    }

    if (treeId) {
      cfg.extensions.push('persist');

      cfg.persist = {
        store: 'local',
        types: 'expanded',
      };
    }

    Object.assign(treeConfig, cfg);

    return treeConfig;
  }

  onInit() {
    this.trigger('init', this);
  }

  onBeforeNodeEdit(eOpts, { node }) {
    if (this.addRootNode) {
      return !node.isTreeRootNode();
    }
  }

  onNodeEditStart(eOpts, { input }) {
    selectInputText(input);
  }

  onBeforeNodeEditClose() {}

  saveNodeEdit(eOpts, { node, input, dirty }) {
    if (!dirty) {
      return;
    }

    node.setTitle(input.val());

    node.saveNodeData();
  }

  onNodeEditClose() {}

  onClick() {}

  onBeforeActivate(e, { node }) {
    if (
      this.trigger('beforeselect', this, node) === false ||
      !this.isSelectableNode(node)
    ) {
      return false;
    }
  }

  onActivate(e, { node }) {
    this.trigger('nodeselect', this, node);

    this.triggerActiveNodeChange();
  }

  onDeactivate() {
    this.trigger('nodeselect', this, null);

    this.triggerActiveNodeChange();
  }

  triggerActiveNodeChange() {
    const node = this.activeNode;

    this.trigger('activechange', this, node);

    this.publishState('activeNode', node);
  }

  onBeforeSelect(e, { node }) {
    if (
      this.trigger('beforeselect', this, node) === false ||
      !this.isSelectableNode(node)
    ) {
      return false;
    }
  }

  onSelect(e, metaData) {
    this._selected = metaData.node;

    this.triggerSelectedChange(e, metaData);

    return true;
  }

  triggerSelectedChange(...args) {
    args.unshift('nodeselect');

    this.trigger.apply(this, args);

    this.publishState('selectedNodes', this.getSelectedNodes());
  }

  onDblClick(e, metaData) {
    this.trigger('nodedblclick', this, metaData, e);
  }

  onDragStart(node) {
    return !node.isTreeRootNode();
  }

  onDragEnter(node) {
    if (node.isTreeRootNode()) {
      return false;
    }

    return ['over'];
  }

  onDragDrop(node, data) {
    this.trigger('nodedragdrop', this, node, data);
  }

  onOuterDrop(node, data) {
    this.trigger('outerdrop', this, node, data);
  }

  enhanceTitle() {}

  renderHeader() {}

  isSelectableNode(node) {
    return !node.isStatusNode();
  }

  get multiSelectMode() {
    return this.tree.getOption('selectMode') === this._multiSelectMode;
  }

  set multiSelectMode(multiSelectMode) {
    const { tree } = this;
    const selectMode = multiSelectMode
      ? this._multiSelectMode
      : this._singleSelectMode;

    tree.setOption('checkbox', multiSelectMode);
    tree.setOption('selectMode', selectMode);

    if (!multiSelectMode) {
      this.deselectAllNodes();
    }
  }

  get rootNode() {
    return this.tree?.rootNode;
  }

  beforeEdit() {
    return true;
  }

  beforeSave() {
    return true;
  }

  async load(params) {
    this.loading = true;

    try {
      this.onBeforeLoad();

      if (this.loadProxy) {
        await this._load(params);
      } else if (this.loadUrl) {
        await this.tree.reload({
          url: this.loadUrl,
          dataType: 'json',
          data: params,
        });
      }
    } catch (err) {
      ErrorHandler.handleError(err);
    } finally {
      this.loading = false;
    }
  }

  async _load(params) {
    this.lastLoadParams = params;

    const res = await this.loadProxy(params);

    this.loadTreeRawData(res);
  }

  loadTreeRawData(treeSource) {
    if (this.addRootNode && treeSource && treeSource.length > 0) {
      treeSource = [
        {
          folder: true,
          expanded: true,
          key: this.rootKey,
          title: this.rootTitle,
          children: treeSource,
        },
      ];
    }

    this.tree.reload(treeSource);
  }

  onBeforeLoad() {
    this.deactivateActiveNode();
  }

  async reload() {
    const id = this.getActiveNodeId();

    await this.load(this.lastLoadParams);

    this.activateNodeById(id);
  }

  clear() {
    this.loadTreeRawData([]);
  }

  nodeByElement(el) {
    return $.ui.fancytree.getNode(el);
  }

  outerDrop() {
    return false;
  }

  clearFilter() {
    this.tree.clearFilter();
  }

  filterNodes(
    filterExpression,
    cfg = {
      autoExpand: true,
      leavesOnly: false,
    }
  ) {
    this.tree.filterNodes(filterExpression, cfg);
  }

  setOption(key, value) {
    this.tree.setOption(key, value);
  }

  enableMultiSelectMode() {
    this.multiSelectMode = true;
  }

  disableMultiSelectMode() {
    this.multiSelectMode = false;
  }

  /**
   * @returns {String[]}
   */
  getSelectedKeys() {
    const { multiSelectMode, selection } = this;
    let selectionNodes = [];

    if (multiSelectMode) {
      selectionNodes = this.getSelectedNodes().map(({ key }) => key);
    } else if (selection) {
      selectionNodes.push(selection.key);
    }

    if (this.addRootNode) {
      pull(selectionNodes, this.rootKey);
    }

    return selectionNodes;
  }

  /**
   * @deprecated
   * @use activeNode
   * @returns {FancytreeNode|*}
   */
  get selection() {
    return this.activeNode;
  }

  get activeNode() {
    return this.tree?.getActiveNode();
  }

  set activeNode(node) {
    if (!node) {
      this.deactivateActiveNode();
    } else if (node && node.tree._id === this.tree._id && !node.isActive()) {
      node.setActive();
    }
  }

  get hasActiveNode() {
    return !!this.activeNode;
  }

  getActiveNodeId() {
    return this.activeNode?.key || null;
  }

  activateNodeById(id) {
    this.tree?.activateKey(id);
  }

  deactivateActiveNode() {
    const { activeNode } = this;

    if (activeNode) {
      activeNode.setActive(false);

      this.onDeactivate();
    }
  }

  get nodesCount() {
    return this.tree.count();
  }

  set loading(v) {
    Component.prototype.setLoading.call(this, v);
  }

  get isAllNodesSelect() {
    const selected = this.getSelectedNodes();

    return this.nodesCount === selected.length;
  }

  /**
   * @param {Boolean} [returnVisible=true]
   * @returns {FancytreeNode[]|*}
   */
  getSelectedNodes(returnMathced = true) {
    let nodes = this.tree.getSelectedNodes();

    if (returnMathced) {
      nodes = nodes.filter((node) => node.isMatched());
    }

    return nodes;
  }

  getSelectedNodesWithoutFolders() {
    return this.getSelectedNodes().filter((node) => !node.isFolder());
  }

  toggleAllNodesSelect() {
    if (this.isAllNodesSelect) {
      this.deselectAllNodes();
    } else {
      this.selectAllNodes();
    }
  }

  selectAllNodes() {
    this.tree.selectAll(true);
  }

  deselectAllNodes() {
    this.tree.selectAll(false);

    this.deactivateActiveNode();
  }

  expandAllNodes() {
    this.tree.expandAll(true);
  }

  collapseAllNodes() {
    this.tree.expandAll(false);
  }

  getNodeById(id) {
    return this.tree.getNodeByKey(id);
  }
}

export default TreeBase;
