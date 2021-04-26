import MediaBaseComponent from '@/core/media/base/component/media-base-component';
import { asyncConfirm } from '@/core/bootbox/bootbox';
import MediaVideoUploaderModal from '@/core/media/video/uploader/modal/media-video-uploader-modal';

/**
 * @mixin MediaVideoComponent
 * @mixes MediaBaseComponent
 */
const MediaVideoComponent = {
  ...MediaBaseComponent,

  mediaIdProperty: 'videoId',

  uploaderModalComponent: MediaVideoUploaderModal,

  onBeforeDeleteMedia(video) {
    return asyncConfirm({
      message: `
        <div>
            <p>Действительно удалить видео "${video.videoName}?</p>
        </div>
      `,
    });
  },
};

export default MediaVideoComponent;
