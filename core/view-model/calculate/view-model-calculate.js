class ViewModelCalculate {
  /**
   *
   * @param p
   * @param p.fn
   * @param p.depends
   * @param p.prop
   * @param p.vm
   */
  constructor(p) {
    this.depends = p.depends;
    this.calcFn = p.fn;
    this.prop = p.prop;
    this.vm = p.vm;

    this.init();
  }

  init() {
    const { depends, vm, prop } = this;

    depends.forEach((dep) => {
      Object.defineProperty(this, dep, {
        get() {
          return vm.get(dep);
        },
        set() {
          vm.set(prop, this.calcFn.call(this));
        },
      });
    });
  }
}

export default ViewModelCalculate;
