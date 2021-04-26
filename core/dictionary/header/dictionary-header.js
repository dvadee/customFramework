import Component from '@/core/component';
import renderTpl from './dictionary-header.pug';

class DictionaryHeader extends Component {
  constructor(p) {
    DictionaryHeader.configDefaults(p, {
      title: '',
      description: '',
      icon: '',
      renderTpl,
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    this.addCls('dictionary-header');
  }
}

DictionaryHeader.initMixins(['renderable']);

export default DictionaryHeader;
