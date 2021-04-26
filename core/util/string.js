import { camelCase } from 'lodash';

const testString = (regExp, str) => regExp.test(String(str).toLowerCase());

/**
 *
 * @param {string} controller
 * @param {string} method
 * @returns {string}
 */
const createUrlRequestString = (controller, method) =>
  `${controller}/${method}`;

const getUpdateFnName = (prop) => camelCase('update ' + prop);
const getApplyFnName = (prop) => camelCase('apply ' + prop);
const getGetFnName = (prop) => camelCase('get ' + prop);
const getSetFnName = (prop) => camelCase('set ' + prop);

export {
  testString,
  createUrlRequestString,
  getUpdateFnName,
  getApplyFnName,
  getGetFnName,
  getSetFnName,
};
