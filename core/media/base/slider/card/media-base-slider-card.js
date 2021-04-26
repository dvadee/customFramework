import { alias } from '@/core/util/function';
import Card from '@/core/card/card';
import MediaBaseSlider from '@/core/media/base/slider/media-base-slider';
/**
 * @class MediaBaseSliderCard
 * @extend Card
 * @prop enableUploadButton
 * @prop enableRemoveButton
 * @prop sliderConfig
 * @prop mediaSliderComponent
 * @prop {PhotoSlider} slider
 */
class MediaBaseSliderCard extends Card {
  constructor(p) {
    MediaBaseSliderCard.configDefaults(p, {
      enableUploadButton: true,
      enableRemoveButton: true,
      enableHeader: true,
      mediaSliderComponent: MediaBaseSlider,
      sliderConfig: {},
    });

    MediaBaseSliderCard.mergeConfig(p, {
      autoRenderBody: true,
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    this.slider = this.addChildComponent(this.sliderConfig);

    this.load = alias(this.slider, 'load');
  }

  initPluginConfig() {
    const { sliderConfig } = this;

    sliderConfig.$renderTo = this.$body;
    sliderConfig.component = this.swiperSliderComponent;
  }

  getHeaderConfig() {
    const config = super.getHeaderConfig();

    const tools = [];

    if (this.enableUploadButton) {
      tools.push({
        reference: 'upload-tool',
        action: 'onUploadPhotoClick',
        icon: 'icon-file-upload2',
        title: 'Загрузить',
      });
    }

    if (this.enableRemoveButton) {
      tools.push({
        reference: 'remove-tool',
        action: 'onRemovePhotoClick',
        icon: 'icon-file-minus2',
        title: 'Удалить выбранное',
      });
    }

    config.tools = tools;

    return config;
  }

  onUploadPhotoClick() {
    this.slider.startUploadMediaDialog();
  }

  onRemovePhotoClick() {
    this.slider.deleteMedia();
  }

  clear() {
    this.slider.removeAllSlides();
  }
}

export default MediaBaseSliderCard;
