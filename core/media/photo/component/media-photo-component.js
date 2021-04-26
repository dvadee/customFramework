import MediaBaseComponent from '@/core/media/base/component/media-base-component';
import { assign, clone } from 'lodash';
import { asyncConfirm } from '@/core/bootbox/bootbox';
import MediaPhotoUploaderModal from '@/core/media/photo/uploader/modal/media-photo-uploader-modal';
import { emptyFn } from '@/core/util/function';

/**
 * @mixin MediaPhotoComponent
 * @mixes MediaBaseComponent
 */
const MediaPhotoComponent = {
  ...MediaBaseComponent,

  mediaIdProperty: 'photoId',

  uploaderModalComponent: MediaPhotoUploaderModal,

  shiftOrderProxy: emptyFn,

  onBeforeDeleteMedia(photo) {
    return asyncConfirm({
      message: `
        <div>
            <p>Действительно удалить фото?</p>
            <div class="text-center">
                <img src="${photo.previewLink}" class="img-fluid">
            </div>
        </div>
      `,
    });
  },

  /**
   *
   * @param photo
   * @param isUp
   * @returns {Promise<void>}
   */
  async shiftPhotoOrder(photo, isUp) {
    const order = photo.displayOrder;
    const isFirstPhoto = order === 0;
    const isLastPhoto = order === this.photosCount - 1;

    if ((isUp && isFirstPhoto) || (!isUp && isLastPhoto)) {
      return;
    }

    const params = clone(this.shiftPhotoParams || {});

    const newPosition = isUp ? order - 1 : order + 1;

    assign(params, {
      photoId: photo.photoId,
      newPosition,
    });

    this.loading = true;

    let res;

    try {
      res = await this.shiftOrderProxy(params);
    } finally {
      this.loading = false;
    }

    if (res) {
      this.reload();
    }
  },
};

export default MediaPhotoComponent;
