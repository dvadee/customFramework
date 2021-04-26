import Component from '../../component';

class ServerHtml extends Component {
  constructor(p) {
    super(p);

    if (!this.proxyApi) {
      throw new Error('ServerHtml - proxyApi required!');
    }
  }

  async loadHtml(params) {
    let html;

    if (params) {
      this.loadParams = params;
    } else {
      params = this.loadParams;
    }

    try {
      const res = await this.proxyApi(params || {});

      html = res;
    } catch {
      html = null;
    }

    this.setHtml(html);
  }

  resetHtml() {
    this.setHtml(null);
  }

  setHtml(html) {
    const { $el, emptyHtml } = this;

    if (!emptyHtml) {
      this.emptyHtml = $el.html();
    }

    if (!html) {
      html = this.emptyHtml;
    }

    $el.html(html);

    this._init();
  }
}

export default ServerHtml;
