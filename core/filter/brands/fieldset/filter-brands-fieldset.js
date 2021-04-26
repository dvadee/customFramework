import Fieldset from '@/core/fieldset/fieldset';
import FilterBrandsFieldsetBody from '@/core/filter/brands/fieldset/body/filter-brands-fieldset-body';
import { map } from 'lodash';

/**
 * @class FilterBrandsFieldset
 * @extend Fieldset
 * @prop {Function} LoadBrands
 */
class FilterBrandsFieldset extends Fieldset {
  constructor(p) {
    FilterBrandsFieldset.mergeConfig(p, {
      renderTpl: Fieldset.renderTpl,
      title: 'Бренды',
      bodyComponentClass: FilterBrandsFieldsetBody,
    });

    super(p);
  }

  get brandsSelect() {
    return this.body.brandsSelect;
  }

  get selectedBrands() {
    return this.body.brandsSelect.value;
  }

  get brands() {
    return this.brandsSelect.options;
  }
  /**
   * @param {Object[]} brands
   */
  set brands(brands) {
    this.brandsSelect.loadRawData(brands);
  }

  get selectedBrandsIds() {
    return map(this.selectedBrands, (id) => +id);
  }
}

FilterBrandsFieldset.initMixins(['renderable', 'filter']);

export default FilterBrandsFieldset;
