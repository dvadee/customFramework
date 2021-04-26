import FormFieldText from '@/core/form/field/text/form-field-text';
import InputNumber from '@/core/input/number/input-number';

/**
 * @class FormFieldNumber
 * @extend FormFieldText
 */
class FormFieldNumber extends FormFieldText {
  createInput() {
    return new InputNumber(this.getInputConfig());
  }
}

export default FormFieldNumber;
