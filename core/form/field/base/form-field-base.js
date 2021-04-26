import Component from '@/core/component';
import InputLabel from '@/core/input/label/input-label';

const inputTpl = '<input data-ref="input-el"/>';

const renderTpl = `
  <div class="form-field form-group">
    <div class="form-field__label-ct" data-ref="label-ct">
        <label class="form-field__label" data-ref="label-el"></label>
    </div>
    <div class="form-field__input-ct" data-ref="input-ct">
        {{inputTpl}}
    </div>
  </div>
`;
/**
 * @abstract
 * @class FormFieldBase
 * @extends Component
 * @prop {Input} input
 * @prop {InputLabel} label
 * @prop childs
 * @prop {jQuery} childs.$labelEl
 * @prop {jQuery} childs.$inputEl
 * @prop {String[]} inputEvents
 * @prop {Boolean} inline
 * @prop {String} labelCls
 * @prop {String} inputCls
 *
 * Значение в конструктор передавать через renderConfig
 */
class FormFieldBase extends Component {
  /**
   *
   * @param p
   * @param p.inputTpl
   * @param p.renderTpl
   */
  constructor(p) {
    FormFieldBase.configDefaults(p, {
      childs: ['label-el', 'input-el', 'label-ct', 'input-ct'],
      inputEvents: ['change', 'input', 'focus', 'blur', 'changevalue'],
      inputTpl,
      renderTpl,
    });

    p.renderTpl = p.renderTpl.replace('{{inputTpl}}', p.inputTpl);

    super(p);
  }

  initComponent() {
    super.initComponent();

    this.input = this.createInput();

    this.label = this.createLabel();

    this.input.addCls('form-field__input');

    if (this.inline) {
      this.addCls('row');
      this.label.addCls('col-form-label');
    }

    const { inputCls, labelCls } = this;
    const { $labelCt, $inputCt } = this.childs;

    if (inputCls) {
      $inputCt.addClass(inputCls);
    }

    if (labelCls) {
      $labelCt.addClass(labelCls);
    }
  }

  initEvents() {
    const { input } = this;

    this.relayEvents(input, this.inputEvents);
  }

  get $inputEl() {
    return this.childs.$inputEl;
  }

  /**
   * @protected
   */
  createInput() {}

  createLabel() {
    return new InputLabel({
      $el: this.childs.$labelEl,
      input: this,
    });
  }

  getInputConfig() {
    const { inputConfig = {}, renderConfig } = this;

    FormFieldBase.mergeConfig(inputConfig, {
      $el: this.$inputEl,
      renderConfig: {
        value: renderConfig.value,
      },
    });

    //Значение устанавливается ранее
    //Там уже не надо.
    delete renderConfig.value;

    return inputConfig;
  }

  get labelText() {
    const { $labelEl } = this.childs;

    return $labelEl ? $labelEl.text() : '';
  }

  set labelText(text) {
    const { $labelEl } = this.childs;

    $labelEl.text(text);
  }

  get value() {
    return this.input.value;
  }

  set value(value) {
    this.input.value = value;
  }
}

FormFieldBase.initMixins(['renderable']);

export default FormFieldBase;
