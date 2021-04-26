/**
 * http://demo.interface.club/limitless/demo/Template/layout_1/LTR/default/full/form_input_groups.html
 **/
import Component from '@/core/component';
import Input from '../input';
import { alias, createGetterSetterAlias } from '@/core/util/function';

/**
 * @class InputGroup
 * @extend Component
 * @prop {Input} inputComponent
 * @prop {Object[]} prependItems
 * @prop {Object} prependItems.listeners
 * @prop {String} prependItems.html
 * @prop {Object[]} appendItems
 * @prop {String} appendItems.html
 * @prop {Object} appendItems.listeners
 */
class InputGroup extends Component {
  static renderHtml = `
    <div class="input-group">
        <div class="input-group-prepend" data-ref="prepend-ct"></div>
        <input data-ref="input">
        <div class="input-group-append" data-ref="append-ct"></div>
    </div>
  `;

  constructor(p) {
    InputGroup.mergeConfig(p, {
      baseCls: 'input-group',
      childs: ['prepend-ct', 'append-ct', 'input'],
      elementEvents: ['click', 'mousedown'],
    });

    InputGroup.configDefaults(p, {
      inputComponent: Input,
    });

    super(p);
  }

  initComponent() {
    const { $el } = this;

    $el.attr('tabindex', '-1');
    $el.focus(this.onFocusIn.bind(this));
    $el.blur(this.onFocusOut.bind(this));

    super.initComponent();

    this.initInput();

    this.initGroupItems();
  }

  initInput() {
    const InputComponent = this.inputComponent;
    const { $input } = this.childs;
    const config = this.getInputComponentConfig();

    config.$el = $input;

    const input = new InputComponent(config);

    this.relayEvents(
      input,
      ['enterkeydown', 'changevalue', 'keydown', 'keyup', 'change'],
      '',
      [0, 1]
    );

    this.focus = alias(input, 'focus');
    this.blur = alias(input, 'blur');

    createGetterSetterAlias({
      obj: this,
      targetObj: input,
      prop: 'value',
    });

    this.input = input;
  }

  getInputComponentConfig() {
    return {
      disableHelperText: true,
    };
  }

  get prependCt() {
    return this.childs.$prependCt;
  }

  get appendCt() {
    return this.childs.$appendCt;
  }

  createGroupItem(item) {
    const { listeners, html } = item;

    const $item = $(html);

    if (listeners) {
      $item.on(this.prepareChildListeners(listeners));
    }

    return $item;
  }

  /**
   * @private
   */
  insertGroupItem(item, target) {
    const $item = this.createGroupItem(item);

    $item.appendTo(target);
  }

  prependGroupItem(item) {
    this.insertGroupItem(item, this.prependCt);
  }

  appendGroupItem(item) {
    this.insertGroupItem(item, this.appendCt);
  }

  initGroupItems() {
    const { prependItems, appendItems } = this;

    if (prependItems) {
      prependItems.forEach((item) => this.prependGroupItem(item));
    }

    if (appendItems) {
      appendItems.forEach((item) => this.appendGroupItem(item));
    }
  }

  onFocusIn() {
    console.log('focusin');
  }

  onFocusOut() {
    console.log('focusout');
  }
}

export default InputGroup;
