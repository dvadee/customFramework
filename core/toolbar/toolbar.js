import Component from '@/core/component';
import renderTpl from './toolbar.pug';

class Toolbar extends Component {
  constructor(p) {
    Toolbar.configDefaults(p, {
      scopedChildsReferences: true,
      childs: ['buttons-ct'],
      renderSlotsProps: ['buttonsSlotTpl'],
      buttonsSlotTpl: '',
      renderTpl,
    });

    Toolbar.mergeConfig(p, {});

    super(p);
  }

  get $containerEl() {
    return this.childs.$buttonsCt;
  }
}

Toolbar.initMixins(['renderable']);

export default Toolbar;
