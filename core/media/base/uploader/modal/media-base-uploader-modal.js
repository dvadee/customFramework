import FileUploaderModal from '@/core/file-uploader/modal/file-uploader-modal';

class MediaBaseUploaderModal extends FileUploaderModal {
  /**
   * @param p
   * @param p.uploadUrl
   * @param p.uploadMaxFileSize
   */
  constructor(p) {
    if (!p.uploadUrl) {
      throw new Error('uploadUrl - required!');
    }

    MediaBaseUploaderModal.configDefaults(p, {
      allowExtensions: '',
      mimeTypes: [],
      uploadMaxFileSize: '3Mb',
    });

    MediaBaseUploaderModal.mergeConfig(p, {
      fileUploaderCfg: {
        url: p.uploadUrl,
        uploadMaxFileSize: p.uploadMaxFileSize,
        singleUpload: false,
        mimeTypes: p.mimeTypes,
      },
    });

    super(p);
  }
}

export default MediaBaseUploaderModal;
