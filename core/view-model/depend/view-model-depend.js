class ViewModelDepend {
  /**
   *
   * @param viewModel
   * @param cmp
   * @param cmpProp
   * @param vmProp
   */
  constructor({ viewModel, cmp, cmpProp, vmProp, vmBind }) {
    this.vm = viewModel;
    this.cmp = cmp;
    this.cmpProp = cmpProp;
    this.vmProp = vmProp;
    this.vmBind = vmBind;
  }

  notify() {
    if (this.vmBind) {
      this.vmBind.notify();
    } else {
      const { cmpProp, vmProp } = this;

      this.cmp[cmpProp] = this.vm.get(vmProp);
    }
  }
}

export default ViewModelDepend;
