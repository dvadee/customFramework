import DescriptionEditor from '../description-editor';
import Modal from '../../modal/modal';
import { batchCreateGetterSetterAlias } from '../../util/function';

class DescriptionEditorModal extends Modal {
  constructor(p) {
    DescriptionEditorModal.mergeConfig(p, {
      title: 'Редактирование описаний',
      size: 'full',
      buttons: ['save', 'close'],
    });
    super(p);
  }

  initComponent() {
    super.initComponent();

    const { $body } = this.childs;

    const editor = new DescriptionEditor({
      $renderTo: $body,
    });

    batchCreateGetterSetterAlias({
      obj: this,
      targetObj: editor,
      props: ['desc'],
    });

    this.editor = editor;
  }

  startEdit(p) {
    this.show();

    if (this.loadable) {
      this.load(p);
    } else {
      this.processLoadData(p);
    }
  }

  processLoadData(data) {
    if (!data) {
      this.hide();

      return;
    }

    this.editor.desc = data;
  }

  /**
   * @protected
   */
  getSaveData() {
    return this.desc;
  }

  async saveDesc() {
    const data = this.getSaveData();

    let res;

    this.loading = true;

    try {
      res = await this.saveProxy(data);
    } finally {
      this.loading = false;
    }

    if (res) {
      this.onSave(res);
    }
  }

  /**
   * @protected
   */
  onSave() {}

  async onSaveBtnClick() {
    await this.saveDesc();

    this.hide();
  }
}

export default DescriptionEditorModal;
