import FormFieldBase from '@/core/form/field/base/form-field-base';
import Input from '@/core/input/input';

/**
 * @class FormFieldText
 * @extends {FormFieldBase}
 */
class FormFieldText extends FormFieldBase {
  createInput() {
    return new Input(this.getInputConfig());
  }
}

export default FormFieldText;
