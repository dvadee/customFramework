import AutoNumeric from 'autonumeric';
import Input from '@/core/input/input';

class InputCurrency extends Input {
  constructor(p) {
    InputCurrency.configDefaults(p, {
      autoNumericConfig: {},
      currencySymbol: '',
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    this.autoNumeric = new AutoNumeric(this.domEl, this.autoNumericConfig);
  }

  initPluginConfig() {
    const { predefinedOptions, options } = AutoNumeric;
    const { currencySymbol, autoNumericConfig } = this;

    this.autoNumericConfig = {
      ...predefinedOptions.euroSpace,
      currencySymbolPlacement: options.currencySymbolPlacement.suffix,
      currencySymbol,
      ...autoNumericConfig,
    };
  }

  onInput() {}

  // eslint-disable-next-line no-unused-vars
  setInputElValue(value) {
    this.autoNumeric.set(value || 0);
  }

  getValue() {
    return this.autoNumeric?.getNumber() || 0;
  }
}

export default InputCurrency;
