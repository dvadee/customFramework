import Component from '@/core/component';
import Button from '@/core/button/button';
import renderTpl from './dropdown-base.pug';

class DropdownBase extends Component {
  static renderTpl = renderTpl;

  constructor(p) {
    DropdownBase.configDefaults(p, {
      btnConfig: {},
      segmentedBtnConfig: {},
      showDropdownToggleArrow: true,
      btnCls: '',
      dropdownMenuSlotTpl: '',
      renderTpl,
    });

    DropdownBase.mergeConfig(p, {
      baseCls: 'dropdown',
      childs: ['.btn-group', '.btn', '.dropdown-menu'],
      renderSlotsProps: ['dropdownMenuSlotTpl'],
      props: {
        btnText: undefined,
        btnTooltip: undefined,
      },
    });

    super(p);
  }

  get $dropdownMenu() {
    return this.childs.$dropdownMenu;
  }

  initComponent() {
    super.initComponent();

    this.initButton();
  }

  initEvents() {
    this.$el.on({
      'shown.bs.dropdown': this.onMenuShow.bind(this),
      'hidden.bs.dropdown': this.onMenuHide.bind(this),
    });

    if (this.isSegmentedBtnDropdown) {
      this.btn.on('click', this.onButtonClick.bind(this));
    }
  }

  initButton() {
    const { $btn, $btnGroup } = this.childs;
    const isSegmentedBtnDropdown = !!$btnGroup.get(0);

    if ($btn.get(0)) {
      this.btn = new Button(this.getBtnConfig());
    }

    if (isSegmentedBtnDropdown) {
      this.arrowBtn = new Button({ $el: $btn.eq(1) });
    }

    if (!isSegmentedBtnDropdown && this.btn) {
      this.btn.addCls('dropdown-toggle');
    }

    this.isSegmentedBtnDropdown = isSegmentedBtnDropdown;

    this.btn?.toggleCls('dropdown-toggle', this.showDropdownToggleArrow);
  }

  getBtnConfig() {
    const { btnConfig } = this;

    return {
      cls: this.btnCls,
      $el: this.childs.$btn.first(),
      ...btnConfig,
    };
  }

  getSegmentedBtnConfig() {
    const { segmentedBtnConfig } = this;

    return {
      $el: this.childs.$btn.eq(1),
      ...segmentedBtnConfig,
    };
  }

  get isMenuShown() {
    const { $dropdownMenu } = this;

    return $dropdownMenu.hasClass('show');
  }

  showMenu() {
    if (!this.isMenuShown) {
      this.$el.dropdown('toggle');
    }
  }

  hideMenu() {
    if (this.isMenuShown) {
      this.$el.dropdown('toggle');
    }
  }

  onButtonClick(btn, e) {
    e.preventDefault();

    this.trigger('buttonclick', this, btn, e);
  }

  onMenuShow() {
    this.trigger('menushow', this);
  }

  onMenuHide() {
    this.trigger('menuhide', this);
  }

  updateDisabled(disabled) {
    this.btn.disabled = disabled;

    if (this.isSegmentedBtnDropdown) {
      this.arrowBtn.disabled = disabled;
    }
  }

  updateBtnText(text) {
    this.btn.text = text;
  }

  updateBtnTooltip(tooltip) {
    this.btn.tooltip = tooltip;
  }

  updateLoading(loading) {
    this.btn.loading = loading;
  }
}

export default DropdownBase;
