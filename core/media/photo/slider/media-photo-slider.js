import MediaBaseSlider from '@/core/media/base/slider/media-base-slider';
import MediaPhotoComponent from '@/core/media/photo/component/media-photo-component';
import slideTpl from './slide/media-photo-slider-slide.pug';
import thumbSlideTpl from './thumb-slide/media-photo-slider-thumb-slide.pug';
import './media-photo-slider.scss';

/**
 * @class MediaPhotoSlider
 * @extends MediaBaseSlider
 * @mixes MediaPhotoComponent
 * @prop {String} uploadImageUrl
 * @prop {String} uploadMaxFileSize
 * @prop photoLoaderComponentMixin
 */
class MediaPhotoSlider extends MediaBaseSlider {
  constructor(p) {
    MediaPhotoSlider.configDefaults(p, {
      slideCls: 'text-center',
      imageWrapperCls: 'd-block w-100 h-100',
      imageCls: 'w-100 h-100 image-contain',
      idField: 'photoId',
      photoReorderEnabled: true,
      slideTpl,
      thumbSlideTpl,
    });

    MediaPhotoSlider.mergeConfig(p, {
      cls: ['media-photo-slider'],
      fancyBoxConfig: {
        type: 'image',
      },
    });

    super(p);
  }

  get photosCount() {
    return this.slidesCount;
  }

  get photos() {
    return this.slides;
  }

  createSlideFromTpl(data) {
    const { imageWrapperCls, imageCls } = this;

    return super.createSlideFromTpl({
      ...data,
      imageWrapperCls,
      imageCls,
    });
  }

  createThumbSlideFromTpl(data) {
    const { photoReorderEnabled } = this;

    return super.createThumbSlideFromTpl({
      ...data,
      photoReorderEnabled,
    });
  }

  onShiftUpOrderActionBtnClick(meta) {
    this.shiftPhotoOrder(meta.data, true);
  }

  onShiftDownOrderActionBtnClick(meta) {
    this.shiftPhotoOrder(meta.data, false);
  }
}

MediaPhotoSlider.initMixins([MediaPhotoComponent]);

export default MediaPhotoSlider;
