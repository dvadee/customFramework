import Component from '@/core/component';
import Button from '@/core/button/button';
import Input from '@/core/input/input';

const renderTpl = `
    <div class="input-group">
      <input type="text" class="form-control" data-ref="input">
      <div class="input-group-append">
        <button class="btn btn-light" data-ref="apply-btn"><i class="icon-search4"></i></button>
      </div>
      <div class="input-group-append">
        <button class="btn btn-light" data-ref="clear-btn"><i class="icon-x"></i></button>
      </div>
    </div>
`;

/**
 * @class GridSearchWidget
 * @extend Component
 * @prop {Input} input
 * @prop {Button} applyBtn
 * @prop {Button} clearBtn
 */
class GridSearchWidget extends Component {
  constructor(p) {
    GridSearchWidget.mergeConfig(p, {
      cls: 'grid-search-widget',
      childs: [
        {
          reference: 'apply-btn',
          component: Button,
          listeners: {
            click: 'onApply',
          },
        },
        {
          reference: 'clear-btn',
          component: Button,
          listeners: {
            click: 'onClear',
          },
        },
        {
          reference: 'input',
          component: Input,
          disableHelperText: true,
          listeners: {
            changevalue: 'onInputChange',
            enterkeydown: 'onApply',
          },
        },
      ],
      renderTpl,
    });

    super(p);
  }

  get searchValue() {
    return this.input.value;
  }

  set searchValue(v) {
    this.input.value = v;
  }

  onApply() {
    this.trigger('applyclick', this);
  }

  onClear() {
    this.searchValue = '';

    this.trigger('clearclick', this);
  }

  onInputChange() {
    this.trigger('searchstringchange', this, this.searchValue);
  }
}

GridSearchWidget.initMixins(['renderable']);

export default GridSearchWidget;
