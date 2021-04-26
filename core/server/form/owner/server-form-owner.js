import { isString } from 'lodash';

const ServerFormOwner = {
  getFormConfig() {
    return {
      reference: 'form',
      $el: this.$form,
      component: this.formClass,
      listeners: {
        saved: 'onFormSaved',
      },
    };
  },
  /**
   * @protected
   * @param {Object|undefined} modelData form modal data
   */
  createForm(modelData) {
    const config = this.getFormConfig();

    config.modelData = modelData;

    return this.addChildComponent(config);
  },

  initForm(res) {
    const { $formCt } = this;

    if (!res) {
      $formCt.html('');
      return;
    }
    let html, data;

    if (isString(res)) {
      html = res;
      data = {};
    } else {
      ({ data, html } = res);
    }

    $formCt.html(html);

    this.$form = $formCt.find('.server-form');
    this.form = this.createForm(data);
  },

  onFormSaved() {
    this.trigger('formsaved', this, this.form);
  },

  destroyForm() {
    const { form } = this;

    if (form) {
      form.destroy();

      this.form = null;
      this.$form = null;
    }
  },
};

export default ServerFormOwner;
