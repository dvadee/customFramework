import FormFieldBase from '@/core/form/field/base/form-field-base';
import InputSelect from '@/core/input/select/input-select';

const inputTpl = `
  <select data-ref="input-el"></select>
`;

/**
 * @class FormFieldSelect
 * @extend FormFieldBase
 * @prop {InputSelect} input
 *
 * Options в конструктор передавать через renderConfig
 */
class FormFieldSelect extends FormFieldBase {
  constructor(p) {
    FormFieldSelect.configDefaults(p, {
      inputTpl,
    });

    super(p);
  }

  getInputConfig() {
    const { renderConfig } = this;
    const config = super.getInputConfig();

    config.options = renderConfig.options || [];

    delete renderConfig.options;

    return config;
  }

  initComponent() {
    super.initComponent();

    delete this.renderConfig.options;
  }

  createInput() {
    return new InputSelect(this.getInputConfig());
  }

  get options() {
    return this.input ? this.input.getOptions() : [];
  }

  set options(opts) {
    if (this.input) {
      this.input.setOptions(opts);
    }
  }
}

export default FormFieldSelect;
