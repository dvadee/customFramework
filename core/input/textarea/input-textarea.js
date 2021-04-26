import Input from '@/core/input/input';

/**
 * @class InputTextarea
 * @extend Input
 * @prop {Number} rowsSize
 * @prop {Boolean} resizable
 */
class InputTextarea extends Input {
  constructor(p) {
    InputTextarea.configDefaults(p, {
      rowsSize: 5,
      resizable: false,
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    const { rowsSize, $el } = this;

    if (rowsSize >= 0) {
      $el.attr('rows', rowsSize);
    }

    if (this.resizable) {
      $el.css('resize', 'none');
    }
  }
}

export default InputTextarea;
