import api from '../api';
import Request from '@/services/request/request';

class GetRequest extends Request {
  isRequest = true;

  constructor(p) {
    super(p);

    this.url = p.url;
  }

  doApiRequest() {
    const config = this.getRequestConfig();

    return api.get(this.url, config);
  }
}

export default GetRequest;
