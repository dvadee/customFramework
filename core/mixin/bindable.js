import { isFunction } from 'lodash';
import ViewModel from '../view-model/view-model';

/**
 * @mixin BindableMixin
 */
const BindableMixin = {
  isBindable: true,

  createViewModel() {
    const { viewModel } = this;

    // создать.
    if (viewModel) {
      const isProto = isFunction(viewModel);
      const VM = isProto ? viewModel : ViewModel;

      this.viewModel = new VM({
        holder: this,
        data: viewModel?.data,
        calculate: viewModel?.calculate,
      });
    }
  },

  initController() {
    const ControllerClass = this.controller;

    if (ControllerClass) {
      this.controller = new ControllerClass({ blockCmp: this });
    }
  },

  initViewModel() {
    //Создается vm если есть конфиг
    this.createViewModel();
    //Ищет vm, если найдется - инит.
    this.initVMBind();
  },

  initVMBind() {
    const vm = this.lookupViewModel();

    if (vm) {
      this.bind = vm.initComponentBind(this);
    }
  },

  lookupViewModelHolder() {
    const vm = this.lookupViewModel();

    return vm && vm.holder;
  },

  lookupViewModel() {
    let vm;
    let cmp = this;

    while (cmp && !vm) {
      vm = cmp.viewModel;
      cmp = cmp.parentCmp;
    }

    return vm;
  },

  lookupReference(ref) {
    const vm = this.lookupViewModel ? this.lookupViewModel() : null;

    if (vm) {
      return vm.lookupReference(ref);
    }
  },

  publishState(prop, value) {
    if (this.isEventsSuspended) {
      return;
    }

    const { bind } = this;
    const propBind = bind ? bind[prop] : null;

    if (propBind) {
      propBind.value = value;
    } else {
      this[prop] = value;
    }
  },
};

export default BindableMixin;
