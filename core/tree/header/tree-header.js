import Component from '../../component';
import RenderableMixin from '../../mixin/renderable';
import TreeHeaderFilter from './filter/tree-header-filter';

const renderTpl = /*html*/ `
  <div class="{{cls}} mb-3 row"></div>
`;

class TreeHeader extends Component {
  /**
   * @param {{tree: Tree}} p
   * @param {JQuery} p.$el
   * @param {Tree} p.tree
   */
  constructor(p) {
    Object.assign(p, {
      baseCls: 'tree-header',
      $renderTo: p.tree.$el,
      prepend: true,
      renderTpl,
    });

    super(p);
  }

  initComponent() {
    const { enableFilter = true, enableMultiSelectChange = true } = this.tree;

    if (enableMultiSelectChange) {
      this.renderMultiSelectChange();
    }

    if (enableFilter) {
      this.createFilter();
    }
  }

  getRenderData() {
    const { tree, baseCls } = this;

    return {
      cls: `${tree.baseCls}__header ${baseCls}`,
    };
  }

  createFilter() {
    this.filter = new TreeHeaderFilter({
      $renderTo: this.$el,
      tree: this.tree,
    });
  }

  renderMultiSelectChange() {
    const { $el, baseCls, tree } = this;
    const btnCls = `${baseCls}__load-selection-btn`;
    const cbxCls = `${baseCls}__multiselect-checkbox`;

    const $ct = $(/*html */ `
      <div class="col-12 mb-3">
          <div class="d-flex align-items-center justify-content-between">
              <div class="form-check form-check-inline pl-0">
                <label class="form-check-label">
                    <input type="checkbox" class="form-check-input-styled pr-1 ${cbxCls}" />
                    <span>Выбор нескольких каталогов</span>
                </label>
              </div>
              <button class="btn btn-success ${btnCls}">Показать</button>
          </div>
      </div>
    `);

    const $multiSelectCheckbox = $ct.find(`.${cbxCls}`);
    const $loadSelectionBtn = $ct.find(`.${btnCls}`);

    $multiSelectCheckbox.change(() => {
      const checked = $multiSelectCheckbox.prop('checked');

      tree[checked ? 'enableMultiSelectMode' : 'disableMultiSelectMode']();
    });

    $loadSelectionBtn.click(() => {
      if (tree.onLoadSelectionBtnClick) {
        tree.onLoadSelectionBtnClick();
      }
    });

    this.$multiSelectCheckbox = $multiSelectCheckbox;
    this.$loadSelectionBtn = $loadSelectionBtn;

    $ct.appendTo($el);
  }
}

Object.assign(TreeHeader.prototype, RenderableMixin);

export default TreeHeader;
