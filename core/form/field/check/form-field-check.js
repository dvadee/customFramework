import FormFieldBase from '@/core/form/field/base/form-field-base';
import InputCheck from '@/core/input/check/input-check';

/**
 * @class FormFieldCheck
 * @extend FormFieldBase
 * @prop {InputCheck} input
 */
class FormFieldCheck extends FormFieldBase {
  createInput() {
    return new InputCheck(this.getInputConfig());
  }

  initComponent() {
    super.initComponent();

    this.childs.$inputCt.addClass(['d-flex', 'align-items-center']);
  }

  get value() {
    return this.input.checked;
  }

  set value(v) {
    this.input.checked = v;
  }
}

export default FormFieldCheck;
