import Form from '@/core/form/form';
import Input from '@/core/input/input';
import InputPassword from '@/core/input/password/input-password';
import Button from '@/core/button/button';
import Image from '@/core/image/image';
import api from '../../service/settings-service';
import { showWarning, showSuccess } from '@/core/notify/alert';
import FileUploader from '@/core/file-uploader/file-uploader';
import documentType from '@/core/enum/document-type';

const renderTpl = `
<form>
  <div class="row">
    <div class="col-12 col-xl-4 text-center">
      <div class="mb-3">
        <img alt="user image" data-ref="avatar-image"/>
      </div>
      <button class="btn btn-primary" data-ref="upload-avatar-btn">Выбрать</button>
    </div>
    <div class="col-12 col-xl-8">
      <div class="row">
        <div class="col-12 col-xl-6 mb-3 mb-xl-0">
          <div class="form-group">
            <label data-ref="name-input-label">Имя пользователя</label>
            <input data-ref="name-input" />
          </div>
          <div class="form-group">
            <label data-ref="email-input-label">Контактная почта</label>
            <input data-ref="email-input">
          </div>
          <div class="form-group mb-0">
            <label data-ref="phone-input-label">Контактный телефон</label>
            <input data-ref="phone-input">
          </div>
        </div>
        <div class="col-12 col-xl-6">
          <div class="form-group">
            <label data-ref="old-password-input-label">Действущий пароль</label>
            <input data-ref="old-password">
          </div>
          <div class="form-group">
            <label data-ref="new-password-input-label">Новый пароль</label>
            <input data-ref="new-password">
          </div>
          <div class="form-group mb-0">
            <label data-ref="new-password-repeat-input-label">Повторите пароль</label>
            <input data-ref="new-password-repeat">
          </div>
        </div>
      </div>
    </div>
  </div>
  
</form>
`;

class SettingsUserForm extends Form {
  constructor(p) {
    SettingsUserForm.mergeConfig(p, {
      loadProxy: api.fetchUserProfile,
      successMessage: 'Настройки сохранены',
      baseCls: 'settings-user-form',
      childs: [
        {
          reference: 'avatar-image',
          component: Image,
          cls: 'image-cover settings-user-form__avatar rounded-round',
          renderConfig: {
            width: 120,
            height: 120,
          },
          bind: {
            src: '{imageUrl}',
          },
        },
        {
          reference: 'upload-avatar-btn',
          component: Button,
          listeners: {
            click: 'onUploadAvatarImageClick',
          },
        },
        {
          reference: 'name-input',
          component: Input,
          readOnly: true,
          bind: {
            value: '{name}',
          },
        },
        {
          reference: 'email-input',
          component: Input,
          validator: 'email',
          bind: {
            value: '{email}',
          },
        },
        {
          reference: 'phone-input',
          component: Input,
          bind: {
            value: '{phone}',
          },
        },
        {
          reference: 'old-password',
          component: InputPassword,
          bind: {
            value: '{oldPassword}',
          },
        },
        {
          reference: 'new-password',
          component: InputPassword,
          bind: {
            value: '{newPassword}',
          },
        },
        {
          reference: 'new-password-repeat',
          component: InputPassword,
          bind: {
            value: '{newPasswordRepeat}',
          },
        },
      ],
      viewModel: {
        data: {
          name: '',
          email: '',
          phone: '',
          oldPassword: '',
          newPassword: '',
          newPasswordRepeat: '',
        },
      },
      renderTpl,
    });

    super(p);
  }

  get employeeId() {
    return this.lookupViewModel().get('employeeId');
  }

  async save() {
    this.loading = true;

    if (!this.isValid()) {
      return;
    }

    const vm = this.lookupViewModel();

    const contactsParams = {
      id: this.employeeId,
      phone: vm.get('phone'),
      email: vm.get('email'),
    };

    let res;

    try {
      res = api.setUserContacts(contactsParams);
    } finally {
      this.loading = false;
    }

    if (res) {
      this.onSave(res, contactsParams);
    }
  }

  setFormData(data) {
    super.setFormData(data);

    this.lookupViewModel().set({
      employeeId: data.employeeId,
      name: data.employeeName || '',
      email: data.email || '',
      phone: data.phone || '',
      imageUrl: data.imageUrl,
    });
  }

  validatePasswordChangeParams({ newPassword, newPasswordRepeat }) {
    let msg;

    if (newPassword !== newPasswordRepeat) {
      msg = 'Пароли не совпадают';
      return;
    }

    if (!newPassword) {
      msg = 'Введите пароль';
    }

    return msg || true;
  }

  async changePassword() {
    const vm = this.lookupViewModel();
    const oldPassword = vm.get('oldPassword');
    const newPassword = vm.get('newPassword');
    const newPasswordRepeat = vm.get('newPasswordRepeat');

    const passwordChangeValidation = this.validatePasswordChangeParams({
      newPassword,
      newPasswordRepeat,
    });

    if (passwordChangeValidation !== true) {
      showWarning(passwordChangeValidation);
      return;
    }

    this.loading = true;
    let res;

    try {
      res = await api.changeUserPassword({ oldPassword, newPassword });
    } finally {
      this.loading = false;
    }

    if (res) {
      vm.set({
        oldPassword: '',
        newPassword: '',
        newPasswordRepeat: '',
      });

      showSuccess('Пароль изменен!');
    }
  }

  uploadFile() {
    const uploader = new FileUploader({
      url: '/admin/employees/UploadFiles',
      autoUpload: true,
      mimeTypes: [{ title: 'Images', extensions: 'jpg,jpeg,png' }],
      uploadParams: { id: this.employeeId, documentType: documentType.photo },
      singleUpload: true,
      listeners: {
        fileuploaded: this.onFileUploaded.bind(this),
        uploadcomplete: () => {
          uploader.destroy();
        },
      },
    });

    uploader.openBrowseDialog();
  }

  onFileUploaded(uploader, file, res) {
    this.lookupViewModel().set('imageUrl', res.fileUrl);

    showSuccess('Фото сотрудника изменено');
  }

  onUploadAvatarImageClick() {
    this.uploadFile();
  }
}

SettingsUserForm.initMixins(['renderable']);

export default SettingsUserForm;
