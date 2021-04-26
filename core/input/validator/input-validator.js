import { isString } from 'lodash';
import { emptyFn, returnTrue } from '../../util/function';
import InputValidatorTypes from './types/input-validator-types';
import InputValidatorMessage from '@/core/input/validator/message/input-validator-message';

class InputValidator {
  /**
   * @param {Object} p
   * @param {Input} p.cmp
   * @param {Function|String} p.validateFn
   * @param {String} p.successCls
   * @param {String} p.errorCls
   * @param {Function} p.onSuccess
   * @param {Function} p.onError
   */
  constructor({ cmp, validateFn, onSuccess = emptyFn, onError = emptyFn }) {
    this.cmp = cmp;

    if (isString(validateFn)) {
      validateFn = InputValidatorTypes.getValidateFn(validateFn);
    }

    if (!validateFn) {
      validateFn = returnTrue;
    }

    this.validator = validateFn;
    this.onSuccess = onSuccess;
    this.onError = onError;
  }

  get value() {
    return this.cmp.value;
  }

  get validation() {
    const { validator, value } = this;
    let isValid = true;
    let validation = '';

    if (!this.cmp.allowEmpty && this.cmp.isEmptyValue()) {
      isValid = false;
      validation = InputValidatorMessage.required;
    }

    if (isValid) {
      validation = validator(value);
      isValid = validation === true;
    }

    return { isValid, validation: isValid ? '' : validation };
  }

  validate(silent = false) {
    const { isValid, validation } = this.validation;

    if (!silent) {
      if (isValid) {
        this.onSuccess();
      } else {
        this.onError(validation);
      }
    }

    return isValid;
  }
}

export default InputValidator;
