import { alias } from '@/core/util/function';
import Modal from '@/core/modal/modal';
import MediaBaseSlider from '@/core/media/base/slider/media-base-slider';
import bodyRenderTpl from './body/media-base-slider-modal-base.pug';

/**
 * @class MediaBaseSliderModal
 * @extends Modal
 * @prop {MediaBaseSlider} slider
 * @prop {Number} sliderMinHeight
 * @prop {Boolean} enableUploadButton
 */
class MediaBaseSliderModal extends Modal {
  constructor(p) {
    MediaBaseSliderModal.configDefaults(p, {
      sliderComponent: MediaBaseSlider,
      sliderConfig: {},
      sliderMinHeight: 500,
      enableUploadButton: true,
      buttons: [],
      size: Modal.modalSizes.large,
      //багует с переключением
      hideOnBackdropClick: false,
    });

    MediaBaseSliderModal.mergeConfig(p, {
      childs: [
        {
          reference: 'slider',
          component: p.sliderComponent,
          ...p.sliderConfig,
        },
      ],
      bodyRenderTpl,
    });

    super(p);
  }

  initComponent() {
    if (this.enableUploadButton) {
      this.buttons = [
        ...this.buttons,
        {
          text: 'Добавить',
          cls: 'btn-primary',
          icon: 'icon-plus-circle2',
          handler: 'onUploadImageBtnClick',
        },
      ];
    }

    super.initComponent();

    this.load = alias(this.slider, 'load');

    this.slider.setStyle({ minHeight: this.sliderMinHeight });
  }

  onUploadImageBtnClick() {
    this.slider.startUploadMediaDialog();
  }

  onShown() {
    super.onShown();

    this.slider.updateSlider();
  }
}

export default MediaBaseSliderModal;
