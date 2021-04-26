import { isArray } from 'lodash';

const setCheckboxState = ($el, state) => {
  $el.prop('checked', state).uniform('refresh');
};

const getFormData = ($form) => {
  const values = $form.serializeArray().reduce((obj, { name, value }) => {
    if (name in obj) {
      const current = obj[name];

      if (!isArray(current)) {
        obj[name] = [current];
      }

      if (!obj[name].includes(value)) {
        obj[name].push(value);
      }
    } else {
      obj[name] = value;
    }

    return obj;
  }, {});

  return values;
};

export { setCheckboxState, getFormData };
