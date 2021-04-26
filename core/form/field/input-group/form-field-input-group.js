import FormFieldBase from '@/core/form/field/base/form-field-base';
import InputGroup from '@/core/input/group/input-group';

class FormFieldInputGroup extends FormFieldBase {
  constructor(p) {
    FormFieldInputGroup.mergeConfig(p, {
      inputTpl: InputGroup.renderHtml,
    });

    super(p);
  }

  createInput() {
    return new InputGroup(this.getInputConfig());
  }
}

export default FormFieldInputGroup;
