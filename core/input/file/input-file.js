import Input from '../input';

/**
 * input type="file"
 * @class InputFile
 * @extends Input
 * @prop accept
 */
class InputFile extends Input {
  constructor(p) {
    InputFile.mergeConfig(p, {
      type: 'file',
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    const { $el, accept } = this;

    if (accept) {
      $el.attr('accept', accept);
    }

    $el.uniform();
  }

  get value() {
    return this.$el.prop('files');
  }

  openBrowseDialog() {
    this.$el.click();
  }
}

export default InputFile;
