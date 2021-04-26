import {
  chain,
  includes,
  toLower,
  size,
  isString,
  toString,
  isNaN,
} from 'lodash';
import Input from '../input';
import './input-select.scss';

const renderTpl = /*html*/ `
  <select class="form-control"></select>
`;

/**
 * @class InputSelect
 * @extend Input
 * @prop {String} displayField
 * @prop {String} valueField
 * @prop prevValue
 * @prop numberValue - getValue возвращает число, если не число, то null
 * @event selectchange
 * @event changevalue
 */
class InputSelect extends Input {
  static renderHtml = '<select></select>';

  constructor(p) {
    InputSelect.configDefaults(p, {
      options: null,
      displayField: 'text',
      valueField: 'value',
      numberValue: false,
    });

    InputSelect.mergeConfig(p, {
      props: {
        optionItems: undefined,
      },
      renderTpl,
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    this.addCls('form-control-select');

    this.isMultiple = this.$el.prop('multiple');

    this.initOptions();

    if (this.addEmptyOption) {
      this.prependEmptyOption();
    }
  }

  applyOptionItems(options) {
    if (!options) {
      options = [];
    }

    return options;
  }

  updateOptionItems(options) {
    this.setOptions(options);
  }

  initOptions() {
    const { $el, options } = this;

    const initFromDOM = options === null;

    if (initFromDOM) {
      const domOptions = $el.get(0).options || [];

      this.options = Array.from(domOptions).map(({ text, value }) => ({
        text,
        value,
      }));
    } else {
      this.fillOptions();
    }
  }

  fillOptions(options) {
    const { $el, displayField, valueField } = this;

    if (!options) {
      options = this.options;
    }

    const optionsHtml = options.map((opt) => {
      const text = opt[displayField];
      const value = opt[valueField];

      return `<option value="${value}">${text}</option>`;
    });

    $el.html(optionsHtml);
  }

  createEmptyOption() {
    const {
      emptyOptionText = 'Выберите значение',
      emptyOptionValue = '-1',
      emptyOptionDisabled = true,
    } = this;

    const option = new Option(emptyOptionText, emptyOptionValue, true, true);

    if (emptyOptionDisabled) {
      option.disabled = true;
    }

    return option;
  }

  prependEmptyOption() {
    const option = this.createEmptyOption();
    const { $el, value } = this;

    $el.prepend(option);

    if (!value) {
      this.selectByIndex(0, true);
    }
  }

  loadRawData(options) {
    this.setOptions(options);
  }

  getOptions() {
    return this.options;
  }
  /**
   * set select options
   * @param {Array} options
   * @param {Boolean} silent
   */
  setOptions(options, silent = false) {
    this.options = options;

    this.fillOptions();

    if (this.addEmptyOption) {
      this.prependEmptyOption();
    }

    if (!this.isMultiple && !silent) {
      this.triggerSilentChange();
    }

    this.resetOriginalValue();
  }

  filterOptions(value) {
    value = chain(value).trim().toLower().value();

    let filteredOptions = this.options;

    if (value) {
      filteredOptions = filteredOptions.filter(({ text }) =>
        includes(toLower(text), value)
      );
    }

    this.fillOptions(filteredOptions);
  }

  triggerSilentChange() {
    this.suspendEvents();

    this.triggerChange();

    this.resumeEvents();
  }

  triggerChange() {
    this.$el.trigger('change');
  }

  onChange() {
    this.trigger(
      'selectchange',
      this,
      this.value,
      this.selectedIndex,
      this.rawValue,
      this.prevValue
    );

    super.onChange();
  }

  onFocus() {
    super.onFocus.apply(this, arguments);

    this.prevValue = this.value;
  }

  get $selectedOption() {
    return this.$el.find('option:selected');
  }

  getValue() {
    let value = super.getValue() || this.$el.prop('value');

    if (this.numberValue) {
      let numValue = +value;

      value = isNaN(numValue) ? null : numValue;
    }

    return value;
  }

  setValue(value) {
    if (value === null) {
      value = 'null';
    } else if (!isString(value)) {
      value = toString(value);
    }

    super.setValue(value);
  }

  get rawValue() {
    let value;

    const { $selectedOption } = this;

    if (this.isMultiple) {
      value = Array.from($selectedOption).map((item) => item.text);
    } else {
      value = $selectedOption.text();
    }

    return value;
  }

  get selectedIndex() {
    return this.$el.prop('selectedIndex');
  }

  set selectedIndex(idx) {
    this.$el.prop('selectedIndex', idx);
  }

  clearValue() {
    this.clear();
  }

  clear() {
    const { $el } = this;

    if (this.isMultiple) {
      $el.find('option:selected').prop('selected', false);
    } else {
      $el.prop('selectedIndex', 0);
    }

    $el.trigger('change');
  }

  selectByIndex(idx = 0, silent = false) {
    this.selectedIndex = idx;

    if (silent) {
      this.triggerSilentChange();
    } else {
      this.triggerChange();
    }
  }

  get optionsCount() {
    return size(this.options);
  }

  processLoadData(data) {
    this.setOptions(data || []);
  }

  isEmptyValue() {
    return this.addEmptyOption && this.getValue() == this.emptyOptionValue;
  }
}

export default InputSelect;
