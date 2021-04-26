import FieldsetBody from '@/core/fieldset/body/fieldset-body';
import Input from '@/core/input/input';
import InputSelect from '@/core/input/select/input-select';
import Button from '@/core/button/button';
import renderTpl from './filter-brands-fieldset-body.pug';

/**
 * @class FilterBrandsFieldsetBody,
 * @extend FieldsetBody
 * @prop {Input} selectFilterInput
 * @prop {InputSelect} brandsSelect
 * @prop {Button} resetBtn
 */
class FilterBrandsFieldsetBody extends FieldsetBody {
  /**
   * @param p
   * @param p.brandsLoadProxy
   */
  constructor(p) {
    FilterBrandsFieldsetBody.mergeConfig(p, {
      scopedChildsReferences: true,
      childs: [
        {
          reference: 'select-filter-input',
          placeholder: 'Фильтр брендов',
          component: Input,
          listeners: {
            changevalue: 'onBrandsSelectFilterChange',
          },
        },
        {
          reference: 'brands-select',
          component: InputSelect,
          listeners: {
            changevalue: 'onBrandsSelectChange',
          },
        },
        {
          reference: 'reset-btn',
          component: Button,
          text: 'Сбросить бренды',
          listeners: {
            click: 'onResetBtnClick',
          },
        },
      ],
      renderTpl,
    });
    super(p);
  }

  initComponent() {
    super.initComponent();
  }

  onBrandsSelectFilterChange(input, value) {
    this.brandsSelect.filterOptions(value);
  }

  onResetBtnClick() {
    this.brandsSelect.clearValue();
  }

  onBrandsSelectChange() {
    this.fieldset.onFilterChange();
  }
}

export default FilterBrandsFieldsetBody;
