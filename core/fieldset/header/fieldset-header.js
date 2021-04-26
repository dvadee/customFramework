import Component from '@/core/component';

const renderTpl = `
<legend class="font-weight-semibold text-uppercase font-size-sm d-flex align-items-center">
  <i class="{{icon}} mr-2" data-ref="icon-el"></i>
  <span data-ref="title-el">{{title}}</span>
  <a href="#" class="ml-auto text-default d-none" aria-expanded="true" data-ref="collapse-tool-el">
      <i class="icon-circle-down2"></i>
  </a>
</legend>
`;

/**
 * @class FieldsetHeader
 * @extend Component
 * @prop {Fieldset} fieldset
 */
class FieldsetHeader extends Component {
  constructor(p) {
    FieldsetHeader.mergeConfig(p, {
      childs: ['collapse-tool', 'icon-el', 'title-el'],
      collapsible: false,
      renderTpl,
    });

    super(p);
  }

  initComponent() {
    super.initComponent();
  }

  get icon() {
    return this._icon;
  }

  set icon(icon) {
    const oldIcon = this._icon;
    const { $iconEl } = this.childs;

    if ($iconEl) {
      if (oldIcon) {
        $iconEl.removeClass(oldIcon);
      }

      if (icon) {
        $iconEl.addClass(icon);
      }
    }

    this._icon = icon;
  }

  get title() {
    return this._title;
  }

  set title(title) {
    const { $titleEl } = this.childs;

    if ($titleEl) {
      $titleEl.text(title);
    }

    this._title = title;
  }

  getRenderData() {
    const { icon, title } = this;

    return {
      title,
      icon,
    };
  }
}

FieldsetHeader.initMixins(['renderable']);

export default FieldsetHeader;
