import Component from '@/core/component';
import FieldsetHeader from './header/fieldset-header';
import FieldsetBody from './body/fieldset-body';

/**
 * @class Fieldset
 * @extend Container
 * @prop {String} title
 * @prop {String} icon
 * @prop {FieldsetBody.prototype} bodyComponentClass
 * @prop {Boolean} collapsible
 * @prop {FieldsetHeader} header
 * @prop {FieldsetBody} body
 *
 * Подставлять свой body компонент
 */
class Fieldset extends Component {
  static renderTpl = '<fieldset></fieldset>';

  constructor(p) {
    Fieldset.configDefaults(p, {
      bodyComponentClass: FieldsetBody,
      collapsible: false,
      title: '',
      icon: '',
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    this.initHeader();

    this.initBody();
  }

  getHeaderConfig() {
    return {
      fieldset: this,
      title: this.title,
      icon: this.titleIcon,
      $renderTo: this.$el,
    };
  }

  initHeader() {
    this.header = new FieldsetHeader(this.getHeaderConfig());
  }

  getBodyConfig() {
    return {
      fieldset: this,
      $renderTo: this.$el,
    };
  }

  initBody() {
    const Component = this.bodyComponentClass;

    this.body = new Component(this.getBodyConfig());
  }

  get title() {
    return this._title;
  }

  set title(title) {
    const { header } = this;

    if (header) {
      header.title = title;
    }

    this._title = title;
  }

  get titleIcon() {
    return this._titleIcon;
  }

  set titleIcon(titleIcon) {
    const { header } = this;

    if (header) {
      header.icon = titleIcon;
    }

    this._titleIcon = titleIcon;
  }
}

export default Fieldset;
