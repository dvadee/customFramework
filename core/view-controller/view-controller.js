/**
 * @class ViewController
 * @prop {BaseBlock} view
 * @prop {ViewModel} viewModel
 */
class ViewController {
  constructor({ blockCmp }) {
    this.view = this.blockCmp = blockCmp;

    this.view.on('ready', this.onViewReady.bind(this));
  }

  get viewModel() {
    return this.view.lookupViewModel();
  }

  lookup(ref) {
    return this.lookupReference(ref);
  }

  lookupReference(ref) {
    return this.viewModel.lookupReference(ref);
  }

  onViewReady() {
    this.init();
  }

  init() {}
}

export default ViewController;
