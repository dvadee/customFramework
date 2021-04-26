import Component from '../component';
import { pick, isObject, isString } from 'lodash';
import renderTpl from './modal.pug';

/**
 * @private
 * @type {{small: string, default: string, large: string, sm: string, lg: string, full: string}}
 */
const sizes = {
  sm: 'modal-sm',
  small: 'modal-sm',
  default: '',
  lg: 'modal-lg',
  large: 'modal-lg',
  full: 'modal-full',
};

/**
 * @class Modal
 * @extend Component
 * @prop {String} saveBtnText
 * @prop {Boolean} [fullHeight=false]
 * @prop {Boolean} [withoutAnimation=false]
 * @prop {Boolean} [hideOnBackdropClick=false]
 * @prop {Boolean} [autoShow=false]
 */
class Modal extends Component {
  static showModal(modalConfig = {}) {
    const ModalComponent = this;

    Modal.mergeConfig(modalConfig, {
      closeAction: 'destroy',
      centered: true,
      autoShow: true,
    });

    return new ModalComponent(modalConfig);
  }

  static asyncShowModal(modalConfig) {
    const ModalComponent = this;

    Modal.mergeConfig(modalConfig, {
      closeAction: 'destroy',
      centered: true,
      autoShow: true,
    });

    return new Promise((resolve) => {
      let resolved = false;

      modalConfig.callback = (result) => {
        resolved = true;

        resolve(result);
      };

      const modal = ModalComponent.showModal(modalConfig);

      modal.on('hidden', () => {
        if (!resolved) {
          resolve(false);
        }
      });
    });
  }

  static modalSizes = {
    small: 'sm',
    default: '',
    large: 'lg',
    full: 'full',
  };

  /**
   *
   * @param {Object} p
   * @param {String} p.cls
   * @param {String} p.renderTpl
   * @param {String} p.title
   * @param {String} p.bodyRenderTpl
   * @param {String} p.footerRenderTpl
   * @param {Boolean} p.centered
   * @param {Boolean} p.closeOnBackdropClick
   * @param {Boolean} p.autoShow
   */
  constructor(p) {
    Modal.mergeConfig(p, {
      childs: ['title', 'body', 'content', 'close-btn', 'footer', 'dialog'],
      renderSlotsProps: ['bodyRenderTpl', 'footerRenderTpl'],
    });

    Modal.configDefaults(p, {
      title: '',
      fullHeight: false,
      centered: true,
      size: 'default',
      backdrop: true,
      hideOnBackdropClick: true,
      saveBtnText: 'Сохранить',
      closeAction: 'hide',
      $renderTo: $('body'),
      autoShow: false,
      bodyRenderTpl: '',
      footerRenderTpl: '',
      renderTpl,
    });

    super(p);

    if (this.autoShow) {
      this.show();
    }
  }

  initComponent() {
    const { $el } = this;
    const { $content, $dialog } = this.childs;

    this.$blockTarget = $content;

    if (!this.hideOnBackdropClick) {
      this.backdrop = 'static';
    }

    $el.modal({
      show: false,
      focus: false,
      backdrop: this.backdrop,
    });

    if (this.fullHeight) {
      $dialog.addClass('modal-dialog-full-height');
    }

    this.initButtons();
  }

  initButtons() {
    const { $footer } = this.childs;
    const { buttons } = this;

    if (buttons) {
      buttons.forEach((btn) => {
        if (isString(btn)) {
          if (btn === 'close') {
            btn = this.createCloseBtn();
          } else if (btn === 'save') {
            btn = this.createSaveBtn();
          }
        } else if (isObject(btn)) {
          btn = this.createFooterBtn(btn);
        }

        btn.appendTo($footer);
      });
    }
  }

  createFooterBtn(config) {
    const {
      text,
      icon = '',
      cls = 'btn-light',
      handler,
      scope = this,
    } = config;

    const fn = isString(handler) ? scope[handler] : handler;

    const btn = $(
      `<button class="btn ${cls}">${
        icon ? `<i class="${icon} mr-2"></i>` : ''
      }${text}</button>`
    );

    btn.click(fn.bind(scope));

    return btn;
  }

  initEvents() {
    const { $el } = this;

    $el.on({
      'hide.bs.modal': this.onHide.bind(this),
      'show.bs.modal': this.onShow.bind(this),
      'shown.bs.modal': this.onShown.bind(this),
      'hidden.bs.modal': this.onHidden.bind(this),
    });
  }

  /**
   * Start hide
   * @param e
   */
  onHide(e) {
    if (this.closeSuspended) {
      e.preventDefault();

      return;
    }

    this.trigger('hide', this);
  }

  /**
   * Start show
   */
  onShow() {
    this.trigger('show', this);
  }

  /**
   * has show
   */
  onShown() {
    this.trigger('shown', this);
  }

  /**
   * has hidden
   */
  onHidden() {
    this.trigger('hidden', this);

    if (this.closeAction === 'destroy') {
      this.destroy();
    }
  }

  isHidden() {
    return !this.$el.hasClass('show');
  }

  createSaveBtn() {
    const btn = $(
      `<button type="button" class="btn btn-primary">${this.saveBtnText}</button>`
    );

    btn.click(this.onSaveBtnClick.bind(this));

    return btn;
  }

  createCloseBtn() {
    return $(
      '<button type="button" class="btn btn-link" data-dismiss="modal">Закрыть</button>'
    );
  }

  show() {
    this.$el.modal('show');
  }

  hide() {
    this.$el.modal('hide');
  }

  destroy() {
    this.$el.modal('dispose');

    super.destroy();
  }

  getRenderData() {
    const data = pick(this, [
      'id',
      'cls',
      'title',
      'centered',
      'bodyRenderTpl',
      'footerRenderTpl',
    ]);

    data.sizeCls = sizes[this.size];

    return data;
  }

  suspendClose() {
    const { $closeBtn } = this.childs;

    this.closeSuspended = true;

    $closeBtn.prop('disabled', true);
  }

  resumeClose() {
    const { $closeBtn } = this.childs;

    this.closeSuspended = false;

    $closeBtn.prop('disabled', false);
  }

  onSaveBtnClick() {
    this.trigger('savebtnclick', this);

    this.hide();
  }

  close() {
    this.hide();
  }

  get titleHtml() {
    return this.childs?.$title?.html();
  }

  set titleHtml(title) {
    if (this.ready) {
      this.childs.$title.html(title);
    } else {
      this.addRenderConfigProp('titleHtml', title);
    }
  }

  static enableModalsStacking() {
    $(document).on('show.bs.modal', '.modal', function () {
      const zIndex = 1040 + 10 * $('.modal:visible').length;

      $(this).css('z-index', zIndex);

      setTimeout(() => {
        $('.modal-backdrop')
          .not('.modal-stack')
          .css('z-index', zIndex - 1)
          .addClass('modal-stack');
      }, 0);
    });
  }
}

Modal.initMixins(['renderable']);

Modal.enableModalsStacking();

export default Modal;
