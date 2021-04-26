import Card from '@/core/card/card';
import FilterPriceFieldset from '@/core/filter/price/fieldset/filter-price-fieldset';
import FilterBrandsFieldset from '@/core/filter/brands/fieldset/filter-brands-fieldset';

/**
 * @class FilterGoodsCard
 * @extend Card
 * @mixes FilterMixin
 * @prop {FilterPriceFieldset} priceFilter
 * @prop {FilterBrandsFieldset} brandsFilter
 * @prop {Function} loadBrandsProxy
 */
class FilterGoodsCard extends Card {
  constructor(p) {
    FilterGoodsCard.mergeConfig(p, {
      renderTpl: Card.renderTpl,
      title: 'Фильтр по параметрам',
      collapsible: false,
      refreshable: false,
      closable: false,
      scopedChildsReferences: true,
      items: [
        {
          reference: 'price-filter',
          component: FilterPriceFieldset,
          listeners: {
            filterchange: 'onFilterChange',
          },
        },
        {
          reference: 'brands-filter',
          cls: ['flex-fill'],
          component: FilterBrandsFieldset,
          loadProxy: p.brandsLoadProxy,
          listeners: {
            filterchange: 'onFilterChange',
          },
        },
      ],
      props: {
        filter: {},
      },
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    this.addCls('h-100');

    this.header.removeCls('py-2');

    this.$body.addClass('overflow-auto d-flex flex-column');
  }

  onReady() {
    super.onReady();

    this.initFilter();
  }

  updateFilter() {
    //TODO
  }

  getFilterParams() {
    const {
      priceFilter: { priceMin, priceMax },
      brandsFilter: { selectedBrandsIds },
    } = this;

    return {
      inStockOnly: false,
      priceLimits: {
        minLimit: priceMin,
        maxLimit: priceMax,
      },
      brandIds: selectedBrandsIds,
    };
  }

  /**
   *
   * @param params
   * @param params.catalogIds
   * @param params.filter
   * @returns {Promise<void>}
   */
  async loadBrands(params) {
    const { loadBrandsProxy, brandsFilter } = this;

    if (!loadBrandsProxy) {
      throw new Error('FilterGoodsCard - loadBrandsProxy required!');
    }

    let res;

    brandsFilter.loading = true;

    try {
      res = await loadBrandsProxy(params);
    } finally {
      brandsFilter.loading = false;
    }

    brandsFilter.brands = res;

    this.trigger('brandsload', this, res);
  }

  clearBrands() {
    if (this.brandsFilter.loading) {
      this.one('brandsload', () => this.clearBrands());

      return;
    }

    this.brandsFilter.brands = [];
  }
}

FilterGoodsCard.initMixins(['renderable', 'filter']);

export default FilterGoodsCard;
