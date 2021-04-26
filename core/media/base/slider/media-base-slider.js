import SwiperSlider from '@/core/swiper-slider/swiper-slider';
import ImageFancybox from '@/core/image/fancybox/image-fancybox';

const slideTpl = '<div></div>';
const thumbSlideTpl = '<div></div>';

/**
 * @class MediaBaseSlider
 * @extends SwiperSlider
 * @mixes MediaBaseComponent
 * @prop fancyBoxConfig
 */
class MediaBaseSlider extends SwiperSlider {
  constructor(p) {
    MediaBaseSlider.configDefaults(p, {
      fancyBoxConfig: {},
      thumbSlideCls: '',
      slideCls: '',
      idField: 'id',
      slideTpl,
      thumbSlideTpl,
    });

    MediaBaseSlider.mergeConfig(p, {
      fancyBoxConfig: {
        openEffect: 'none',
        closeEffect: 'none',
        wheel: false,
        arrows: true,
        keyboard: false,
      },
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    this.mediaComponentMixin.init.call(this);
  }

  onSlidesAdd(slidesElements) {
    super.onSlidesAdd(slidesElements);

    const $slides = $(slidesElements.slides);
    const $thumbSlides = $(slidesElements.thumbs);

    ImageFancybox.init($slides.find('[data-fancybox]'), this.fancyBoxConfig);

    $thumbSlides.on('click', '[data-action]', this.onActionBtnClick.bind(this));
  }

  createSlideFromTpl(data) {
    const { slideCls } = this;

    return super.createSlideFromTpl({
      ...data,
      slideCls,
    });
  }

  createThumbSlideFromTpl(data) {
    const slide = super.createThumbSlideFromTpl(data);

    slide.classList.add('media-thumb-slide');
    slide.dataset.id = data[this.mediaIdProperty];

    return slide;
  }

  onActionBtnClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const btn = $(e.currentTarget);
    const action = btn.data('action');
    const slideEl = btn.closest('.media-thumb-slide');
    const meta = this.getSlideMeta(slideEl.data('id'));
    const handler = this[action];

    if (meta.data && handler) {
      handler.call(this, meta);
    }
  }

  processLoadData(data) {
    super.processLoadData(data);

    this.slides = data;
  }

  onMediaFileUploadComplete() {
    this.reload();
  }

  onRemoveRowActionBtnClick({ data }) {
    this.deleteMedia(data);
  }
}

export default MediaBaseSlider;
