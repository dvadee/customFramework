import MediaBaseSliderCard from '@/core/media/base/slider/card/media-base-slider-card';
import MediaPhotoSlider from '@/core/media/photo/slider/media-photo-slider';

class MediaPhotoSliderCard extends MediaBaseSliderCard {
  constructor(p) {
    MediaPhotoSliderCard.mergeConfig(p, {
      mediaSliderComponent: MediaPhotoSlider,
    });

    super(p);
  }
}

export default MediaPhotoSliderCard;
