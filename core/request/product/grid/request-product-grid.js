import Grid from '@/core/grid/grid';
import RequestProductGridSettingsWidget from '@/core/request/product/grid/settings/widget/request-product-grid-settings-widget';

class RequestProductGrid extends Grid {
  constructor(p) {
    RequestProductGrid.configDefaults(p, {
      idField: 'requestProductId',
      headerHidden: true,
      enableHighlightRows: true,
      hoverableRows: true,
      selectionEnabled: true,
      dataTableCfg: {
        data: [],
        autoWidth: false,
        scroller: true,
      },
    });

    RequestProductGrid.mergeConfig(p, {
      columns: [
        {
          title: 'Наличие в прайсах',
          data: 'foundOffers',
          hidden: true,
        },
      ],
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    this.$el.addClass('grid--products');

    const { rowCls } = this;

    this.hasPurchasedQuantityRowCls = `${rowCls}--has-purchased-quantity`;
    this.hasOffersRowCls = `${rowCls}--has-offers`;
  }

  createSettingsWidget() {
    return new RequestProductGridSettingsWidget({ grid: this });
  }

  /**
   *
   * @param {Object} data
   * @param {Number} data.purchasedQuantity
   * @param {Boolean} data.foundOffers
   */
  isHighlightRow(data) {
    const hasPurchasedQuantity = (data.purchasedQuantity ?? 0) > 0;
    const hasOffers = data.foundOffers;

    return {
      [this.hasPurchasedQuantityRowCls]: hasPurchasedQuantity,
      [this.hasOffersRowCls]: !hasPurchasedQuantity && hasOffers,
    };
  }

  get foundOffersColumn() {
    return this.columnsManager.getColumnByName('foundOffers');
  }

  get rowsWithoutOffersHidden() {
    return this.foundOffersColumn.search() === 'true';
  }

  /**
   *
   * @param {Boolean} hidden
   */
  set rowsWithoutOffersHidden(hidden) {
    /**
     * set filter foundOffers === true
     */
    this.foundOffersColumn.search(hidden || '').draw();
  }

  toggleRowsWithoutOfferHidden() {
    this.rowsWithoutOffersHidden = !this.rowsWithoutOffersHidden;
  }
}

export default RequestProductGrid;
