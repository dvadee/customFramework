import MediaBaseSliderModal from '@/core/media/base/slider/modal/media-base-slider-modal';
import MediaPhotoSlider from '@/core/media/photo/slider/media-photo-slider';

class MediaPhotoSliderModal extends MediaBaseSliderModal {
  constructor(p) {
    MediaPhotoSliderModal.configDefaults(p, {
      sliderComponent: MediaPhotoSlider,
    });

    super(p);
  }
}

export default MediaPhotoSliderModal;
