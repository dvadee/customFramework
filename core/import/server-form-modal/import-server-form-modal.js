import { showError } from '@/core/notify/alert';
import ImportModal from '@/core/import/modal/import-modal';
import { assign } from 'lodash';

/**
 * @abstract
 * @class ImportModal
 * @extend FileUploaderModal
 * @prop {Function} fetchFormHtmlProxy
 * @prop {Object} modelData
 * @prop {Form} formClass
 */
class ImportServerFormModal extends ImportModal {
  get $severForm() {
    const { $formCt } = this;

    return $formCt ? $formCt.find('.server-form') : $();
  }

  initForm() {
    this.loadFormHtml();
  }

  async loadFormHtml(params) {
    const { $formCt } = this;
    let res;

    this.loading = true;

    try {
      res = await this.fetchFormHtmlProxy(params);
    } catch {
      showError('Ошибка загрузки');
    } finally {
      this.loading = false;
    }

    if (res) {
      const { data, html } = res;

      $formCt.html(html);

      this.createForm(data);

      this.toggleFormVisible(true);
    } else {
      $formCt.html('');

      this.hide();
    }
  }

  getFormConfig() {
    return assign(super.getFormConfig(), {
      $el: this.$severForm,
    });
  }

  createForm(modelData) {
    const config = this.getFormConfig();

    config.modelData = modelData;

    return this.addChildComponent(config);
  }
}

export default ImportServerFormModal;
