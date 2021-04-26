import Form from '../../form/form';
import { isString } from 'lodash';
import { isDisabledEl, isSelectorString, setElDisabled } from '@/core/util/dom';
import { createRefName } from '@/core/util/identifier';

/**
 * alias class
 * @class ServerForm
 * @extend Form
 * @alias From
 */
class ServerForm extends Form {
  isServerForm = true;

  initComponent() {
    this.initFormControls();

    super.initComponent();
  }

  initSaveBtn() {
    super.initSaveBtn();

    const ctrlSaveBtn = this.ctrls?.$saveBtn;

    if (ctrlSaveBtn) {
      ctrlSaveBtn.click(this.onSaveClick.bind(this));
    }
  }

  initFormControls() {
    const { $el, serverFormControls = [] } = this;
    const controls = [];

    serverFormControls.forEach((config) => {
      const isComponentConfig = !isString(config);
      const ref = isComponentConfig ? config.name : config;
      const isSelector = isSelectorString(ref);
      const name = createRefName(ref);
      const $name = '$' + name;
      const $ctrl = $el.find(isSelector ? ref : `[name="${ref}"]`);
      const ctrl = $ctrl.get(0);

      controls[$name] = $ctrl;

      if (ctrl) {
        controls[name] = ctrl;
        controls.push(ctrl);

        if (isComponentConfig) {
          this.addCtrlComponent($ctrl, config);
        } else {
          const disabledProp = $name + 'Disabled';
          const valueProp = $name + 'Value';
          const isCheckbox = $ctrl.prop('type') === 'checkbox';

          Object.defineProperty(this, disabledProp, {
            get: () => isDisabledEl($ctrl),
            set: (v) => {
              setElDisabled($ctrl, v);
            },
          });

          Object.defineProperty(this, valueProp, {
            get: () => (isCheckbox ? $ctrl.prop('checked') : $ctrl.val()),
            set: (v) => {
              $ctrl.val(v);
            },
          });
        }
      }
    });

    this.ctrls = controls;
  }
}

export default ServerForm;
