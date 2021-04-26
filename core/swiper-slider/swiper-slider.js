import { castArray, isFunction } from 'lodash';
import template from '@/core/util/lodash-template';
import Component from '@/core/component';
import renderTpl from './swiper-slider.pug';
import slideTpl from './slide/swiper-slider-slide.pug';
import './swiper-slider.scss';

import { Swiper, Navigation, Pagination, Scrollbar, Thumbs } from 'swiper';
Swiper.use([Navigation, Pagination, Scrollbar, Thumbs]);

/**
 * @class SwiperSlider
 * @extend Component
 * @prop {Boolean} [paginationEnabled=false]
 * @prop {Boolean} [navigationEnabled=false]
 * @prop {Boolean} [scrollbarEnabled=false]
 * @prop {Boolean} [thumbsEnabled=false]
 * @prop {Object} [sliderConfig={}]
 * @prop {Object} [thumbsConfig={}]
 * @prop {TemplateExecutor} slideTpl
 * @prop {TemplateExecutor} thumbSlideTpl
 * @prop {String} idField
 * @prop {Object[]} slides
 */
class SwiperSlider extends Component {
  constructor(p) {
    SwiperSlider.configDefaults(p, {
      paginationEnabled: false,
      navigationEnabled: false,
      scrollbarEnabled: false,
      thumbsEnabled: false,
      sliderConfig: {},
      thumbsConfig: {},
      thumbSlideTpl: slideTpl,
      idField: 'id',
      renderTpl,
      slideTpl,
    });

    SwiperSlider.mergeConfig(p, {
      childs: [
        'slider',
        'pagination',
        'btn-nav-prev',
        'btn-nav-next',
        'scrollbar',
        'thumbs-slider',
        'thumbs-btn-nav-prev',
        'thumbs-btn-nav-next',
      ],
      sliderConfig: {
        speed: 0,
      },
      props: {
        slides: [],
      },
    });

    if (!isFunction(p.slideTpl)) {
      p.slideTpl = template(p.slideTpl);
    }

    if (!isFunction(p.thumbSlideTpl)) {
      p.thumbSlideTpl = template(p.thumbSlideTpl);
    }

    super(p);
  }

  updateSlides(slides) {
    this.loadRawSlidesData(slides);
  }

  getSlideMeta(id) {
    const index = this.slides.findIndex((slide) => slide[this.idField] === id);
    const data = this.slides[index];
    const slideEl = this.slider.slides[index];

    return { data, slideEl, index };
  }

  getSlideAt(index) {
    return this.slides[index];
  }

  get slider() {
    return this.swiper;
  }

  initComponent() {
    this.addCls('swiper');

    super.initComponent();

    const { sliderConfig, thumbsConfig, thumbsEnabled, childs } = this;

    if (thumbsEnabled) {
      this.thumbsSlider = new Swiper(childs.thumbsSlider, thumbsConfig);

      sliderConfig.thumbs = {
        swiper: this.thumbsSlider,
      };
    }

    this.swiper = new Swiper(childs.slider, sliderConfig);

    $(document).on({
      'dashboard.sidebartoggle': () => this.updateSlider(),
      'custom.collapsedpanelresize': () => this.updateSlider(),
    });
  }

  initPluginConfig() {
    const { sliderConfig, childs } = this;

    SwiperSlider.configDefaults(sliderConfig, {
      spaceBetween: 10,
      centeredSlides: true,
    });

    SwiperSlider.configDefaults(this.thumbsConfig, {
      spaceBetween: 10,
      slidesPerView: 3,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
      navigation: {
        nextEl: childs.thumbsBtnNavNext,
        prevEl: childs.thumbsBtnNavPrev,
      },
    });

    if (this.navigationEnabled) {
      sliderConfig.navigation = {
        nextEl: childs.btnNavNext,
        prevEl: childs.btnNavPrev,
      };
    }
  }

  get slidesCount() {
    return this.slider?.slides.length;
  }

  createSlidesElements(data) {
    return data.map((slideData) => this.createSlideFromTpl(slideData));
  }

  createThumbSlidesTpl(data) {
    return data.map((slideData) => this.createThumbSlideFromTpl(slideData));
  }

  createSlideFromTpl(data) {
    return $(this.slideTpl(data)).get(0);
  }

  createThumbSlideFromTpl(data) {
    return $(this.thumbSlideTpl(data)).get(0);
  }

  loadRawSlidesData(slidesData, append = false) {
    if (!append) {
      this.removeAllSlides();
    }

    this.appendSlide(slidesData);
  }

  /**
   *
   * @param slidesData
   * @returns {{slides: [], thumbs: []}}
   */
  processSlidesData(slidesData) {
    slidesData = castArray(slidesData);

    return {
      slides: this.createSlidesElements(slidesData),
      thumbs: this.thumbsEnabled ? this.createThumbSlidesTpl(slidesData) : null,
    };
  }

  appendSlide(slidesData) {
    const slidesElements = this.processSlidesData(slidesData);

    this.slider.appendSlide(slidesElements.slides);

    this.thumbsSlider?.appendSlide(slidesElements.thumbs);

    this.onSlidesAdd(slidesElements);
  }

  addSlide(slidesData, index) {
    const slidesElements = this.processSlidesData(slidesData);

    this.slider.addSlide(index, slidesElements.slides);

    this.thumbsSlider?.addSlide(index, slidesElements.thumbs);

    this.onSlidesAdd(slidesElements);
  }

  removeAllSlides() {
    this.slider.removeAllSlides();

    this.thumbsSlider?.removeAllSlides();
  }

  removeSlideById(id) {
    const index = this.getSwiperSlideIndex(id);

    this.removeSlide(index);
  }

  removeSlide(index) {
    this.slider.removeSlide(index);

    this.thumbsSlider?.removeSlide(index);
  }

  updateSlider() {
    this.slider.update();
    this.thumbsSlider?.update();
  }

  shiftSlide() {}

  onSlidesDataLoaded() {}

  onSlidesAdd() {
    this.updateSlider();
  }
}

SwiperSlider.initMixins(['renderable']);

export default SwiperSlider;
