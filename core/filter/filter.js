/**
 * @mixin FilterMixin
 */
const FilterMixin = {
  initFilter() {
    this.publishFilterParams();
  },

  onFilterChange() {
    this.trigger('filterchange', this);

    this.publishFilterParams();
  },

  publishFilterParams() {
    this.publishState('filter', this.getFilterParams());
  },

  getFilterParams() {
    return {};
  },
};

export default FilterMixin;
