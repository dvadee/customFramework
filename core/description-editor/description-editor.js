import Component from '../component';
import Summernote from '../summernote/summernote';

const renderTpl = `
<div class="description-editor">
    <div>
         <div class="h4">Краткое</div>
         <div data-ref="short-desc-el"></div>
    </div>
    <div>
        <div class="h4">Полное</div>
        <div data-ref="full-desc-el"></div>
    </div>
</div>
`;

class DescriptionEditor extends Component {
  constructor(p) {
    DescriptionEditor.mergeConfig(p, {
      childs: ['short-desc-el', 'full-desc-el'],
      renderTpl,
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    const { $shortDescEl, $fullDescEl } = this.childs;

    this.shortDescEditor = new Summernote({
      $el: $shortDescEl,
      config: {
        height: 150,
      },
    });

    this.fullDescEditor = new Summernote({
      $el: $fullDescEl,
      config: {
        height: 150,
      },
    });
  }

  get desc() {
    return {
      short: this.shortDescEditor.text,
      full: this.fullDescEditor.text,
    };
  }

  /**
   * @param desc
   * @param desc.short
   * @param desc.full
   */
  set desc(desc) {
    if (!desc) {
      desc = {};
    }

    this.shortDescEditor.text = desc.short || '';
    this.fullDescEditor.text = desc.full || '';
  }

  destroy() {
    this.shortDescEditor.destroy();

    this.fullDescEditor.destroy();

    super.destroy();
  }
}

DescriptionEditor.initMixins(['renderable']);

export default DescriptionEditor;
