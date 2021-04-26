const emptyFn = function () {};

const returnTrue = () => true;

const returnFalse = () => false;

/**
 *
 * @param obj
 * @param prop
 * @returns {PropertyDescriptor}
 */
const getObjDesc = (obj, prop) => Object.getOwnPropertyDescriptor(obj, prop);

const isGetter = (obj, prop) => {
  const desc = getObjDesc(obj, prop);

  return desc && !!desc.get;
};

const isSetter = (obj, prop) => {
  const desc = getObjDesc(obj, prop);

  return desc && !!desc.set;
};
/**
 * Установить сразу несколько гетеров/сетеров
 * @param {Object} obj Объект к которому присвоится геттер сеттер
 * @param {Object} targetObj Объект откуда будет браться значение
 * @param {String[]} props Название
 * @param targetProp Откуда брать занчение из targetObj(указывать если отличается название)
 * @param [getter=true]
 * @param [setter=true]
 */
const batchCreateGetterSetterAlias = ({
  obj,
  targetObj,
  props,
  getter = true,
  setter = true,
}) => {
  props.forEach((prop) => {
    createGetterSetterAlias({ obj, targetObj, prop, getter, setter });
  });
};
/**
 *
 * @param obj Объект к которому присвоится геттер сеттер
 * @param targetObj Объект откуда будет браться значение
 * @param prop Название
 * @param targetProp Откуда брать занчение из targetObj(указывать если отличается название)
 * @param [getter=true]
 * @param [setter=true]
 */
const createGetterSetterAlias = ({
  obj,
  targetObj,
  prop,
  targetProp,
  getter = true,
  setter = true,
}) => {
  if (!targetProp) {
    targetProp = prop;
  }

  const desc = {};

  if (getter) {
    desc.get = function () {
      return targetObj[targetProp];
    };
  }

  if (setter) {
    desc.set = function (v) {
      targetObj[targetProp] = v;
    };
  }

  Object.defineProperty(obj, prop, desc);
};

const alias = (targetClass, method) => {
  if (!targetClass[method]) {
    return emptyFn;
  }

  return function () {
    return targetClass[method].apply(targetClass, arguments);
  };
};

const defer = (fn, time = 0) => setTimeout(fn, time);

const getObjMethodsNames = (obj, params = {}) => {
  const { exclude = [] } = params;

  let props = [];

  do {
    const l = Object.getOwnPropertyNames(obj)
      .concat(Object.getOwnPropertySymbols(obj).map((s) => s.toString()))
      .sort()
      .filter(
        (p, i, arr) =>
          typeof obj[p] === 'function' && //only the methods
          p !== 'constructor' && //not the constructor
          (i === 0 || p !== arr[i - 1]) && //not overriding in this prototype
          props.indexOf(p) === -1 && //not overridden in a child
          !exclude.includes(p)
      );
    props = props.concat(l);
  } while (
    (obj = Object.getPrototypeOf(obj)) && //walk-up the prototype chain
    Object.getPrototypeOf(obj) //not the the Object prototype methods (hasOwnProperty, etc...)
  );

  return props;
};

export {
  alias,
  emptyFn,
  returnTrue,
  returnFalse,
  defer,
  createGetterSetterAlias,
  batchCreateGetterSetterAlias,
  isGetter,
  isSetter,
  getObjDesc,
  getObjMethodsNames,
};
