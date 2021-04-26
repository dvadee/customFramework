import { trim } from 'lodash';
import Component from '@/core/component';
import Input from '@/core/input/input';
import { batchCreateGetterSetterAlias, alias } from '@/core/util/function';
const renderTpl = `
  <td class="grid-filter p-2">
    <div class="grid-filter__wrapper">
      <input class="grid-filter__input" data-ref="input"/>
      <button class="btn btn-link p-0 text-danger btn-sm bg-transparent grid-filter__clear-btn" data-ref="clear-btn"><i class="icon-cross2"></i></button>
    </div>
  </td>
`;

/**
 * @class GridFilterWidget
 * @extends Component
 * @prop {Input} input
 * @prop dtColumn
 * @prop {Boolean} isEmptyFilter
 */
class GridFilterWidget extends Component {
  constructor(p) {
    const { dtColumn } = p;

    GridFilterWidget.mergeConfig(p, {
      childs: [
        {
          reference: 'input',
          component: Input,
          setValueOnEnter: true,
          validator: 'notEmpty',
          validCls: 'bg-success-300',
          invalidCls: '',
          cls: 'form-control form-control-sm rounded-pill',
          placeholder: trim($(dtColumn.header()).text()),
          disableHelperText: true,
          listeners: {
            changevalue: 'onInputValueChange',
            click: 'onInputClick',
          },
        },
        'clear-btn',
      ],
      renderTpl,
    });

    super(p);
  }

  get dataSrc() {
    return this.dtColumn.dataSrc();
  }

  initComponent() {
    super.initComponent();

    const { input } = this;
    const { $clearBtn } = this.childs;

    batchCreateGetterSetterAlias({
      obj: this,
      targetObj: input,
      props: ['value'],
    });

    this.clear = alias(input, 'clearValue');
    this.silentClearValue = alias(input, 'silentClearValue');

    $clearBtn.click(this.onClearBtnClick.bind(this));

    if (this.isEmptyFilter) {
      $clearBtn.hide();
      input.visible = false;
    }
  }

  silentClearValue() {
    this.input.silentClearValue();
  }

  onClearBtnClick() {
    this.input.clearValue();
  }

  onInputValueChange() {
    this.trigger('change', this, this.input.value);
  }

  onInputClick(input, e) {
    e.stopPropagation();
  }
}

GridFilterWidget.initMixins(['renderable']);

export default GridFilterWidget;
