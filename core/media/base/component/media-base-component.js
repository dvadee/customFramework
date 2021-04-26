import { emptyFn } from '@/core/util/function';
import MediaBaseUploaderModal from '@/core/media/base/uploader/modal/media-base-uploader-modal';

/**
 * @mixin MediaBaseComponent
 **/
const MediaBaseComponent = {
  get mediaComponentMixin() {
    return MediaBaseComponent;
  },

  uploaderModalComponent: MediaBaseUploaderModal,

  uploadMediaParams: {},

  mediaIdProperty: '',

  uploadProxy: emptyFn,

  deleteProxy: emptyFn,

  doDeleteMedia: emptyFn,

  uploadMediaUrl: '',

  uploadMediaMaxFileSize: '3Mb',

  init() {
    const UploaderModal = this.uploaderModalComponent;

    this.uploaderModel = new UploaderModal({
      fileUploaderCfg: {
        listeners: {
          uploadcomplete: this.onMediaFileUploadComplete.bind(this),
        },
      },
      uploadUrl: this.uploadMediaUrl,
      uploadMaxFileSize: this.uploadMaxFileSize,
    });
  },

  onMediaFileUploadComplete: emptyFn,

  startUploadMediaDialog() {
    const { uploaderModel } = this;

    uploaderModel.fileUploaderCfg.uploadParams = {
      ...(this.uploadMediaParams || {}),
    };

    uploaderModel.show();
  },

  async deleteMedia(media) {
    const confirm = await this.onBeforeDeleteMedia(media);

    if (confirm === false) {
      return;
    }

    this.loading = true;

    let res;

    try {
      res = await this.deleteProxy({ id: media[this.mediaIdProperty] });
    } finally {
      this.loading = false;
    }

    if (res) {
      this.reload();
    }
  },

  onBeforeDeleteMedia: emptyFn,

  setUploaderParams(params) {
    this.uploadMediaParams = params;
  },
};

export default MediaBaseComponent;
