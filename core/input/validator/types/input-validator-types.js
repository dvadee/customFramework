import { testString } from '@/core/util/string';
import InputValidatorMessage from '@/core/input/validator/message/input-validator-message';

class InputValidatorTypes {
  static email = {
    fn: (v) => {
      const regExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Zа-яА-Я\-0-9]+\.)+[a-zA-Zа-яА-Я]{2,}))$/;

      return testString(regExp, v);
    },
    errorText: 'Введите корректный e-mail',
  };

  static phone = {
    fn: (v) => {
      // eslint-disable-next-line no-useless-escape
      const regExp = /\+7\s?[\(]{0,1}[0-9]{3}[\)]{0,1}\s?\d{3}[-]{0,1}\d{2}[-]{0,1}\d{2}/;

      return testString(regExp, v);
    },
    errorText: 'Введите корректный телефон',
  };

  static text = {
    fn: (v) => testString(/^[a-zA-Zа-яА-Я ]*$/, v),
    errorText: 'Недопускается ввод только текстовых символов',
  };

  static notEmpty = {
    fn: (v) => !!v,
    errorText: 'Введите значение',
  };

  static getValidateFn(type) {
    const validator = InputValidatorTypes[type];

    if (!validator) {
      throw new Error(`Validator type "${type}" not supported!`);
    }

    const { fn, errorText } = validator;

    return (v) => fn(v) || errorText;
  }

  static getErrorText(type) {
    return InputValidatorTypes[type]?.errorText || '';
  }

  static stringLength(len) {
    return (v) =>
      !v || v.length === len || InputValidatorMessage.stringSize(len);
  }

  static stringMaxLength(len) {
    return (v) =>
      !v || v.length <= len || InputValidatorMessage.stringMaxSize(len);
  }
}

export default InputValidatorTypes;
