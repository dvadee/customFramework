import MediaBaseSlider from '@/core/media/base/slider/media-base-slider';
import MediaVideoComponent from '@/core/media/video/component/media-video-component';
import slideTpl from './slide/media-video-slider-slide.pug';
import thumbSlideTpl from './thumb-slide/media-video-slider-thumb-slide.pug';

/**
 * @class MediaVideoSlider
 * @extends MediaBaseSlider
 * @prop videoWrapperCls
 * @prop videoCls
 *
 * slide { src, videoId, name }
 *
 */
class MediaVideoSlider extends MediaBaseSlider {
  constructor(p) {
    MediaVideoSlider.configDefaults(p, {
      slideCls: '',
      videoWrapperCls: 'd-block w-100 h-100 text-center',
      videoCls: 'img-fluid',
      slideTpl,
      thumbSlideTpl,
    });

    MediaVideoSlider.mergeConfig(p, {
      cls: ['media-video-slider'],
      fancyBoxConfig: {
        // type: 'iframe',
        // iframe: {
        //   css: {
        //     width: '100%',
        //     height: '100%',
        //   },
        // },
      },
    });

    super(p);
  }

  createSlideFromTpl(data) {
    return super.createSlideFromTpl({
      ...data,
      videoWrapperCls: this.videoWrapperCls,
      videoCls: this.videoCls,
    });
  }
}

MediaVideoSlider.initMixins([MediaVideoComponent]);

export default MediaVideoSlider;
