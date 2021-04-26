import { sum } from 'lodash';
import { registerApi } from '../datatable-api';

registerApi('column().sum()', function () {
  return sum(this.data());
});
