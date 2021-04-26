import Modal from '../../modal/modal';
import Form from '../form';
import { alias } from '@/core/util/function';

/**
 * @class FormModal
 * @extend Modal
 * @prop {Form} form
 */
class FormModal extends Modal {
  static showFormModal(p = {}) {
    const { modalConfig = {}, loadParams } = p;
    const ModalComponent = this;

    const modal = ModalComponent.showModal(modalConfig);

    if (loadParams) {
      modal.load(loadParams);
    }

    return modal;
  }

  constructor(p) {
    FormModal.configDefaults(p, {
      formComponent: Form,
      size: 'large',
      centered: true,
      formConfig: {},
      buttons: ['close', 'save'],
    });

    super(p);
  }

  getFormConfig() {
    const { formConfig } = this;

    formConfig.$renderTo = this.childs.$body;

    return formConfig;
  }

  initComponent() {
    super.initComponent();

    const config = this.getFormConfig();

    config.component = this.formClass || this.formComponent;

    this.form = this.addChildComponent(config);

    this.load = alias(this.form, 'load');

    this.form.on('loading', this.onFormLoadingChange.bind(this));

    this.relayEvents(this.form, ['saved'], 'form');
  }

  async onSaveBtnClick() {
    const result = await this.form.save();

    if (result === true) {
      super.onSaveBtnClick();
    }
  }

  onShown() {
    super.onShown();

    this.form.initForm && this.form.initForm();
  }

  onHidden() {
    super.onHidden();
    // with close action 'destroy' form is gone
    this.form?.reset();
  }

  onFormLoadingChange(form, loading) {
    this.loading = loading;
  }
}

export default FormModal;
