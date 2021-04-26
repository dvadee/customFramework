import Fieldset from '@/core/fieldset/fieldset';
import FilterPriceFieldsetBody from '@/core/filter/price/fieldset/body/filter-price-fieldset-body';
import { batchCreateGetterSetterAlias } from '@/core/util/function';

/**
 * @class FilterPriceFieldset
 * @extend Fieldset
 * @prop {Number} priceMin
 * @prop {Number} priceMax
 */
class FilterPriceFieldset extends Fieldset {
  constructor(p) {
    FilterPriceFieldset.mergeConfig(p, {
      renderTpl: Fieldset.renderTpl,
      title: 'Цена',
      bodyComponentClass: FilterPriceFieldsetBody,
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    batchCreateGetterSetterAlias({
      obj: this,
      targetObj: this.body,
      props: ['priceMin', 'priceMax'],
    });
  }
}

FilterPriceFieldset.initMixins(['renderable', 'filter']);

export default FilterPriceFieldset;
