import { emptyFn } from '@/core/util/function';
import { isFunction } from 'lodash';
/**
 * @mixin LoadableMixin
 */
const LoadableMixin = {
  autoLoad: false,

  loadProxy: null,

  lastLoadParams: null,

  onBeforeLoad: emptyFn,

  loadable: {
    get() {
      return isFunction(this.loadProxy);
    },
  },

  reload() {
    return this.load(this.lastLoadParams);
  },

  async load(params) {
    const { loadProxy } = this;

    if (!loadProxy) {
      new Error('Loadable - loadProxy required for load');
    }

    this.loading = true;

    let res;

    if (this.onBeforeLoad({ params }) === false) {
      return;
    }

    try {
      this.lastLoadParams = params;

      if (loadProxy.isRequestCreator) {
        res = await this.executeLoadProxyRequest({ params });
      } else {
        res = await loadProxy(params);
      }
    } catch (err) {
      res = false;

      throw err;
    } finally {
      this.loading = false;
    }

    this.processLoadData(res);

    if (this.isObservable) {
      this.trigger('load', this, res);
    }

    return res;
  },

  async executeLoadProxyRequest(config) {
    let request = this.loadProxyRequest;

    if (request && !request.isFinished) {
      request.cancel();
    }

    request = this.loadProxy.createRequest(config);

    this.loadProxyRequest = request;

    const res = await request.execute();

    this.loadProxyRequest = null;

    return res;
  },

  processLoadData: emptyFn,
};

export default LoadableMixin;
