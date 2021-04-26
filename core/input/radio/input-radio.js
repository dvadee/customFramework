import InputCheck from '@/core/input/check/input-check';

class InputRadio extends InputCheck {
  constructor(p) {
    InputRadio.mergeConfig(p, {
      inputType: 'radio',
    });

    super(p);
  }
}

export default InputRadio;
