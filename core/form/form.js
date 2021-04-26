import { mapKeys, lowerFirst, forIn, mapValues, isEmpty } from 'lodash';
import Component from '@/core/component';
import { initUniform } from '@/base/js/limitlessAppCustom';
import { getFormData } from '../util/form';
import { showSuccess, showWarning } from '../notify/alert';
import keyCode from '@/core/util/key-code';
/**
 * @class Form
 * @extend Component
 * @event saved
 * @prop {Object} modelData
 * @prop {Function} saveProxy
 * @prop {jQuery} $form
 * @prop {Boolean} autoInitFormInputs
 * @prop {String} successMessage
 * @prop {String} invalidFormMessage
 * @prop {Object} mapFormInputs
 * @prop {Button} saveBtn
 * @prop {Boolean} markDirty
 * @prop {Object} inputsDefaults
 **/
class Form extends Component {
  constructor(p) {
    Form.configDefaults(p, {
      showSaveMsg: true,
      autoInitFormInputs: true,
      successMessage: 'Сохранено',
      invalidFormMessage: 'Форма заполнена некорректно!',
      markDirty: false,
      inputsDefaults: {},
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    const { $el } = this;

    this.$form = $el.is('form') ? $el : $el.find('form');

    if (!this.$form.is('form')) {
      throw new Error('Form - form element required!');
    }

    this.initSaveBtn();

    if (this.autoInitFormInputs) {
      this.initFormInputs();
    }

    initUniform();
  }

  initEvents() {
    super.initEvents();

    this.$el.keydown(this.onFormKeyDown.bind(this));
  }

  get form() {
    return this.$form.get(0);
  }

  initSaveBtn() {
    const { $saveBtn } = this.childs;

    if (this.saveBtn) {
      this.saveBtn.on('click', (btn, e) => this.onSaveClick(e));
    } else if ($saveBtn) {
      $saveBtn.click(this.onSaveClick.bind(this));
    }
  }

  onFormKeyDown(e) {
    if (e.keyCode === keyCode.ENTER) {
      e.preventDefault();
      return false;
    }
  }
  /**
   *
   * @param {Event} e
   */
  onSaveClick(e) {
    e.preventDefault();

    this.save();
  }

  initForm() {}

  getSaveParams() {
    return this.getFormInputValues();
  }

  onSave(res, saveParams) {
    if (this.showSaveMsg) {
      showSuccess(this.successMessage);
    }

    this.trigger('saved', this, res, saveParams);
  }

  set loading(loading) {
    this.trigger('loading', this, loading);
  }

  async save() {
    if (!this.saveProxy) {
      throw new Error('ServerFrom - saveProxy required!');
    }

    if (!this.isValid()) {
      showWarning(this.invalidFormMessage);
      return;
    }

    if (this.onBeforeSave() === false) {
      return;
    }

    this.loading = true;

    const saveParams = this.getSaveParams();

    let res;

    try {
      res = await this.saveProxy(saveParams);
    } finally {
      this.loading = false;
    }

    if (res) {
      this.onSave(res, saveParams);

      return true;
    }
  }

  onBeforeSave() {
    return this.trigger('beforesave', this);
  }

  getFormValues() {
    return getFormData(this.$form);
  }

  getFormattedKeyFormValues() {
    const values = this.getFormValues();

    return mapKeys(values, (value, key) => lowerFirst(key));
  }

  initFormInputs() {
    const { childComponents } = this;

    this.formInputs = childComponents.filter((cmp) => cmp.isInputComponent);

    this.mapFormInputs = this.formInputs.reduce((obj, cmp) => {
      if (cmp.name) {
        obj[cmp.name] = cmp;

        cmp.on('change', this.onFormInputChange.bind(this));
      }

      return obj;
    }, {});
  }

  onBeforeComponentAdd(config) {
    config.markDirty = this.markDirty;

    Form.mergeConfig(config, this.inputsDefaults);
  }

  onFormInputChange() {}

  getFormInputs() {
    return this.formInputs || [];
  }

  reset() {
    const inputs = this.getFormInputs();

    inputs.forEach((cmp) => {
      cmp.clearValue && cmp.clearValue();
      cmp.clearValidate && cmp.clearValidate();
    });

    this.form.reset();
  }

  /**
   *
   * @returns {boolean}
   */
  isValid() {
    const inputs = this.getFormInputs();
    let isValid = true;

    inputs.forEach((cmp) => {
      if (!cmp.isValid() && isValid) {
        isValid = false;
      }
    });

    return isValid;
  }

  processLoadData(data) {
    this.setFormData(data);
  }

  setFormData(data) {
    this.setModelData(data);
  }

  getModelData() {
    return this.modelData;
  }

  setModelData(data) {
    this.modelData = data;

    this.initFormInputValues();
  }

  initFormInputValues() {
    this.setFormInputValues(this.modelData);
  }

  get formInputValues() {
    return this.getFormInputValues();
  }

  set formInputValues(values) {
    this.setFormInputValues(values);
  }

  clearFormInputValues() {
    forIn(this.mapFormInputs, (cmp) => {
      cmp.clearValue();

      cmp.clearValidate();

      cmp.resetOriginalValue();
    });
  }

  getFormInputValues() {
    return mapValues(this.mapFormInputs, (cmp) => cmp.getValue());
  }

  setFormInputValues(values) {
    if (isEmpty(values)) {
      return;
    }

    forIn(this.mapFormInputs, (input, name) => {
      const value = values[name];

      if (value !== undefined) {
        input.setValue(value);

        input.clearValidate();

        input.resetOriginalValue();
      }
    });

    this._formInputValues = values;
  }
}

export default Form;
