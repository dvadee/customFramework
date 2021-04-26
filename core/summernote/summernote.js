import 'summernote/dist/summernote-bs4';
import 'summernote/dist/summernote-bs4.css';
import 'summernote/dist/lang/summernote-ru-RU';
import Component from '../component';

class Summernote extends Component {
  initComponent() {
    super.initComponent();

    const config = this.getConfig();

    this.$el.summernote(config);
  }

  getConfig() {
    const { config = { height: 200 } } = this;

    config.lang = 'ru-RU';

    return config;
  }

  get text() {
    return this.$el.summernote('code');
  }

  set text(text) {
    this.$el.summernote('code', text);
  }

  destroy() {
    this.$el.summernote('destroy');

    super.destroy();
  }
}

export default Summernote;
