import Input from '../../input';
import InputRadio from '../input-radio';

/**
 * @class InputRadioGroup
 * @extend Input
 */
class InputRadioGroup extends Input {
  constructor(p) {
    Object.assign(p, {
      baseCls: 'radio-group',
    });

    super(p);
  }

  initComponent() {
    const radios = [];
    const inputs = this.$el.find('input[type=radio]').toArray();

    inputs.forEach((input) => {
      const radioInput = new InputRadio({
        $el: $(input),
        listeners: {
          change: this.onChange.bind(this),
        },
      });

      radios.push(radioInput);
    });

    this.inputs = radios;
  }

  get value() {
    const checked = this.inputs.find(({ checked }) => checked);
    return checked ? checked.inputValue : null;
  }

  set value(value) {
    const radio = this.inputs.find(({ inputValue }) => inputValue === value);

    if (radio) {
      radio.checked = true;
    }
  }
}

export default InputRadioGroup;
