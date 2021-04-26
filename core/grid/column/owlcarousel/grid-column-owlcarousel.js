import '../../../owlcarousel/owlcarousel';
import { template } from 'lodash';
const cls = 'grid-column-owl-carousel';

const tpl = template(`
  <div class="${cls} owl-carousel">
    <% _.forEach(images, (src) => { %>
        <div class="grid-column-owl-carousel__slide grid__cell-image-ct">
            <img src="{{src}}" alt="" class="grid-column-owl-carousel__image grid__cell-image"/>
        </div>
    <% }); %>
  </div>
`);

const render = (images) => tpl({ images });

const init = () => {
  $(`.${cls}`).owlCarousel({
    items: 1,
    nav: false,
    dots: false,
    lazyLoad: true,
  });
};

export default {
  render,
  init,
};
