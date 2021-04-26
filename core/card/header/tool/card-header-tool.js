import { emptyFn } from '@/core/util/function';
import Component from '@/core/component';
import renderTpl from './card-header-tool.pug';
import './card-header-tool.scss';

/**
 * @class CardHeaderTool
 * @extend Component
 * @prop toolType
 * @prop {Function} handler
 * @prop {String} title
 * @prop {String} icon
 *
 * possible toolType - button, tool, badge
 */
class CardHeaderTool extends Component {
  constructor(p) {
    CardHeaderTool.configDefaults(p, {
      handler: emptyFn,
    });

    CardHeaderTool.mergeConfig(p, {
      childs: ['icon-el', 'text-el'],
      elementEvents: ['click'],
      props: {
        title: undefined,
        icon: undefined,
        text: undefined,
      },
      renderTpl,
    });

    super(p);
  }

  get isButtonToolType() {
    return this.toolType === 'button';
  }

  initComponent() {
    super.initComponent();

    this.addCls(this.getToolTypeCls());

    this.on('click', this.handler);
  }

  getToolTypeCls() {
    return {
      button: () => {
        const hasBtnCls = ~this.getClsList().join(' ').indexOf('btn-');

        return `btn ${hasBtnCls ? '' : 'btn-light'}`;
      },
      tool: () => 'list-icons-item',
      badge: () => 'badge',
    }[this.toolType]();
  }

  get $iconEl() {
    return this.childs.$iconEl;
  }

  getClsByType() {}

  updateTitle(title) {
    this.setElAttr('title', title);
  }

  updateIcon(icon, oldIcon) {
    const { $iconEl } = this;

    if (oldIcon) {
      $iconEl.removeClass(oldIcon);
    }

    if (icon) {
      $iconEl.addClass(icon);
    }

    this.toggleCls('card-header-tool--with-icon', !!icon);
  }

  updateText(text) {
    const { $textEl } = this.childs;

    $textEl.text(text);

    this.toggleCls('card-header-tool--with-text', !!text);
  }
}

CardHeaderTool.initMixins(['renderable']);

export default CardHeaderTool;
