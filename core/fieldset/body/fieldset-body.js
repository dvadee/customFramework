import Component from '@/core/component';

const renderTpl = `
  <div></div>
`;

class FieldsetBody extends Component {
  constructor(p) {
    FieldsetBody.configDefaults(p, {
      renderTpl,
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    this.addCls('collapse', 'show', 'fieldset-body');
  }
}

FieldsetBody.initMixins(['renderable']);

export default FieldsetBody;
