import MediaBaseUploaderModal from '@/core/media/base/uploader/modal/media-base-uploader-modal';

class MediaVideoUploaderModal extends MediaBaseUploaderModal {
  constructor(p) {
    MediaVideoUploaderModal.mergeConfig(p, {
      mimeTypes: [
        {
          title: 'Видео',
          extensions: 'mp4,avi,mkv',
        },
      ],
    });

    super(p);
  }
}

export default MediaVideoUploaderModal;
