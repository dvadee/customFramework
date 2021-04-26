import { toNumber } from 'lodash';
import Input from '../input';

class InputNumber extends Input {
  constructor(p) {
    InputNumber.mergeConfig(p, {
      inputType: 'number',
    });

    super(p);
  }

  getValue() {
    return toNumber(super.getValue()) || 0;
  }
}

export default InputNumber;
