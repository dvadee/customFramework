import ImageFancybox from '@/core/image/fancybox/image-fancybox';

/**
 * @prop fullSizeData - data for fancybox modal
 *
 */
const cls = 'grid__cell-image-fancy';

const initColumn = function (columnsManager, { enableGallery = true }) {
  const { grid } = columnsManager;

  grid.on({
    tabledraw: () => {
      ImageFancybox.init(grid.$el.find(`.${cls}`), {
        type: 'image',
        openEffect: 'none',
        closeEffect: 'none',
        wheel: false,
        arrows: enableGallery,
        keyboard: enableGallery,
      });
    },
  });
};

const render = (src, type, row, meta, manager) => {
  let html;

  if (src) {
    const config = manager.getColumnConfigByIndex(meta.col);
    const fullSizeSrc = row[config.fullSizeData] || src;

    html = `
      <div class="grid__cell-image-ct">
        <a data-fancybox href="${fullSizeSrc}" class="${cls} fancybox.image" data-fancybox-type="image">
            <img src="${src}" class="grid__cell-image">
        </a>
      </div>
    `;
  } else {
    html = '<div class="text-center"><i class="icon-image4"></i></div>';
  }

  return html;
};

const onCellClick = () => {};

export default { render, onCellClick, initColumn };
