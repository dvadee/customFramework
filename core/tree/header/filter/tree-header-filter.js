import Component from '../../../component';
import Input from '../../../input/input';
import Button from '../../../button/button';

const renderTpl = `
  <div class="col-12 tree-header-filter">
      <div class="input-group">
        <input type="text" class="form-control" data-ref="filter-input" placeholder="Фильтр каталогов...">
        <div class="input-group-append">
          <button class="btn btn-light" data-ref="apply-btn"><i class="icon-search4"></i></button>
        </div>
        <div class="input-group-append">
          <button class="btn btn-light" data-ref="clear-btn"><i class="icon-x"></i></button>
        </div>
      </div>
  </div>
`;

class TreeHeaderFilter extends Component {
  /**
   *
   * @param p
   * @param {Tree} p.tree
   */
  constructor(p) {
    TreeHeaderFilter.mergeConfig(p, {
      childs: ['filter-input', 'apply-btn', 'clear-btn'],
      renderTpl,
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    const { $filterInput, $applyBtn, $clearBtn } = this.childs;

    this.filterInput = new Input({
      $el: $filterInput,
      listeners: {
        enterkeydown: this.applyFilterValue.bind(this),
      },
    });

    this.applyBtn = new Button({
      $el: $applyBtn,
      listeners: {
        click: this.applyFilterValue.bind(this),
      },
    });

    this.clearBtn = new Button({
      $el: $clearBtn,
      listeners: {
        click: this.clearFilterValue.bind(this),
      },
    });
  }

  get filterValue() {
    return this.filterInput.value;
  }

  /**
   *
   * @param {String} v
   */
  set filterValue(v) {
    this.filterInput.value = v;
  }

  applyFilterValue() {
    this.tree.filterNodes(this.filterValue);
  }

  clearFilterValue() {
    this.filterValue = '';

    this.applyFilterValue();
  }
}

TreeHeaderFilter.initMixins(['renderable']);

export default TreeHeaderFilter;
