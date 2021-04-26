import FormModal from '@/core/form/modal/form-modal';
import SettingsUserForm from '@/core/settings/user/form/settings-user-form';

/**
 * @class SettingsUserModal
 * @extend FormModal
 */
class SettingsUserModal extends FormModal {
  constructor(p) {
    SettingsUserModal.mergeConfig(p, {
      formClass: SettingsUserForm,
      title: 'Настройки учетной записи',
      buttons: [
        'close',
        {
          text: 'Изменить пароль',
          cls: 'btn-outline-primary',
          handler: 'onChangePasswordFooterBtnClick',
        },
        'save',
      ],
    });

    super(p);
  }

  onChangePasswordFooterBtnClick() {
    this.form.changePassword();
  }
}

export default SettingsUserModal;
