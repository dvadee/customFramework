/**
 * clear obj props
 * @param {Object} obj
 * @param {Function} processFn
 */
const unlink = (obj, processFn) => {
  for (let key in obj) {
    if (processFn) {
      processFn(key, obj);
    }

    obj[key] = null;
  }
};

export { unlink };
