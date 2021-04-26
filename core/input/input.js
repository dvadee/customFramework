import Component from '../component';
import InputValidator from './validator/input-validator';
import InputLabel from '@/core/input/label/input-label';
import keyCode from '../util/key-code';
import { setElDisabled, isDisabledEl } from '../util/dom';
import './input.scss';

/**
 * @class Input
 * @extend Component
 * @event changevalue
 * @event enterkeydown
 * @event focus
 * @event blur
 * @prop {String} inputType
 * @prop {String} name
 * @prop {Function|String} validator
 * @prop {Boolean} validateOnInit
 * @prop {Boolean} validateOnChange
 * @prop {Object[]|String[]} appendItems
 * @prop {Boolean} setValueOnEnter
 * @prop {String} validCls
 * @prop {String} invalidCls
 * @prop {Boolean} readOnly
 * @prop {Boolean} allowEmpty
 * @prop {Boolean} renderWrapper=true
 * @prop {String} dirtyCls
 * @prop {Boolean} markDirty
 */
class Input extends Component {
  static renderHtml = '<input>';

  _value = undefined;

  elChangeEventSuspended = false;

  isInputComponent = true;

  constructor(p) {
    const hasValidator = !!p.validator;

    Input.configDefaults(p, {
      baseCls: 'form-control',
      validateOnChange: hasValidator,
      validateOnInit: false,
      renderWrapper: true,
      allowEmpty: true,
      setValueOnEnter: hasValidator,
      childs: ['helper-text-el'],
      validCls: 'border-success',
      invalidCls: 'border-danger',
      dirtyCls: 'form-control--dirty',
      markDirty: false,
      elementEvents: [
        'click',
        'focus',
        'blur',
        'mousedown',
        'keydown',
        'keyup',
        'change',
      ],
    });

    if (p.value !== undefined && p.$el) {
      p.$el.val(p.value);

      delete p.value;
    }

    super(p);
  }

  initComponent() {
    super.initComponent();

    const { inputType, name, $el } = this;

    this.originalValue = this.getValue();

    if (!$el.attr('id')) {
      $el.attr('id', this.id);
    }

    if (inputType) {
      $el.prop('type', inputType);
    }

    if (name) {
      $el.prop('name', name);
    }

    if (!this.allowEmpty) {
      $el.prop('required', true);
      this.validator = this.validator || 'notEmpty';
    }

    this.inputValidator = new InputValidator({
      validateFn: this.validator,
      cmp: this,
      onSuccess: this.markValid.bind(this),
      onError: this.markInvalid.bind(this),
    });

    if (this.renderWrapper) {
      this.initWrapper();
    }

    this.initHelperTextEl();

    this.initLabel();

    if (this.validateOnInit) {
      this.validate();
    }
  }

  initLabel() {
    const { labelConfig, parentCmp } = this;

    if (!labelConfig || !parentCmp) {
      return;
    }

    const { child, $child } = parentCmp.findChildEl(labelConfig.reference);

    if (child) {
      const config = Object.assign({}, labelConfig, {
        input: this,
        $el: $child,
      });

      this.label = new InputLabel(config);
    }
  }

  initWrapper() {
    const { $el } = this;
    const $wrapper = $('<div></div>');

    $wrapper.insertAfter($el);
    $el.appendTo($wrapper);
    $wrapper.addClass('form-control-wrapper');

    this.$wrapper = $wrapper;
  }

  initHelperTextEl() {
    const { $wrapper = this.$el, disableHelperText } = this;
    const $parent = $wrapper.parent();

    if (disableHelperText) {
      // заглушка
      this.$helperTextEl = $();
      return;
    }

    const $helperEl = $(`
      <div class="form-text" data-ref="helper-text-el"></div>
    `);

    if ($parent.is('.input-group')) {
      $helperEl.insertAfter($wrapper);
      $helperEl.addClass('w-100');
    } else {
      $helperEl.appendTo($parent);
    }

    $helperEl.hide();

    this.$helperTextEl = $helperEl;
  }

  initEvents() {
    super.initEvents();

    this.$el.on({
      change: this.onChange.bind(this),
      keydown: this.onKeyDown.bind(this),
      keyup: this.onKeyUp.bind(this),
      input: this.onInput.bind(this),
      focus: this.onFocus.bind(this),
    });
  }

  onInput() {}

  onKeyDown(e) {
    if (e.which === keyCode.ENTER) {
      if (this.setValueOnEnter) {
        this.$el.blur();
      }

      this.trigger('enterkeydown', this);
    }
  }

  onKeyUp() {}

  onChange() {
    if (!this.elChangeEventSuspended) {
      this.publishValueState();
    }
  }

  onChangeValue() {
    this.publishValueState();

    this.trigger('changevalue', this, this.value);

    this.checkIsDirty();

    if (this.validateOnChange) {
      this.validate();
    }
  }

  publishValueState() {
    this.publishState('value', this.value);
  }

  onFocus() {}

  validate() {
    const { inputValidator } = this;
    let valid = true;

    if (inputValidator) {
      valid = inputValidator.validate();
    }

    return valid;
  }

  markValid() {
    this.clearInvalid();

    this.addCls(this.validCls);
  }

  clearValid() {
    this.removeCls(this.validCls);
  }

  markInvalid(validation) {
    this.clearValid();

    this.addCls(this.invalidCls);

    if (validation !== false) {
      const { $helperTextEl } = this;

      $helperTextEl.show();
      $helperTextEl.text(validation);
      $helperTextEl.addClass('text-danger');
    }
  }

  clearInvalid() {
    const { $helperTextEl } = this;

    this.removeCls(this.invalidCls);

    $helperTextEl.hide();
    $helperTextEl.text('');
    $helperTextEl.removeClass('text-danger');
  }

  clearValidate() {
    this.clearValid();
    this.clearInvalid();
  }

  isValid() {
    const { inputValidator } = this;

    return inputValidator ? inputValidator.validate() : true;
  }

  silentClearValue() {
    this.suspendEvents();
    this.clearValue();
    this.resumeEvents();
  }

  clearValue() {
    this.value = '';
  }

  get elementId() {
    return this.getElAttr('id');
  }

  get readOnly() {
    return this.$el?.attr('readonly');
  }

  set readOnly(readOnly) {
    this.setProp('readOnly', readOnly);
  }

  setReadOnly(readOnly) {
    this.$el.attr('readonly', readOnly);
  }

  get placeholder() {
    return this.$el?.prop('placeholder');
  }

  set placeholder(placeholder) {
    if (this.ready) {
      this.$el.prop('placeholder', placeholder);
    } else {
      this.renderConfig.placeholder = placeholder;
    }
  }

  get disabled() {
    return isDisabledEl(this.$el);
  }

  /**
   * @param {Boolean} disabled
   */
  set disabled(disabled) {
    setElDisabled(this.$el, disabled);
  }

  get value() {
    return this.getValue();
  }

  /**
   * @param {String|Number} value
   */
  set value(value) {
    this.setValue(value);
  }

  getValue() {
    return this.domEl.value;
  }

  setValue(value) {
    if (this.destroyed) {
      return;
    }

    if (!this.ready) {
      this.renderConfig.value = value;

      return;
    }

    if (this.isChangedValue(value)) {
      this.setInputElValue(value);

      this.setPrevValue(value);

      this.onChangeValue();
    }
  }

  get inputValue() {
    return this.getInputElValue();
  }
  /**
   * @private
   * @param value
   */
  set inputValue(value) {
    this.setProp('inputElValue', value);
  }

  getInputElValue() {
    return this.$el.val();
  }
  /**
   * @private
   * @param value
   */
  setInputElValue(value) {
    this.elChangeEventSuspended = true;
    this.$el.val(value);
    this.elChangeEventSuspended = false;
  }

  set loading(v) {
    this.disabled = v;
  }

  focus() {
    this.$el.focus();
  }

  resetOriginalValue() {
    this.originalValue = this.getValue();

    this.checkIsDirty();
  }

  checkIsDirty() {
    this.isDirty = this.originalValue != this.getValue();

    if (this.markDirty) {
      this.toggleCls(this.dirtyCls, this.isDirty);
    }
  }

  isEmptyValue() {
    return this.value === '';
  }

  isChangedValue(newVal) {
    return newVal !== this.getPrevValue();
  }

  getPrevValue() {
    return this._value;
  }

  setPrevValue(value) {
    this._value = value;
  }
}

export default Input;
