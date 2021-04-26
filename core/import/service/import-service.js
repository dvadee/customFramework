import api from '../../../services/api';

export default {
  fetchMarkupTypes: () => api.get('import/getMarkTypes'),
};
