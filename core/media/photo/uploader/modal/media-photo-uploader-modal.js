import MediaBaseUploaderModal from '@/core/media/base/uploader/modal/media-base-uploader-modal';

class MediaPhotoUploaderModal extends MediaBaseUploaderModal {
  constructor(p) {
    MediaPhotoUploaderModal.configDefaults(p, {
      mimeTypes: [
        {
          title: 'Изображения',
          extensions: 'jpg,jpeg,png',
        },
      ],
    });

    super(p);
  }
}

export default MediaPhotoUploaderModal;
