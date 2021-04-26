import { isDate, isString, isEqual } from 'lodash';
import { parseInputDate } from '@/core/util/date';
import Input from '../input';

class InputDate extends Input {
  constructor(p) {
    InputDate.configDefaults(p, {
      format: 'dd.mm.yyyy',
    });

    InputDate.mergeConfig(p, {
      inputType: 'date',
    });

    super(p);
  }

  clearValue() {
    this.setValue(new Date());
  }

  getValue() {
    return this.dateValue;
  }

  /**
   * @param {Date} date
   */
  setInputElValue(date) {
    if (isString(date)) {
      date = parseInputDate(date);
    }

    if (!isDate(date)) {
      date = new Date();
    }

    this.$el.val(date.toISOString().substring(0, 10));
  }

  get dateValue() {
    const v = this.$el.val();

    return v ? new Date(Date.parse(v)) : new Date();
  }

  set dateValue(v) {
    this.setValue(v);
  }

  publishValueState() {
    super.publishValueState();
  }

  isChangedValue(value) {
    return !isEqual(value, this.getPrevValue());
  }
}

export default InputDate;
