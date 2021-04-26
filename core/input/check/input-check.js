import Input from '../input';

/**
 * @class InputCheck
 * @extend Input
 * @prop {Boolean} suppressUniform;
 */
class InputCheck extends Input {
  // static renderCtTpl = `
  //    <div class="form-check form-check-inline">
  //       <label class="form-check-label mr-2">
  //           <input type="checkbox" class="form-check-input-styled"
  //           <span class="ml-2" data-ref="label"></span>
  //       </label>
  //   </div>
  // `;
  constructor(p) {
    InputCheck.configDefaults(p, {
      inputType: 'checkbox',
      inputElValue: '',
    });

    InputCheck.mergeConfig(p, {
      baseCls: 'form-check-input',
      renderWrapper: false,
      disableHelperText: true,
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    if (this.suppressUniform !== true) {
      this.$el.uniform();
    }
  }

  clearValue() {
    this.setValue(false);
  }

  getValue() {
    return this.$el?.prop('checked') ?? null;
  }

  /**
   * @param {Boolean} state
   */
  setInputElValue(state) {
    this.setProp('checked', state);
  }

  setChecked(state) {
    const { $el } = this;

    $el.prop('checked', state || false);

    if (this.ready) {
      $el.uniform('refresh');
    }
  }

  get checked() {
    return this.value;
  }

  set checked(checked) {
    this.value = checked;
  }
}

export default InputCheck;
