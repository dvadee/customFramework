import MediaBaseSliderCard from '@/core/media/base/slider/card/media-base-slider-card';
import MediaVideoSlider from '@/core/media/video/slider/media-video-slider';

class MediaVideoSliderCard extends MediaBaseSliderCard {
  constructor(p) {
    MediaVideoSliderCard.configDefaults(p, {
      mediaSliderComponent: MediaVideoSlider,
    });

    super(p);
  }
}

export default MediaVideoSliderCard;
