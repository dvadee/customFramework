import plupload from 'plupload';
import FileUploaderModal from '../../file-uploader/modal/file-uploader-modal';

/**
 * @abstract
 * @class ImportModal
 * @extend FileUploaderModal
 * @prop {Function} fetchFormHtmlProxy
 * @prop {Object} modelData
 * @prop {Form} formClass
 */
class ImportModal extends FileUploaderModal {
  constructor(p = {}) {
    ImportModal.mergeConfig(p, {
      description:
        'Для загрузки данных в систему используются Excel-файлы произвольной структуры, но содержащие необходимые для идентификации товара данные. Проследите, чтобы файл соответствовал этому требованию.',
      fullHeight: true,
      size: 'full',
      centered: true,
      backdrop: 'static',
      listeners: {
        uploadcomplete: (modal, uploader, files) =>
          this.onFileUploaderModelUploadComplete(uploader, files),
      },
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    const { $body } = this.childs;

    this.$formCt = $('<div class="h-100"></div>');

    this.$formCt.appendTo($body);

    this.toggleFormVisible(false);
  }

  createUploader() {
    super.createUploader();
  }

  get $uploaderBody() {
    return this.childs.$fileUploaderBody;
  }

  onFileUploaderModelUploadComplete(uploader, [file]) {
    if (file.status === plupload.FAILED) {
      return;
    }

    this.initForm();
  }

  /**
   * @protected
   */
  initForm() {}

  toggleFormVisible(showForm) {
    const { $formCt, $uploaderBody } = this;

    $uploaderBody[showForm ? 'hide' : 'show']();
    $formCt[showForm ? 'show' : 'hide']();
  }

  getFormConfig() {
    return {
      reference: 'form',
      component: this.formClass,
      fileType: this.fileType,
      listeners: {
        saved: 'onFormSaved',
        loading: 'onFormLoading',
      },
    };
  }

  /**
   * @protected
   */
  createForm() {
    const config = this.getFormConfig();

    return this.addChildComponent(config);
  }

  onFormLoading(form, loading) {
    this.loading = loading;
  }

  onFormSaved() {
    this.trigger('formsaved', this);
    this.hide();
  }

  onHidden() {
    const { form } = this;

    super.onHidden();

    if (form) {
      form.destroy();

      this.form = null;
    }

    this.toggleFormVisible(false);
  }
}

export default ImportModal;
