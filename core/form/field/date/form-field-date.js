import FormFieldText from '@/core/form/field/text/form-field-text';
import InputDate from '@/core/input/date/input-date';

class FormFieldDate extends FormFieldText {
  createInput() {
    return new InputDate(this.getInputConfig());
  }
}

export default FormFieldDate;
