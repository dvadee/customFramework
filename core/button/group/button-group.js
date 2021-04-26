import Component from '@/core/component';

const renderTpl = `
<div class="btn-group btn-group-toggle" data-toggle="buttons">
    <% buttons.forEach((btn, index) => { %>
        <label class="btn {{btn.cls || 'btn-primary'}}">
            <% const btnName = id + 'options'; %>
            <% const btnId = id + '_option_' + index; %>
            <% const name = btn.name || btnId; %>
            <input type="radio" name="{{btnName}}" value="{{name}}" id="{{btnId}}">
            {{btn.text}}
        </label>
    <% }); %>
</div>
`;

/**
 * toggle buttonsgroup
 * @class ButtonGroup
 * @extend Component
 * @prop {Object[]} buttons
 * @prop {Boolean} multipleToggle=false
 */
class ButtonGroup extends Component {
  constructor(p) {
    ButtonGroup.configDefaults(p, {
      multipleToggle: false,
      buttons: [],
    });

    ButtonGroup.mergeConfig(p, {
      childs: ['.btn'],
      renderTpl,
    });

    super(p);
  }

  initComponent() {
    super.initComponent();
  }

  getRenderData() {
    return {
      buttons: this.buttons,
      multipleToggle: this.multipleToggle,
    };
  }

  get selected() {
    const activeBtn = this.$el.find('.btn.active');
    let v = null;

    if (activeBtn) {
      v = activeBtn.find('input').val();
    }

    return v;
  }

  set selected(v) {
    Array.from(this.childs.btn).forEach((btn) => {
      if ($(btn).find('input').val() === v) {
        btn.click();
      }
    });
  }
}

ButtonGroup.initMixins(['renderable']);

export default ButtonGroup;
