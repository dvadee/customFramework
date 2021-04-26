import Button from '@/core/button/button';

class GridSettingsBtn extends Button {
  constructor(p) {
    GridSettingsBtn.configDefaults(p, {
      cls: ['btn-light'],
    });

    GridSettingsBtn.mergeConfig(p, {
      renderTpl: Button.renderTpl,
    });

    super(p);
  }
}

GridSettingsBtn.initMixins(['renderable']);

export default GridSettingsBtn;
