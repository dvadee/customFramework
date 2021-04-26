import api from '@/services/api';

const employeesUrl = api.getRequestUrlCreator('admin/employees');
const accountUrl = api.getRequestUrlCreator('account');

export default {
  fetchUserProfile: () => api.get(employeesUrl('GetEmployeeProfile')),

  /**
   *
   * @param data
   * @param data.id
   * @param data.email
   * @param data.phone
   * @returns {Promise<AxiosResponse<any>>}
   */
  setUserContacts: (data) =>
    api.post(employeesUrl('SaveEmployeeContacts'), data),

  /**
   *
   * @param data
   * @param data.oldPassword
   * @param data.newPassword
   * @returns {Promise<AxiosResponse<any>>}
   */
  changeUserPassword: (data) => api.post(accountUrl('ChangePassword'), data),
};
