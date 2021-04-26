import api from '../api';

class Request {
  isRequest = true;

  constructor({ config }) {
    this.config = config || {};

    this.cancelSource = api.createCancelTokedSource();
  }

  execute() {
    try {
      return this.doApiRequest();
    } catch (err) {
      if (api.isRequestCancelError(err)) {
        return false;
      }

      throw err;
    } finally {
      this.destroy();
    }
  }

  cancel(msg) {
    this.cancelSource.cancel(msg);
  }

  doApiRequest() {
    const config = this.getRequestConfig();

    return api.request(config);
  }

  getRequestConfig() {
    const { config } = this;

    config.cancelToken = this.cancelSource.token;

    return config;
  }

  destroy() {
    this.config = null;
    this.cancelSource = null;
    this.destroyed = true;
    this.isFinished = true;
  }
}

export default Request;
