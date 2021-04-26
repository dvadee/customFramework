import { get } from 'lodash';

/**
 * @class ImportForm
 * @extend ServerForm
 * @prop {Function} markupLoadProxy
 * @prop fileType
 */

const ImportSheetFormMixin = {
  /**
   *
   * @param idx
   * @returns {any}
   */
  getSheetMarkup(idx) {
    return get(this, `sheetsMarkup[${idx}]`, []);
  },

  sheetsMarkup: {
    get: function () {
      return this._sheetMarkup;
    },

    set: function (markup) {
      this._sheetMarkup = markup;

      this.trigger('sheetmarkupchange', this, markup);
    },
  },

  async loadMarkup(params) {
    this.loading = true;

    try {
      const res = await this.markupLoadProxy(params);

      if (this.destroyed) {
        return;
      }

      this.sheetsMarkup = res || [];
    } catch (err) {
      /**
       * @TODO CATCH_ERROR
       */
      window.onerror(err);
    } finally {
      this.loading = false;
    }
  },

  /**
   * @protected
   */
  onTableHeaderNameChange() {},
};

export default ImportSheetFormMixin;
