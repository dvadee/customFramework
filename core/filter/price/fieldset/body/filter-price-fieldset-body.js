import FieldsetBody from '@/core/fieldset/body/fieldset-body';
import InputNumber from '@/core/input/number/input-number';

const renderTpl = `
<div>
    <div class="form-group">
        <div class="form-row">
            <div class="col-12 col-xl-6">
                <label for="{{id}}-min-input">от</label>
                <input type="text" class="form-control" id="{{id}}-min-input" min="0" data-ref="min-input">
            </div>
            <div class="col-12 col-xl-6">
                <label for="{{id}}-max-input">до</label>
                <input type="text" class="form-control" id="{{id}}-max-input" min="0" data-ref="max-input">
            </div>
        </div>
    </div>
</div>
`;

/**
 * @class FilterPriceFieldsetBody
 * @extend FieldsetBody
 * @prop {InputNumber} minInput
 * @prop {InputNumber} maxInput
 */
class FilterPriceFieldsetBody extends FieldsetBody {
  constructor(p) {
    FilterPriceFieldsetBody.mergeConfig(p, {
      childs: [
        {
          reference: 'min-input',
          component: InputNumber,
          listeners: {
            changevalue: 'onPriceMinMaxChange',
          },
        },
        {
          reference: 'max-input',
          component: InputNumber,
          listeners: {
            changevalue: 'onPriceMinMaxChange',
          },
        },
      ],
      renderTpl,
    });

    super(p);
  }

  get priceMin() {
    return this.minInput.value;
  }

  set priceMin(value) {
    this.minInput.value = value;
  }

  get priceMax() {
    return this.maxInput.value;
  }

  set priceMax(value) {
    this.maxInput.value = value;
  }

  onPriceMinMaxChange() {
    this.fieldset.onFilterChange();
  }
}

export default FilterPriceFieldsetBody;
