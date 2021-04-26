import axios from 'axios';
import qs from 'qs';
import { isObject } from 'lodash';
import ErrorHandler from '@/core/error/handler/error-handler';
import GetRequest from '@/services/request/get-request';
import { showWarning } from '../core/notify/alert';

let config = {
  // baseURL: 'http://localhost:5000',
  // timeout: 60 * 1000, // Timeout
  paramsSerializer: (p) => qs.stringify(p, { arrayFormat: 'repeat' }),
};

const _axios = axios.create(config);

const log = (msg) => console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);

/**
 *
 * @param res
 * @param res.data
 * @param res.status
 * @returns {*|boolean}
 */
const processResponse = (res) => {
  const { data, status, config } = res;
  // Do something with response data
  if (isObject(data) && ('error' in data || 'result' in data)) {
    const { result = true, error, warning } = data;
    let { messages } = data;

    if (messages) {
      messages = messages.join('<br>');

      if (error) {
        ErrorHandler.handleApiError({
          url: config.url,
          method: config.method,
          errorMessage: messages,
        });
      } else if (warning) {
        showWarning(messages);
      }
    }

    return error || warning ? false : result;
  } else if (data) {
    return data;
  } else {
    return status === 200;
  }
};

_axios.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    log(`${config.method} - ${config.url} - request`);
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  (res) => {
    log(`${res.config.method} - ${res.config.url} - response - ${res.status}`);

    return processResponse(res);
  },
  (error) => {
    ErrorHandler.handleError(error);

    return false;
  }
);

export default {
  get: _axios.get,
  post: _axios.post,
  delete: _axios.delete,
  put: _axios.put,
  request: _axios.request,
  createCancelTokedSource: () => axios.CancelToken.source(),
  isRequestCancelError: (err) => axios.isCancel(err),
  getRequestUrlCreator: (controller) => (method) => `/${controller}/${method}`,
  getGetRequestCreator: (url) => ({
    createRequest: (config) => new GetRequest({ url, config }),
    isRequestCreator: true,
  }),
  processResponse,
};
