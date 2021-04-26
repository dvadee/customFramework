import api from '@/services/api';
const url = api.getRequestUrlCreator('Colors');

export default {
  /**
   *
   * @param params
   * @param params.id
   * @returns {Promise<AxiosResponse<any>>}
   */
  fetchColor: (params) => api.get(url('GetColor'), { params }),

  /**
   *
   * @param data
   * @param data.colorId
   * @param data.name
   * @param data.alternativeName
   * @returns {Promise<AxiosResponse<any>>}
   */
  saveColor: (data) => api.post(url('SaveColor'), data),

  /**
   *
   * @returns {Promise<AxiosResponse<any>>}
   */
  fetchColorsList: () => api.get(url('GetColors')),

  /**
   *
   * @returns {Promise<AxiosResponse<any>>}
   */
  fetchColorsSelectList: () => api.get(url('GetColorsSelectList')),
};
