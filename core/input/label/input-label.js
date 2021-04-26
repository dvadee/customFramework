import Component from '@/core/component';

class InputLabel extends Component {
  constructor(p) {
    super(p);
  }

  initComponent() {
    super.initComponent();

    this.$el.attr('for', this.input.elementId);
  }

  get text() {
    return this?.$el.text() || '';
  }

  set text(text) {
    if (this.$el) {
      this.$el.text(text);
    } else {
      this.renderConfig.text = text;
    }
  }
}

export default InputLabel;
