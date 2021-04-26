import ImportModal from '@/core/import/modal/import-modal';
import { assign } from 'lodash';
import ErrorHandler from '@/core/error/handler/error-handler';

/**
 * @class ImportFormModal
 * @extends ImportModal
 */
class ImportFormModal extends ImportModal {
  getFormConfig() {
    return assign(super.getFormConfig(), {
      $renderTo: this.$formCt,
    });
  }

  getFormLoadParams() {}

  async initForm() {
    try {
      this.createForm();

      this.toggleFormVisible(true);

      const params = this.getFormLoadParams();

      const res = await this.form.load(params);

      if (!res) {
        this.close();
      }
    } catch (err) {
      ErrorHandler.handleError(err);

      throw err;
    }
  }
}

export default ImportFormModal;
