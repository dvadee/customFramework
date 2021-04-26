import { merge, head, get, template, isEqual } from 'lodash';
import 'select2/dist/js/select2.full.js';
import Component from '../component';
import Sorter from '../util/sorter';
import InputValidator from '../input/validator/input-validator';
import Select from '../input/select/input-select';

// const SELECT2_EVENTS = [
//   { select2Event: 'select2:selecting', cmpEvent: 'beforeselect' },
//   { select2Event: 'select2:select', cmpEvent: 'select' },
//   { select2Event: 'select2:open', cmpEvent: 'open' },
//   { select2Event: 'select2:opening', cmpEvent: 'beforeopen' },
//   { select2Event: 'select2:close', cmpEvent: 'close' },
//   { select2Event: 'select2:closing', cmpEvent: 'beforeclose' },
//   { select2Event: 'select2:clear', cmpEvent: 'clear' },
//   { select2Event: 'select2:clearing', cmpEvent: 'beforeclear' },
// ];

class Select2 extends Component {
  elementDataKey = '_data';
  /**
   * @event change
   *
   * @param {Object} p
   * @param {String} p.value
   * @param {String} p.rowTpl
   * @param {Function} p.loadProxy
   * @param {String} p.textField
   * @param {String} p.valueField
   * @param {Object} p.sorter
   * @param {Function} p.validator
   * @param {Boolean} p.validateOnChange
   * @param {Boolean} p.validateOnInit
   * @param {Boolean} p.addEmptyOption
   * @param {Boolean} p.searchBoxDisabled
   * @param {Boolean} p.multipleSelect
   * @param {String} p.placeholder
   */

  constructor(p) {
    Select2.configDefaults(p, {
      validateOnChange: false,
      validateOnInit: false,
      searchBoxDisabled: false,
      multipleSelect: false,
    });

    Select2.mergeConfig(p, {
      props: {
        optionItems: undefined,
      },
    });

    super(p);
  }

  get isMultiple() {
    return this.select2Config.multiple;
  }

  initComponent() {
    super.initComponent();

    const { sorter, $el } = this;

    if (sorter) {
      this.hasSorter = true;
      this.sorter = new Sorter(sorter);
    }

    /**
     * TODO
     * Sort options on init
     */
    $el.select2(this.select2Config);

    $el.on({
      change: this.onChangeValue.bind(this),
    });

    this.$select2container = $el.next('.select2');

    this.$select2container.addClass('component');

    this.$select2selection = this.$select2container.find('.select2-selection');

    if (!this.isMultiple) {
      this.$select2selection.addClass('form-control');
    }

    this.storeOptions();

    this.inputValidator = new InputValidator({
      validateFn: this.validator,
      onSuccess: this.markValid.bind(this),
      onError: this.markInvalid.bind(this),
      cmp: this,
    });

    if (this.addEmptyOption) {
      this.prependEmptyOption();
    }

    if (this.validateOnInit) {
      this.validate();
    }
  }

  initPluginConfig() {
    super.initPluginConfig();

    const { config = {}, rowTpl, placeholder } = this;

    const select2Config = {
      width: '100%',
    };

    if (this.multipleSelect) {
      select2Config.multiple = true;
    }

    if (placeholder) {
      select2Config.placeholder = placeholder;
    }

    merge(select2Config, config);

    if (rowTpl) {
      this.rowTpl = template(rowTpl);
      select2Config.templateResult = this.renderRow.bind(this);
    }

    if (this.searchBoxDisabled) {
      select2Config.minimumResultsForSearch = Infinity;
    }

    this.select2Config = select2Config;
  }

  initEvents() {
    super.initEvents();

    this.$el.on({
      'select2:selecting': this.onBeforeSelectItem.bind(this),
      'select2:select': this.onSelectItem.bind(this),
    });
  }

  onBeforeSelectItem(e) {
    const data = this.getItemDataFromSelect2Option(e.params.args.data);

    if (this.trigger('beforeselectitem', this, data, e) === false) {
      e.preventDefault();

      this.closeDropdownMenu();

      return false;
    }
  }

  onSelectItem(e) {
    this.trigger('selectitem', this, e);
  }

  renderRow({ element, text }) {
    // disabled id selected text title
    if (element) {
      return $(this.rowTpl(element._data));
    } else {
      return $(`<div>${text}</div>`);
    }
  }

  markValid() {
    this.clearInvalid();

    this.$select2selection.addClass('border-success');
  }

  markInvalid() {
    this.clearValid();

    this.$select2selection.addClass('border-danger');
  }

  clearValid() {
    this.$select2selection.removeClass('border-success');
  }

  clearInvalid() {
    this.$select2selection.removeClass('border-danger');
  }

  isValid() {
    return Select.prototype.isValid.call(this);
  }

  validate() {
    return Select.prototype.validate.call(this);
  }

  triggerSilentChange() {
    Select.prototype.triggerSilentChange.call(this);
  }

  triggerChange() {
    Select.prototype.triggerChange.call(this);
  }

  selectFirst() {
    const opt = head(this.options);

    if (opt) {
      this.setSelection(opt.value || opt.text);
    }
  }

  deselect() {
    this.setSelection(null);
  }

  get value() {
    return this.getValue();
  }

  set value(v) {
    this.setValue(v);
  }

  getValue() {
    return this.getSelectionValue();
  }

  setValue(v) {
    Select.prototype.setValue.call(this, v);
  }

  setInputElValue(v) {
    Select.prototype.setInputElValue.call(this, v);

    this.$el.trigger('change.select2');
  }

  isChangedValue(v) {
    Select.prototype.isChangedValue.call(this, v);
  }

  isEmptyValue(v) {
    return Select.prototype.isEmptyValue.call(this, v);
  }

  getPrevValue() {
    return this._value;
  }

  setPrevValue(value) {
    this._value = value;
  }

  get selection() {
    return this.getSelection();
  }

  set selection(selection) {
    this.setSelection(selection);
  }

  get selected() {
    return this.getSelectionData();
  }

  set selected(selected) {
    /**
     * TODO
     */

    const value = selected ? selected[this.valueField] : null;

    this.setSelection(value);
  }

  getSelectionValue(selection) {
    if (!selection) {
      selection = this.getSelection();
    }

    const getValue = (opt) => get(opt, 'id', null);
    let value;

    if (this.isMultiple) {
      value = selection.map(getValue);
    } else {
      value = getValue(selection);
    }

    return value;
  }

  getSelectionData(selection) {
    if (!selection) {
      selection = this.getSelection();
    }

    const getData = (opt) => this.getItemDataFromSelect2Option(opt);

    let data;

    if (this.isMultiple) {
      data = selection.map(getData);
    } else {
      data = getData(selection);
    }

    return data;
  }

  getSelection() {
    const value = this.$el.select2('data');

    return this.isMultiple ? value : head(value);
  }

  setSelection(selection = null) {
    const { $el } = this;

    $el.val(selection);

    this.triggerSilentChange();
  }

  onChangeValue() {
    const { prevSelectionValue } = this;
    const selection = this.getSelection();
    const value = this.getSelectionValue(selection);

    if (
      prevSelectionValue !== undefined &&
      isEqual(prevSelectionValue, value)
    ) {
      return;
    }

    const data = this.getSelectionData(selection);

    this.prevSelectionValue = value;

    if (this.validateOnChange) {
      this.validate();
    }

    this.publishState('selected', data);
    this.publishState('value', value);

    this.trigger('change', this, selection, value, data);
  }

  clearPrevSelectedValue() {
    this.prevSelectionValue = null;
  }

  processLoadData(data) {
    this.setOptions(data || []);
  }

  /**
   *
   * @param {Array} data
   * @param {Boolean} silent
   */
  loadOptions(data = [], silent = false) {
    const {
      textField = 'text',
      valueField = 'value',
      hasSorter = false,
      sorter,
    } = this;

    if (hasSorter) {
      data = sorter.sort(data);
    }

    const options = data.map((data) => {
      const text = data[textField];
      const value = data[valueField];

      const opt = new Option(text, value, false, false);

      opt[this.elementDataKey] = data;

      return opt;
    });

    this.data = data;

    if (this.addEmptyOption) {
      const emptyOption = this.createEmptyOption();

      options.unshift(emptyOption);
    }

    const { $el } = this;

    $el.append(options);

    this.storeOptions();

    this.restorePrevValue();

    if (!silent) {
      $el.trigger('change');
    }
  }

  restorePrevValue() {
    const { prevSelectionValue } = this;

    if (!prevSelectionValue) {
      return;
    }

    const hasPrevValue = this.options.some(
      (opt) => opt.value === prevSelectionValue
    );

    if (hasPrevValue) {
      this.$el.val(prevSelectionValue);
    }
  }

  forceValueChange(value) {
    if (value !== this.value) {
      this.setValue(value);
    } else {
      this.clearPrevSelectedValue();

      this.onChangeValue();
    }
  }

  initDummyOption() {
    const option = new Option('', null);

    this.$el.append(option);
  }

  createEmptyOption() {
    return Select.prototype.createEmptyOption.call(this);
  }

  prependEmptyOption() {
    Select.prototype.prependEmptyOption.call(this);
  }

  clear() {
    this.clearOptions();
  }

  clearOptions() {
    this.$el.children().remove();

    this.data = [];

    this.storeOptions();
  }

  storeOptions() {
    this.options = this.$el
      .children()
      .toArray()
      .map(({ label, value }) => ({ text: label, value }));
  }

  setOptions(options, silent) {
    this.clearOptions();

    this.loadOptions(options, silent);
  }

  selectByIndex(idx) {
    this.$el.prop('selectedIndex', idx).trigger('change.select2');
  }

  applyOptionItems(options) {
    return Select.prototype.applyOptionItems.call(this, options);
  }

  updateOptionItems(options) {
    return Select.prototype.updateOptionItems.call(this, options);
  }

  getItemDataFromSelect2Option(option) {
    return get(option, ['element', this.elementDataKey], {});
  }

  closeDropdownMenu() {
    this.executeSelect2Method('close');
  }

  openDropdownMenu() {
    this.executeSelect2Method('open');
  }

  executeSelect2Method(methodName) {
    this.$el.select2(methodName);
  }

  updateDisabled(disabled) {
    super.updateDisabled(disabled);

    this.$select2container?.toggleClass(this.disabledCls, disabled);
  }
}

export default Select2;
