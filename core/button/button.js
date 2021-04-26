import * as Ladda from 'ladda';
import Component from '../component';
import { goToUrl } from '@/core/util/util';
/**
 * @class Button
 * @extend Component
 * @prop {String|Function} handler
 * @prop {Boolean} suppressLadda
 * @prop {Boolean} enableLadda
 * @prop {String} href
 * @prop {Boolean} block
 * @prop {String} variant
 */
class Button extends Component {
  /**v
   * @event click
   */

  static renderTpl =
    '<button class="btn"><i data-ref="icon-el"></i><span class="btn-text" data-ref="text-el"></span></button>';

  constructor(p) {
    const { $el } = p;

    if ($el) {
      const text = $el.text();

      if ($el.has('.btn-text').length === 0) {
        const $text = $(
          /*html */ `<span class="ladda-label btn-text" data-ref="text-el" title="${text}">${text}</span>`
        );

        $el.html($el.children());

        $text.appendTo($el);
      }

      $el.find('i[class^="icon"]').attr('data-ref', 'icon-el');

      if ($el.has('[data-ref="icon-el"]').length === 0) {
        const $icon = $('<i data-ref="icon-el">');

        $icon.prependTo($el);
      }
    }

    Button.configDefaults(p, {
      config: {},
      elementEvents: ['click'],
      suppressLadda: false,
      enableLadda: true,
    });

    Button.mergeConfig(p, {
      baseCls: 'erp-btn',
      childs: ['text-el', 'icon-el'],
      previousStateCls: '',
      props: {
        text: undefined,
        icon: undefined,
        tooltip: undefined,
        variant: undefined,
      },
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    if (!this.suppressLadda && this.enableLadda) {
      this.initLadda();
    }

    this.initTooltip();

    this.childs.$iconEl?.addClass('erp-btn__icon-el');
    this.childs.$textEl?.addClass('erp-btn__text-el');

    if (this.href) {
      this.on('click', () => goToUrl(this.href));
    }

    if (this.block) {
      this.addCls('btn-block');
    }
  }

  initTooltip() {
    if (!this.tooltip) {
      this.tooltip = this.text;
    }
  }

  initLadda() {
    const el = this.$el.get(0);

    const { dataset, classList } = el;

    classList.add('btn-ladda', 'btn-ladda-spinner');

    const { style, spinnerColor, spinnerSize } = dataset;

    if (!style) {
      dataset.style = 'slide-up';
    }

    if (!spinnerColor) {
      dataset.spinnerColor = '#333';
    }

    if (!spinnerSize) {
      dataset.spinnerSize = '16';
    }

    this.laddaBtn = Ladda.create(el);
  }

  get stateCls() {
    return this.previousStateCls;
  }

  /**
   * btn-primary
   * btn-secondary etc..
   */
  set stateCls(cls) {
    const { $el, previousStateCls = '' } = this;

    if ($el && previousStateCls !== cls) {
      $el.removeClass(previousStateCls);
      $el.addClass(cls);

      this.previousStateCls = cls;
    }
  }

  updateText(text) {
    this.childs.$textEl.text(text);

    this.toggleCls('erp-btn--with-text', !!text);
  }

  updateDisabled(disabled) {
    this.$el.prop('disabled', disabled);
  }

  updateTooltip(title) {
    this.$el?.prop('title', title);
  }

  updateVariant(variant, oldVariant) {
    if (oldVariant) {
      this.removeCls(`btn-${oldVariant}`);
    }

    if (variant) {
      this.addCls(`btn-${variant}`);
    }
  }

  /**
   * @param {Double} v
   */
  set progress(v) {
    this.laddaBtn?.setProgress(v);
  }

  get loading() {
    return this.laddaBtn?.isLoading();
  }
  /**
   * @param {Boolean} loading
   */
  set loading(loading) {
    const { laddaBtn } = this;

    if (loading) {
      laddaBtn?.start();
    } else {
      laddaBtn?.stop();
    }
  }

  updateIcon(icon, oldIcon) {
    const { $iconEl } = this.childs;

    if ($iconEl) {
      if (oldIcon) {
        $iconEl.removeClass(oldIcon);
      }

      $iconEl.addClass(icon);

      this.toggleCls('erp-btn--with-icon', !!icon);
    }
  }

  destroy() {
    this.laddaBtn?.remove();

    super.destroy();
  }
}

export default Button;
