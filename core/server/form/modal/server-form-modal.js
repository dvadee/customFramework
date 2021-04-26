import Modal from '../../../modal/modal';
import ServerForm from '../server-form';
import MixinManager from '@/core/mixin/manager';
import ServerFormOwner from '@/core/server/form/owner/server-form-owner';

const bodyRenderTpl = `
  <div data-ref="form-ct"></div>
`;

/**
 * @class ServerFormModal
 * @extend {Modal} Modal
 * @prop {Object} loadParams
 * @prop {ServerForm} formClass
 */
class ServerFormModal extends Modal {
  loadParams = null;

  constructor(p) {
    ServerFormModal.configDefaults(p, {
      formClass: ServerForm,
      size: 'large',
      centered: true,
      fullHeight: true,
      bodyRenderTpl,
    });

    ServerFormModal.mergeConfig(p, {
      childs: ['form-ct'],
    });

    super(p);
  }

  get $formCt() {
    return this.childs.$formCt;
  }

  processLoadData(data) {
    this.initForm(data);
  }

  onFormSaved() {
    ServerFormOwner.onFormSaved.call(this);

    this.hide();
  }

  /**
   *
   * @param loadParams
   */
  showForm(loadParams) {
    this.loadParams = loadParams;

    this.show();
  }

  onShown() {
    super.onShown();

    this.load(this.loadParams);
  }

  onHidden() {
    super.onHidden();

    this.destroyForm();
  }
}

MixinManager.applyMixin(ServerFormModal.prototype, ServerFormOwner);

export default ServerFormModal;
