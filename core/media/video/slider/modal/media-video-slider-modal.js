import MediaBaseSliderModal from '@/core/media/base/slider/modal/media-base-slider-modal';
import MediaVideoSlider from '@/core/media/video/slider/media-video-slider';

class MediaVideoSliderModal extends MediaBaseSliderModal {
  constructor(p) {
    MediaVideoSliderModal.configDefaults(p, {
      mediaSliderComponent: MediaVideoSlider,
    });

    super(p);
  }
}

export default MediaVideoSliderModal;
