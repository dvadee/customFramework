import Form from '@/core/form/form';
import Input from '@/core/input/input';
import InputValidatorTypes from '@/core/input/validator/types/input-validator-types';
import api from '../../service/color-service';

const renderTpl = `
<form>
    <div class="form-group row">
        <label data-ref="name-label" class="col-form-label col-12 col-xl-4">Название</label>
        <div class="col-12 col-xl-8">
            <input data-ref="name-input" class="form-control" />
        </div>
    </div>
    <div class="form-group row">
        <label data-ref="alternative-name-label" class="col-form-label col-12 col-xl-4">Альтернативное название</label>
        <div class="col-12 col-xl-8">
            <input data-ref="alternative-name-input" class="form-control" />
        </div>
    </div>
</form>
`;

/**
 * @class ColorEditForm
 * @extend Form
 * @prop {Input} nameInput
 * @prop {Input} alternativeNameInput
 */
class ColorEditForm extends Form {
  constructor(p) {
    ColorEditForm.configDefaults(p, {
      loadProxy: api.fetchColor,
      saveProxy: api.saveColor,
    });

    ColorEditForm.mergeConfig(p, {
      childs: [
        {
          reference: 'name-input',
          component: Input,
          allowEmpty: false,
          validator: InputValidatorTypes.stringMaxLength(50),
        },
        {
          reference: 'alternative-name-input',
          component: Input,
          validator: InputValidatorTypes.stringMaxLength(50),
        },
      ],
      renderTpl,
    });

    super(p);
  }

  get colorId() {
    return this.modelData?.colorId || 0;
  }

  getSaveParams() {
    return {
      colorId: this.colorId,
      name: this.nameInput.value,
      alternativeName: this.alternativeNameInput.value,
    };
  }
}

ColorEditForm.initMixins(['renderable']);

export default ColorEditForm;
