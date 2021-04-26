import Input from '@/core/input/input';

class InputPassword extends Input {
  constructor(p) {
    InputPassword.mergeConfig(p, {
      inputType: 'password',
    });

    super(p);
  }
}

export default InputPassword;
