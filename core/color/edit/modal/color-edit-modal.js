import FormModal from '@/core/form/modal/form-modal';
import ColorEditForm from '@/core/color/edit/form/color-edit-form';

class ColorEditModal extends FormModal {
  constructor(p) {
    ColorEditModal.configDefaults(p, {
      formClass: ColorEditForm,
      title: 'Цвет',
    });

    super(p);
  }
}

export default ColorEditModal;
